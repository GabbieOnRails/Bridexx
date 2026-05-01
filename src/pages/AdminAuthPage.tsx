import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Smartphone, ArrowRight, Chrome } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminAuthPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await loginWithGoogle();
      navigate('/admin');
    } catch (err: any) {
      console.error("Admin Google Auth Error:", err);
      setError(err.message || 'Failed to authenticate');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-6" id="admin-auth-page">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-brand-charcoal/5 p-8 md:p-12 border border-brand-charcoal/5"
      >
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-brand-charcoal text-white rounded-2xl flex items-center justify-center shadow-lg">
            <Shield size={32} />
          </div>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-3xl font-serif italic text-brand-charcoal mb-2">Secure Gateway</h1>
          <p className="text-brand-charcoal/60">Authorized personnel only. Access via primary identity provider.</p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-8 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-medium border border-red-100"
          >
            {error}
          </motion.div>
        )}

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-white border-2 border-brand-charcoal/5 hover:border-brand-charcoal text-brand-charcoal p-5 rounded-2xl transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed group"
          id="google-auth-btn"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-brand-charcoal border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Chrome size={20} className="text-brand-charcoal transition-transform group-hover:scale-110" />
              <span>Continue with Google</span>
              <ArrowRight size={18} className="ml-auto text-brand-charcoal/20 group-hover:text-brand-charcoal group-hover:translate-x-1 transition-all" />
            </>
          )}
        </button>

        <div className="mt-12 pt-8 border-t border-brand-charcoal/5 text-center">
          <p className="text-xs text-brand-charcoal/30 uppercase tracking-widest font-bold">Encrypted Terminal</p>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminAuthPage;
