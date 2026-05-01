import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import firebaseConfig from './firebase-applet-config.json';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Firebase Admin
if (getApps().length === 0) {
  initializeApp({
    projectId: firebaseConfig.projectId,
  });
}

const db = getFirestore();
const auth = getAuth();

// SMTP Transporter Setup
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_PORT === "465", // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Bootstrap primary admin
  const primaryAdminEmail = "ambrosegabriel01@gmail.com".toLowerCase();
  const primaryAdminPass = "GabrielAdmin2024!";
  try {
    let user;
    try {
      user = await auth.getUserByEmail(primaryAdminEmail);
      console.log(`[Admin Bootstrap] User FOUND: ${primaryAdminEmail} (UID: ${user.uid})`);
      
      // Force password and status update
      await auth.updateUser(user.uid, { 
        password: primaryAdminPass,
        emailVerified: true,
        disabled: false // Ensure not disabled
      });
      console.log(`[Admin Bootstrap] Password reset to: ${primaryAdminPass}`);

      const userRef = db.collection('users').doc(user.uid);
      await userRef.set({
        name: user.displayName || 'Admin Gabriel',
        email: primaryAdminEmail,
        role: 'admin',
        requiresPasswordReset: false,
        updatedAt: FieldValue.serverTimestamp()
      }, { merge: true });
      console.log(`[Admin Bootstrap] Firestore profile synced.`);
    } catch (e: any) {
      if (e.code === 'auth/user-not-found') {
        console.log(`[Admin Bootstrap] User NOT FOUND. Creating new: ${primaryAdminEmail}`);
        user = await auth.createUser({
          email: primaryAdminEmail,
          password: primaryAdminPass,
          displayName: 'Admin Gabriel',
          emailVerified: true
        });
        await db.collection('users').doc(user.uid).set({
          name: 'Admin Gabriel',
          email: primaryAdminEmail,
          role: 'admin',
          requiresPasswordReset: false,
          createdAt: FieldValue.serverTimestamp(),
        });
        console.log(`[Admin Bootstrap] New user created.`);
      } else {
        throw e;
      }
    }
    
    await db.collection('admins').doc(user.uid).set({ email: primaryAdminEmail }, { merge: true });
    console.log(`[Admin Bootstrap] SUCCESS. Login: ${primaryAdminEmail} / ${primaryAdminPass}`);
    console.log(`[Admin Bootstrap] ALTERNATIVE: Use Google Login at /admin-auth for ${primaryAdminEmail}`);
  } catch (err) {
    console.error("[Admin Bootstrap] ERROR:", err);
  }

  app.get("/api/verify-smtp", async (req, res) => {
    try {
      await transporter.verify();
      res.status(200).json({ status: "success", message: "SMTP Server is ready to take messages" });
    } catch (error) {
      console.error("SMTP Verification failed:", error);
      res.status(500).json({ status: "error", message: error instanceof Error ? error.message : "Verification failed" });
    }
  });

  // API Routes
  app.post("/api/bootstrap-admin", async (req, res) => {
    const { email } = req.body;
    try {
      const userRecord = await auth.getUserByEmail(email);
      await db.collection('admins').doc(userRecord.uid).set({ email });
      await db.collection('users').doc(userRecord.uid).update({ role: 'admin' });
      res.status(200).json({ status: "success", message: `${email} is now an admin` });
    } catch (err) {
      res.status(500).json({ error: "Failed to bootstrap admin. Make sure user exists first." });
    }
  });

  app.post("/api/checkout", async (req, res) => {
    const { customer, order, measurements } = req.body;
    const { name, email, phone, address } = customer;

    try {
      let userRecord;
      let isNewUser = false;
      let tempPassword = Math.random().toString(36).slice(-8) + "!@#";

      try {
        userRecord = await auth.getUserByEmail(email);
      } catch (e: any) {
        if (e.code === 'auth/user-not-found') {
          // Create user
          userRecord = await auth.createUser({
            email,
            emailVerified: false,
            password: tempPassword,
            displayName: name,
            phoneNumber: phone.startsWith('+') ? phone : undefined,
          });
          isNewUser = true;

          // Create user doc in Firestore
          await db.collection('users').doc(userRecord.uid).set({
            name,
            email,
            phone,
            address,
            role: 'user',
            requiresPasswordReset: true,
            savedMeasurements: measurements,
            createdAt: FieldValue.serverTimestamp(),
          });
        } else {
          throw e;
        }
      }

      // Create Order in Firestore
      const orderRef = db.collection('orders').doc();
      const orderId = `LX-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      
      await orderRef.set({
        id: orderId,
        userId: userRecord.uid,
        measurements,
        productPrice: order.total,
        productPaymentStatus: 'paid', // Assuming payment successful
        shippingFee: null,
        shippingPaymentStatus: null,
        orderStatus: 'payment_confirmed',
        items: order.items,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });

      // Send Email
      const mailOptions = {
        from: process.env.SMTP_FROM_EMAIL || `"Bridexx Planet" <ceo@bridexxplanet.com>`,
        to: [email, "ceo@bridexxplanet.com"],
        subject: `Order Confirmed - ${orderId}`,
        html: `
          <div style="font-family: serif; color: #1a1a1a; padding: 40px; background-color: #fcfbf7; max-width: 600px; margin: 0 auto; border: 1px solid #e5e5e5; border-radius: 8px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #1a1a1a; font-style: italic; margin-bottom: 5px;">Bridexx Planet</h1>
              <p style="text-transform: uppercase; letter-spacing: 0.2em; font-size: 10px; color: #999;">Bespoke Luxury Atelier</p>
            </div>

            <p>Dear ${name},</p>
            <p>Thank you for choosing Bridexx Planet. Your order for a bespoke masterpiece is confirmed.</p>
            
            ${isNewUser ? `
            <div style="background-color: #f0f0f0; padding: 15px; border-radius: 4px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Your Account Created</h3>
              <p>We've created a dashboard for you to track your order.</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Temp Password:</strong> ${tempPassword}</p>
              <p style="font-size: 11px; color: #666;">You will be asked to change this password on your first login.</p>
            </div>
            ` : ''}

            <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #f0f0f0;">
              <h2 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em; border-bottom: 1px solid #eee; padding-bottom: 10px; margin-top: 0;">Order Summary</h2>
              <p style="margin: 10px 0;"><strong style="font-size: 12px; color: #666;">Order ID:</strong> <span style="font-family: monospace;">${orderId}</span></p>
              
              <div style="margin-top: 15px;">
                ${order.items.map((item: any) => `
                  <div style="display: flex; justify-content: space-between; margin-bottom: 5px; font-size: 13px;">
                    <span>${item.name}</span>
                    <span style="font-weight: bold;">₦${item.priceValue.toLocaleString()}</span>
                  </div>
                `).join('')}
              </div>
              <div style="border-top: 1px solid #eee; margin-top: 15px; padding-top: 15px; display: flex; justify-content: space-between;">
                <strong style="text-transform: uppercase; font-size: 12px;">Total</strong>
                <strong style="font-size: 18px;">₦${order.total.toLocaleString()}</strong>
              </div>
            </div>

            <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee;">
              <a href="https://wa.me/message/SUZYWEGCRSVQO1" style="text-decoration: none; color: #1a1a1a; font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; border: 1px solid #1a1a1a; padding: 10px 20px; border-radius: 4px;">Contact Atelier via WhatsApp</a>
            </div>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);

      // Create custom token for automatic login
      const customToken = await auth.createCustomToken(userRecord.uid);

      res.status(200).json({ status: "success", customToken, isNewUser });
    } catch (err) {
      console.error("Checkout error:", err);
      res.status(500).json({ error: "Failed to complete checkout" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
