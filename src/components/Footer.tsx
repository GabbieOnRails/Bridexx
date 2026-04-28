import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Scissors, Star, Truck, Ruler } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative overflow-hidden">
      {/* Top Features Section */}
      <div className="bg-[#FAFAFA] py-32 px-6 md:px-12 border-t border-brand-charcoal/5 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-12 md:gap-16">
          <div className="flex flex-col items-center text-center group">
            <div className="w-12 h-12 flex items-center justify-center mb-6 text-brand-charcoal hover:scale-110 transition-transform">
              <Scissors size={28} strokeWidth={1} />
            </div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-2">Accurate Fitting</h4>
            <p className="text-[10px] text-brand-charcoal/40 italic">Tailored to perfection</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 flex items-center justify-center mb-6 text-brand-charcoal">
              <Star size={28} strokeWidth={1} />
            </div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-2">Premium Quality Fabrics</h4>
            <p className="text-[10px] text-brand-charcoal/40 italic">Only the finest materials</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 flex items-center justify-center mb-6 text-brand-charcoal">
              <Truck size={28} strokeWidth={1} />
            </div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-2">Timely Delivery</h4>
            <p className="text-[10px] text-brand-charcoal/40 italic">Guaranteed on-time for your big day</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 flex items-center justify-center mb-6 text-brand-charcoal">
              <Ruler size={28} strokeWidth={1} />
            </div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-2">Fitting</h4>
            <p className="text-[10px] text-brand-charcoal/40 italic">Personalized touches to match your vision</p>
          </div>
        </div>
      </div>

      {/* Main Dark Footer */}
      <div className="bg-brand-charcoal text-white pt-24 pb-12 px-6 md:px-12 relative overflow-hidden rounded-t-[40px] md:rounded-t-[80px]">
        {/* Background Image Overlay */}
        <div 
          className="absolute inset-0 opacity-40 transition-opacity duration-1000 group-hover:opacity-50 mix-blend-luminosity"
          style={{ 
            backgroundImage: 'url("https://i.ibb.co/PGF8XMTt/bridexx-planet-1752308816-3674955167196200384-34446236868.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center 20%'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-charcoal/90 via-brand-charcoal/60 to-brand-charcoal/90 z-0" />

        <div className="max-w-7xl mx-auto relative z-10">

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 md:gap-12 mb-20">
            {/* Column 1: About */}
            <div className="space-y-6">
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white">About the Brand</h4>
              <p className="text-xs leading-relaxed text-white/40 italic font-light max-w-sm">
                Founded with a focus on creating smart, elegant, and timeless bridal attire for the modern woman. Bridexx Planet is dedicated to providing bespoke design and handcrafted fits that make every bride feel like royalty.
              </p>
            </div>

            {/* Column 2: Talk */}
            <div className="space-y-6">
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white">Talk</h4>
              <ul className="space-y-4 text-xs font-light text-white/40 italic">
                <li><Link to="/book-consultation" className="hover:text-brand-rose transition-colors">Book a Consultation</Link></li>
                <li><a href="mailto:hello@bridexxplanet.com" className="hover:text-brand-rose transition-colors">Email us</a></li>
                <li><a href="tel:+2347000000000" className="hover:text-brand-rose transition-colors">Call us</a></li>
                <li><a href="https://wa.me/2347000000000" className="hover:text-brand-rose transition-colors">Text us on WhatsApp</a></li>
              </ul>
            </div>

            {/* Column 3: Ask */}
            <div className="space-y-6">
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white">Ask</h4>
              <ul className="space-y-4 text-xs font-light text-white/40 italic">
                <li><Link to="/shop" className="hover:text-brand-rose transition-colors">Shop Gowns</Link></li>
                <li><Link to="/our-process" className="hover:text-brand-rose transition-colors">Our Consultation Process</Link></li>
                <li><Link to="/price-guide" className="hover:text-brand-rose transition-colors">Pricing Guide</Link></li>
                <li><Link to="/" className="hover:text-brand-rose transition-colors">FAQs</Link></li>
              </ul>
            </div>

            {/* Column 4: Stalk (Socials) */}
            <div className="space-y-6">
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white">Stalk</h4>
              <ul className="space-y-4 text-xs font-light text-white/40 italic">
                <li>
                  <a href="https://facebook.com" className="flex items-center gap-3 hover:text-brand-rose transition-colors">
                    <Facebook size={14} /> Facebook
                  </a>
                </li>
                <li>
                  <a href="https://instagram.com/bridexx.planet" className="flex items-center gap-3 hover:text-brand-rose transition-colors">
                    <Instagram size={14} /> Instagram
                  </a>
                </li>
                <li>
                  <a href="https://tiktok.com" className="flex items-center gap-3 hover:text-brand-rose transition-colors">
                    <span className="text-[10px] font-bold">TikTok</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Copyright */}
          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[10px] text-white/20 uppercase tracking-[0.2em] font-medium gap-4">
            <p>© 2026 BRIDEXX PLANET. ALL RIGHTS RESERVED.</p>
            <div className="flex gap-8">
              <Link to="/" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="/" className="hover:text-white transition-colors">Terms of Use</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
