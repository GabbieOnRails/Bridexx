import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Menu, X, Instagram, Facebook, Phone, Mail, MapPin, Calendar, Tag, List, Ruler, Gem, Clock, Scissors, Star, ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import BookingPage from './pages/BookingPage';
import PricingPage from './pages/PricingPage';
import ProcessPage from './pages/ProcessPage';
import ShopPage from './pages/ShopPage';

export default function App() {
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-brand-rose selection:text-white text-brand-charcoal">
      <Navbar />
      <main className="flex-grow pt-20 lg:pt-24 focus:outline-none bg-neutral-100/50">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Routes location={location}>
              <Route path="/" element={<HomePage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/book-consultation" element={<BookingPage />} />
              <Route path="/price-guide" element={<PricingPage />} />
              <Route path="/our-process" element={<ProcessPage />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}
