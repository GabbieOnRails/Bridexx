import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Search, Filter, ArrowRight, Heart } from 'lucide-react';

const products = [
  {
    id: 1,
    name: "The Amara Silhouette",
    price: "₦550,000",
    image: "https://i.ibb.co/RkZ6YZtW/bridexx-planet-1777276602-3884399822497469036-34446236868.jpg",
    category: "Gowns"
  },
  {
    id: 2,
    name: "Imperial Lace Ensemble",
    price: "₦720,000",
    image: "https://i.ibb.co/9mWs9CQT/bridexx-planet-1777011295-3882174021060335182-34446236868.jpg",
    category: "Traditional"
  },
  {
    id: 3,
    name: "Celestial Tulle Gown",
    price: "₦680,000",
    image: "https://i.ibb.co/hJFFd4qR/bridexx-planet-1777011295-3882174028064877310-34446236868.jpg",
    category: "Gowns"
  },
  {
    id: 4,
    name: "The Royal Meridian",
    price: "₦850,000",
    image: "https://i.ibb.co/VYZrs2tC/bridexx-planet-1776674217-3879345988536444726-34446236868.jpg",
    category: "Bespoke"
  },
  {
    id: 5,
    name: "Ivory Whisper Dress",
    price: "₦500,000",
    image: "https://i.ibb.co/3X2jpNm/bridexx-planet-1769861631-3822197899820628201-34446236868.jpg",
    category: "Reception"
  },
  {
    id: 6,
    name: "Golden Heritage Wrap",
    price: "₦620,000",
    image: "https://i.ibb.co/ZRX9FyB0/bridexx-planet-1766477099-3793807340378850297-34446236868.jpg",
    category: "Traditional"
  },
  {
    id: 7,
    name: "The Eternal Grace",
    price: "₦950,000",
    image: "https://i.ibb.co/vvq5gSnY/bridexx-planet-1751102901-3664839223543082471-34446236868.jpg",
    category: "Gowns"
  },
  {
    id: 8,
    name: "Majestic Bloom Gown",
    price: "₦780,000",
    image: "https://i.ibb.co/0V1w35QL/bridexx-planet-1777011295-3882174121455239540-34446236868.jpg",
    category: "Reception"
  }
];

const ShopPage = () => {
  const [filter, setFilter] = useState('All');
  const categories = ['All', 'Gowns', 'Traditional', 'Reception', 'Bespoke'];

  const filteredProducts = filter === 'All' 
    ? products 
    : products.filter(p => p.category === filter);

  return (
    <div className="bg-brand-offwhite min-h-screen">
      {/* Header */}
      <section className="pt-32 pb-16 px-6 md:px-12 bg-white">
        <div className="max-w-[1800px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <span className="text-[10px] uppercase tracking-[0.4em] font-black text-brand-charcoal/30 mb-4 block">The Collection</span>
              <h1 className="editorial-heading text-5xl md:text-7xl text-brand-charcoal leading-tight">
                Shop Our <span className="text-brand-charcoal/40 font-light italic">Latest Looks</span>
              </h1>
            </div>
            <div className="flex items-center gap-4 pb-4">
              <div className="relative group">
                <Search size={16} className="absolute left-0 top-1/2 -translate-y-1/2 text-brand-charcoal/40 group-focus-within:text-brand-charcoal transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search products..." 
                  className="bg-transparent border-b border-brand-charcoal/10 outline-none pl-6 pr-4 py-2 text-xs italic w-48 focus:border-brand-charcoal transition-all focus:w-64"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-20 lg:top-24 bg-white/80 backdrop-blur-md z-30 border-b border-brand-charcoal/5 px-6 md:px-12 py-6">
        <div className="max-w-[1800px] mx-auto flex items-center justify-between">
          <div className="flex gap-8 overflow-x-auto no-scrollbar pb-2 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`text-[10px] uppercase tracking-[0.2em] font-black transition-all whitespace-nowrap ${
                  filter === cat ? 'text-brand-charcoal' : 'text-brand-charcoal/30 hover:text-brand-charcoal/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <button className="hidden md:flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-black text-brand-charcoal/40 hover:text-brand-charcoal transition-colors">
            <Filter size={14} /> Filter & Sort
          </button>
        </div>
      </section>

      {/* Product Grid */}
      <section className="py-20 px-6 md:px-12">
        <div className="max-w-[1800px] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5 }}
                  className="group"
                >
                  <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-neutral-100 mb-6">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    {/* Hover Actions */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">
                      <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-brand-charcoal hover:bg-brand-rose hover:text-white transition-colors shadow-lg">
                        <Heart size={16} />
                      </button>
                    </div>

                    <button className="absolute bottom-4 left-4 right-4 py-4 bg-white/90 backdrop-blur-sm text-brand-charcoal text-[10px] uppercase tracking-widest font-black translate-y-20 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 hover:bg-brand-charcoal hover:text-white rounded-xl">
                      Add to Bag
                    </button>
                  </div>

                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[9px] uppercase tracking-widest text-brand-charcoal/30 font-black mb-1">{product.category}</p>
                      <h3 className="text-sm font-medium text-brand-charcoal transition-colors group-hover:text-brand-charcoal/60">{product.name}</h3>
                    </div>
                    <p className="text-sm font-bold text-brand-charcoal">{product.price}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          {filteredProducts.length === 0 && (
            <div className="py-40 text-center">
              <p className="text-brand-charcoal/40 italic">No items found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-32 px-6 bg-brand-charcoal text-white rounded-t-[40px] md:rounded-t-[80px]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="editorial-heading text-4xl md:text-6xl mb-8">Can't Find Your <span className="italic font-light">Dream Look?</span></h2>
          <p className="text-white/40 italic mb-12 max-w-xl mx-auto">We specialize in custom bridal designs. Book a consultation to start your bespoke journey.</p>
          <Link 
            to="/book-consultation"
            className="px-12 py-4 border border-white/20 hover:bg-white hover:text-brand-charcoal transition-all text-[11px] uppercase tracking-[0.3em] font-bold rounded-sm inline-block"
          >
            Book a Consultation
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ShopPage;
