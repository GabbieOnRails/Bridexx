import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Search, User, ShoppingBag, X, Instagram, Facebook, Twitter, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';

interface NavbarProps {
  cartCount: number;
  onCartClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ cartCount, onCartClick }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { currentUser, userProfile } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Price Guide', path: '/price-guide' },
    { name: 'Our Process', path: '/our-process' },
  ];

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 border-b border-brand-charcoal/5 ${
          scrolled 
            ? 'bg-brand-offwhite/95 md:bg-brand-offwhite backdrop-blur-md md:backdrop-blur-none py-5 shadow-sm' 
            : 'bg-brand-offwhite py-8'
        }`}
      >
        <div className="max-w-[1800px] mx-auto px-6 md:px-10 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <button 
              onClick={() => setIsMenuOpen(true)}
              className="hover:opacity-50 transition-opacity text-brand-charcoal"
            >
              <Menu size={20} strokeWidth={1.5} />
            </button>
          </div>

          <Link to="/" className="absolute left-1/2 -translate-x-1/2 h-full flex items-center">
            <img 
              src="https://i.ibb.co/67tfd9MQ/Bridexx-Logo.png" 
              alt="Bridexx Planet" 
              className={`transition-all duration-700 h-10 md:h-12 object-contain ${scrolled ? 'scale-90' : 'scale-100'}`}
            />
          </Link>

          <div className="flex items-center space-x-6">
            <Link 
              to={currentUser ? (userProfile?.role === 'admin' ? '/admin' : '/dashboard') : '/login'} 
              className="hover:opacity-50 transition-opacity text-brand-charcoal flex items-center gap-2"
            >
              {currentUser ? <LayoutDashboard size={20} strokeWidth={1.5} /> : <User size={20} strokeWidth={1.5} />}
              {currentUser && <span className="hidden lg:inline text-[9px] uppercase tracking-widest font-black">Portal</span>}
            </Link>
            <button 
              onClick={onCartClick}
              className="hover:opacity-50 transition-opacity relative text-brand-charcoal"
            >
              <ShoppingBag size={20} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 text-[7px] flex items-center justify-center rounded-full font-black bg-brand-charcoal text-white">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            key="nav-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMenuOpen(false)}
            className="fixed inset-0 bg-brand-charcoal/40 backdrop-blur-sm z-[60]"
          />
        )}
        {isMenuOpen && (
          <motion.div 
            key="nav-drawer"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 bottom-0 w-full max-w-[320px] bg-white z-[70] p-10 flex flex-col shadow-2xl"
          >
            <div className="flex justify-between items-center mb-16">
              <span className="editorial-heading text-2xl text-brand-charcoal">Menu</span>
              <button 
                type="button"
                onClick={() => setIsMenuOpen(false)}
                className="w-10 h-10 flex items-center justify-center border border-brand-charcoal/10 rounded-full text-brand-charcoal hover:bg-brand-charcoal hover:text-white transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex flex-col gap-8 flex-grow text-[15px]">
              {navLinks.map((link, index) => (
                <motion.div
                  key={`nav-item-${link.path}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link 
                    to={link.path}
                    className="editorial-heading md:text-3xl font-bold tracking-tight text-brand-charcoal hover:italic hover:pl-4 transition-all duration-300 block"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}

              {currentUser && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Link 
                    to={userProfile?.role === 'admin' ? '/admin' : '/dashboard'}
                    className="editorial-heading md:text-3xl font-bold tracking-tight text-brand-rose hover:italic hover:pl-4 transition-all duration-300 block"
                  >
                    {userProfile?.role === 'admin' ? 'Atelier Control' : 'My Dashboard'}
                  </Link>
                </motion.div>
              )}
            </div>

            <div className="mt-auto space-y-8 pt-8 border-t border-brand-charcoal/5">
              {!currentUser && (
                <Link to="/login" className="block text-[10px] uppercase font-black tracking-[0.2em] bg-neutral-50 p-4 text-center rounded-xl hover:bg-neutral-100 transition-all">
                  Client sign in
                </Link>
              )}
              <div>
                <h4 className="text-[10px] uppercase font-black tracking-widest text-brand-charcoal/30 mb-4">Connect</h4>
                <div className="flex gap-6">
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-brand-charcoal/40 hover:text-brand-charcoal transition-colors">
                    <Instagram size={18} />
                  </a>
                  <a href="https://www.facebook.com/profile.php?id=100086112667089&mibextid=wwXIfr&mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="text-brand-charcoal/40 hover:text-brand-charcoal transition-colors">
                    <Facebook size={18} />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
