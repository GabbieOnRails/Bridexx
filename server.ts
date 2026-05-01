import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { Resend } from "resend";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
  app.post("/api/send-order-email", async (req, res) => {
    const { customer, order, measurements } = req.body;

    // Check if SMTP is configured
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.error("SMTP configuration missing");
      return res.status(500).json({ error: "Email service not configured. Please provide SMTP credentials." });
    }

    try {
      const mailOptions = {
        from: process.env.SMTP_FROM_EMAIL || `"Bridexx Planet" <ceo@bridexxplanet.com>`,
        to: [customer.email, "ceo@bridexxplanet.com"],
        subject: `New Order Confirmation - ${order.id}`,
        html: `
          <div style="font-family: serif; color: #1a1a1a; padding: 40px; background-color: #fcfbf7; max-width: 600px; margin: 0 auto; border: 1px solid #e5e5e5; border-radius: 8px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #1a1a1a; font-style: italic; margin-bottom: 5px;">Bridexx Planet</h1>
              <p style="text-transform: uppercase; letter-spacing: 0.2em; font-size: 10px; color: #999;">Bespoke Luxury Atelier</p>
            </div>

            <p>Dear ${customer.name},</p>
            <p>Thank you for choosing Bridexx Planet. We have received your order for your bespoke masterpiece. Our artisans are ready to begin the meticulous process of crafting your garment.</p>
            
            <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #f0f0f0;">
              <h2 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em; border-bottom: 1px solid #eee; padding-bottom: 10px; margin-top: 0;">Order Summary</h2>
              <p style="margin: 10px 0;"><strong style="font-size: 12px; color: #666;">Order ID:</strong> <span style="font-family: monospace;">${order.id}</span></p>
              <p style="margin: 10px 0;"><strong style="font-size: 12px; color: #666;">Date:</strong> ${new Date().toLocaleDateString()}</p>
              
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

            <div style="margin-bottom: 25px;">
              <h2 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em; border-bottom: 1px solid #eee; padding-bottom: 10px;">Atelier Measurements</h2>
              <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
                ${Object.entries(measurements).map(([key, value]) => `
                  <tr>
                    <td style="padding: 6px 0; color: #666; text-transform: capitalize; border-bottom: 1px solid #fafafa;">${key.replace(/([A-Z])/g, ' $1')}:</td>
                    <td style="padding: 6px 0; text-align: right; font-weight: bold; border-bottom: 1px solid #fafafa;">${value}</td>
                  </tr>
                `).join('')}
              </table>
            </div>

            <div style="margin-bottom: 25px;">
              <h2 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em; border-bottom: 1px solid #eee; padding-bottom: 10px;">Courier Details</h2>
              <p style="font-size: 13px; margin: 5px 0;">${customer.address}</p>
              <p style="font-size: 13px; margin: 5px 0;">${customer.phone}</p>
            </div>

            <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="font-style: italic; color: #999; font-size: 12px;">"Confidence is your best accessory - wear it in luxury."</p>
              <div style="margin-top: 20px;">
                <a href="https://wa.me/message/SUZYWEGCRSVQO1" style="text-decoration: none; color: #1a1a1a; font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; border: 1px solid #1a1a1a; padding: 10px 20px; border-radius: 4px;">Contact Atelier via WhatsApp</a>
              </div>
            </div>
          </div>
        `,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log('Order email sent successfully via SMTP: %s', info.messageId);
      res.status(200).json({ status: "success", messageId: info.messageId });
    } catch (err) {
      console.error("SMTP dispatch error:", err);
      res.status(500).json({ error: "Email delivery failed" });
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
