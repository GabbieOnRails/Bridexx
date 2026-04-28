import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Search, User, ShoppingBag, X, Instagram, Facebook, Twitter } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

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
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          scrolled ? 'bg-white/80 backdrop-blur-md border-b border-brand-charcoal/5 py-4' : 'bg-transparent py-8'
        }`}
      >
        <div className="max-w-[1800px] mx-auto px-6 md:px-10 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <button 
              onClick={() => setIsMenuOpen(true)}
              className={`hover:opacity-50 transition-opacity ${scrolled ? 'text-brand-charcoal' : 'text-white'}`}
            >
              <Menu size={20} strokeWidth={1.5} />
            </button>
          </div>

          <Link to="/" className="absolute left-1/2 -translate-x-1/2">
            <h1 className={`text-xl md:text-2xl font-black tracking-tighter transition-all duration-500 uppercase ${scrolled ? 'scale-90 text-brand-charcoal' : 'scale-100 text-white'}`}>
              Bridexx <span className={`${scrolled ? 'text-brand-grey' : 'text-white/60'} font-light`}>Planet</span>
            </h1>
          </Link>

          <div className="flex items-center space-x-6">
            <button className={`hidden md:block hover:opacity-50 transition-opacity ${scrolled ? 'text-brand-charcoal' : 'text-white'}`}>
              <Search size={20} strokeWidth={1.5} />
            </button>
            <button className={`hover:opacity-50 transition-opacity relative ${scrolled ? 'text-brand-charcoal' : 'text-white'}`}>
              <ShoppingBag size={20} strokeWidth={1.5} />
              <span className={`absolute -top-1 -right-1 w-3 h-3 text-[7px] flex items-center justify-center rounded-full ${scrolled ? 'bg-brand-charcoal text-white' : 'bg-white text-brand-charcoal'}`}>0</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMenuOpen(false)}
            className="fixed inset-0 bg-brand-charcoal/40 backdrop-blur-sm z-[60]"
          />
        )}
        {isMenuOpen && (
          <motion.div 
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

            <div className="flex flex-col gap-8 flex-grow">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link 
                    to={link.path}
                    className="editorial-heading text-4xl text-brand-charcoal hover:italic hover:pl-4 transition-all duration-300 block"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="mt-auto space-y-8 pt-8 border-t border-brand-charcoal/5">
              <div>
                <h4 className="text-[10px] uppercase font-black tracking-widest text-brand-charcoal/30 mb-4">Connect</h4>
                <div className="flex gap-6">
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-brand-charcoal/40 hover:text-brand-charcoal transition-colors">
                    <Instagram size={18} />
                  </a>
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-brand-charcoal/40 hover:text-brand-charcoal transition-colors">
                    <Facebook size={18} />
                  </a>
                </div>
              </div>
              <div className="pb-4">
                <p className="text-[10px] text-brand-charcoal/50 leading-relaxed italic">
                  Lagos, Nigeria<br />
                  hello@bridexxplanet.com
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
