import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const ResetPasswordPage = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { updateUserPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await updateUserPassword(newPassword);
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      console.error(err);
      setError('Failed to update password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 bg-neutral-100/30">
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-w-md w-full bg-white p-10 md:p-14 rounded-[2.5rem] shadow-xl border border-brand-charcoal/5"
      >
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-brand-rose/10 text-brand-rose rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldCheck size={32} />
          </div>
          <h2 className="text-3xl font-sans font-bold text-brand-charcoal mb-2 italic">Secure Account</h2>
          <p className="text-[10px] uppercase tracking-widest font-black text-brand-charcoal/30">Please set a permanent password</p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 text-red-500 text-xs rounded-xl border border-red-100 italic">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[9px] uppercase tracking-widest font-black text-brand-charcoal/40 block ml-1">New Password</label>
            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-charcoal/20" size={18} />
              <input 
                type="password" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full bg-neutral-50 border border-brand-charcoal/5 p-5 pl-14 rounded-2xl focus:outline-none focus:border-brand-charcoal font-serif italic transition-all" 
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[9px] uppercase tracking-widest font-black text-brand-charcoal/40 block ml-1">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-charcoal/20" size={18} />
              <input 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full bg-neutral-50 border border-brand-charcoal/5 p-5 pl-14 rounded-2xl focus:outline-none focus:border-brand-charcoal font-serif italic transition-all" 
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-brand-charcoal text-white py-5 rounded-2xl text-[10px] uppercase tracking-[0.25em] font-black hover:bg-brand-rose transition-all flex items-center justify-center gap-3 shadow-lg disabled:opacity-50"
          >
            {loading ? 'Securing Account...' : 'Set Password & Continue'} <ArrowRight size={16} />
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ResetPasswordPage;
