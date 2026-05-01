import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithCustomToken, 
  signOut as firebaseSignOut,
  User as FirebaseUser,
  signInWithEmailAndPassword,
  updatePassword,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';

interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  role: 'user' | 'admin';
  requiresPasswordReset: boolean;
  savedMeasurements: any;
}

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  loginByToken: (token: string) => Promise<void>;
  loginByEmail: (email: string, pass: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateUserPassword: (newPass: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (!user) {
        setUserProfile(null);
        setLoading(false);
      } else {
        setLoading(true);
      }
    });

    return unsubscribeAuth;
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    const unsubscribeProfile = onSnapshot(doc(db, 'users', currentUser.uid), (docSnap) => {
      if (docSnap.exists()) {
        setUserProfile({ uid: currentUser.uid, ...docSnap.data() } as UserProfile);
        setLoading(false);
      } else {
        // Fallback for missing profile (e.g., first-time Google login)
        const defaultProfile: UserProfile = {
          uid: currentUser.uid,
          name: currentUser.displayName || 'Atelier Client',
          email: currentUser.email || '',
          phone: '',
          address: '',
          role: 'user',
          requiresPasswordReset: false,
          savedMeasurements: {
            bust: "", waist: "", hips: "", shoulder: "", sleeve: "", length: "", neck: ""
          }
        };
        // We don't necessarily set it in Firestore here to avoid unintended writes on every snapshot of missing doc, 
        // but we can set it in state so the app doesn't crash/redirect.
        // Actually, let's proactively create it IF we are sure it's a real user.
        setDoc(doc(db, 'users', currentUser.uid), {
          ...defaultProfile,
          createdAt: new Date()
        }, { merge: true }).then(() => {
          setUserProfile(defaultProfile);
          setLoading(false);
        }).catch(err => {
          console.error("Profile auto-creation failed:", err);
          setLoading(false);
        });
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `users/${currentUser.uid}`);
      setLoading(false);
    });

    return unsubscribeProfile;
  }, [currentUser]);

  const loginByToken = async (token: string) => {
    await signInWithCustomToken(auth, token);
  };

  const loginByEmail = async (email: string, pass: string) => {
    setLoading(true);
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const logout = async () => {
    await firebaseSignOut(auth);
  };

  const updateUserPassword = async (newPass: string) => {
    if (!currentUser) throw new Error("No user logged in");
    await updatePassword(currentUser, newPass);
    // Mark reset as done in Firestore
    try {
      await setDoc(doc(db, 'users', currentUser.uid), {
        requiresPasswordReset: false
      }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${currentUser.uid}`);
    }
  };

  const value = {
    currentUser,
    userProfile,
    loading,
    loginByToken,
    loginByEmail,
    loginWithGoogle,
    logout,
    updateUserPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
