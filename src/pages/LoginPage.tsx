import React, { useState } from 'react';
import { motion } from 'motion/react';
import { LogIn, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { loginByEmail } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await loginByEmail(email.trim().toLowerCase(), password.trim());
      navigate(from, { replace: true });
    } catch (err: any) {
      console.error("Login Error:", err);
      const errorCode = err.code || 'unknown';
      if (errorCode === 'auth/wrong-password' || errorCode === 'auth/user-not-found' || errorCode === 'auth/invalid-credential') {
        setError('Invalid email or password. Please try again.');
      } else {
        setError(`Login error: ${errorCode}. Please contact support.`);
      }
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
          <h2 className="text-3xl font-sans font-bold text-brand-charcoal mb-2 italic">Atelier Sign In</h2>
          <p className="text-[10px] uppercase tracking-widest font-black text-brand-charcoal/30">Welcome back to Bridexx Planet</p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 text-red-500 text-xs rounded-xl border border-red-100 italic">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[9px] uppercase tracking-widest font-black text-brand-charcoal/40 block ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-charcoal/20" size={18} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-neutral-50 border border-brand-charcoal/5 p-5 pl-14 rounded-2xl focus:outline-none focus:border-brand-charcoal font-serif italic transition-all" 
                placeholder="email@example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[9px] uppercase tracking-widest font-black text-brand-charcoal/40 block ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-charcoal/20" size={18} />
              <input 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-neutral-50 border border-brand-charcoal/5 p-5 pl-14 pr-14 rounded-2xl focus:outline-none focus:border-brand-charcoal font-serif italic transition-all" 
                placeholder="••••••••"
              />
              <button
                type="button"
                className="absolute right-5 top-1/2 -translate-y-1/2 text-brand-charcoal/20 hover:text-brand-charcoal transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-brand-charcoal text-white py-5 rounded-2xl text-[10px] uppercase tracking-[0.25em] font-black hover:bg-brand-rose transition-all flex items-center justify-center gap-3 shadow-lg disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Enter Atelier'} <ArrowRight size={16} />
          </button>
        </form>

        <div className="mt-12 pt-8 border-t border-brand-charcoal/5 text-center">
          <p className="text-[10px] text-brand-charcoal/40 uppercase tracking-widest font-black mb-4">New to our planet?</p>
          <Link to="/shop" className="text-[10px] uppercase tracking-widest font-black text-brand-charcoal hover:text-brand-rose transition-colors">
            Browse our catalog
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
