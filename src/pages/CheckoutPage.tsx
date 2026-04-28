import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Truck, CreditCard, CheckCircle, ChevronRight, Lock } from 'lucide-react';
import { Product } from '../constants';
import { Link } from 'react-router-dom';

interface CheckoutPageProps {
  cart: Product[];
  clearCart: () => void;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ cart, clearCart }) => {
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  
  const subtotal = cart.reduce((acc, item) => acc + item.priceValue, 0);
  const delivery = 5000;
  const total = subtotal + delivery;

  const handlePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsFinished(true);
      clearCart();
    }, 3000);
  };

  if (isFinished) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-xl w-full bg-white p-12 md:p-20 text-center shadow-2xl border border-brand-charcoal/5 rounded-[3rem]"
        >
          <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-10">
            <CheckCircle size={48} strokeWidth={1.5} />
          </div>
          <h2 className="text-4xl md:text-5xl font-sans font-bold text-brand-charcoal mb-6 leading-tight">Order <span className="italic font-light text-brand-charcoal/40">Successful</span></h2>
          <p className="text-brand-charcoal/50 leading-relaxed mb-12 italic text-lg">
            Your journey with Bridexx Planet has officially begun. An order confirmation has been sent to your email. Our concierge will contact you within 24 hours to discuss fitting details.
          </p>
          <Link 
            to="/" 
            className="inline-block bg-brand-charcoal text-white px-12 py-5 rounded-xl text-[10px] uppercase tracking-widest font-black hover:bg-brand-rose transition-all shadow-xl"
          >
            Return to Atelier
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="py-24 md:py-32 px-6 md:px-12 lg:px-16 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
        {/* Checkout Steps */}
        <div className="flex-grow space-y-12">
          <div className="flex items-center gap-6 mb-12">
            {[1, 2, 3].map((s) => (
              <React.Fragment key={s}>
                <div className={`flex items-center gap-3 ${step >= s ? 'text-brand-charcoal' : 'text-brand-charcoal/20'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border text-[10px] font-black ${step >= s ? 'border-brand-charcoal bg-brand-charcoal text-white' : 'border-brand-charcoal/10'}`}>
                    {s}
                  </div>
                  <span className="text-[10px] uppercase tracking-widest font-black hidden sm:block">
                    {s === 1 ? 'Shipping' : s === 2 ? 'Payment' : 'Review'}
                  </span>
                </div>
                {s < 3 && <div className={`flex-grow h-px ${step > s ? 'bg-brand-charcoal' : 'bg-brand-charcoal/10'}`} />}
              </React.Fragment>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-10"
              >
                <h3 className="text-3xl font-sans font-bold text-brand-charcoal">Shipping Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase tracking-widest font-black text-brand-charcoal/40">Full Name</label>
                    <input type="text" className="w-full bg-white border border-brand-charcoal/10 p-5 rounded-xl focus:outline-none focus:border-brand-charcoal font-serif italic" placeholder="Ama Okafor" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase tracking-widest font-black text-brand-charcoal/40">Phone Number</label>
                    <input type="tel" className="w-full bg-white border border-brand-charcoal/10 p-5 rounded-xl focus:outline-none focus:border-brand-charcoal font-serif italic" placeholder="+234..." />
                  </div>
                  <div className="md:col-span-2 space-y-3">
                    <label className="text-[10px] uppercase tracking-widest font-black text-brand-charcoal/40">Shipping Address</label>
                    <input type="text" className="w-full bg-white border border-brand-charcoal/10 p-5 rounded-xl focus:outline-none focus:border-brand-charcoal font-serif italic" placeholder="Street, City, State" />
                  </div>
                </div>
                <button 
                  onClick={() => setStep(2)}
                  className="w-full md:w-auto px-12 py-5 bg-brand-charcoal text-white rounded-xl text-[10px] uppercase tracking-widest font-black hover:bg-brand-rose transition-all flex items-center justify-center gap-3"
                >
                  Continue to Payment <ChevronRight size={16} />
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-10"
              >
                <div className="flex justify-between items-end">
                  <h3 className="text-3xl font-sans font-bold text-brand-charcoal">Payment Method</h3>
                  <div className="flex items-center gap-2 text-green-500">
                    <Lock size={12} />
                    <span className="text-[10px] uppercase tracking-widest font-black">Secure Encryption</span>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {['Credit/Debit Card', 'Bank Transfer', 'Payment on Consultation'].map((method) => (
                    <label key={method} className="flex items-center justify-between p-6 bg-white border border-brand-charcoal/10 rounded-2xl cursor-pointer hover:border-brand-charcoal transition-all group">
                      <div className="flex items-center gap-4">
                        <div className="w-5 h-5 rounded-full border-2 border-brand-charcoal/20 flex items-center justify-center group-hover:border-brand-charcoal transition-all">
                          <div className="w-2 h-2 rounded-full bg-brand-charcoal opacity-0" />
                        </div>
                        <span className="text-sm font-bold">{method}</span>
                      </div>
                      {method === 'Credit/Debit Card' && <CreditCard size={20} className="text-brand-charcoal/20" />}
                    </label>
                  ))}
                </div>

                <div className="flex gap-4">
                  <button onClick={() => setStep(1)} className="px-12 py-5 border border-brand-charcoal/10 text-brand-charcoal rounded-xl text-[10px] uppercase tracking-widest font-black hover:bg-brand-charcoal hover:text-white transition-all">
                    Back
                  </button>
                  <button 
                    onClick={() => setStep(3)}
                    className="flex-grow md:flex-none md:px-12 py-5 bg-brand-charcoal text-white rounded-xl text-[10px] uppercase tracking-widest font-black hover:bg-brand-rose transition-all"
                  >
                    Confirm Order Review
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-10"
              >
                <div className="bg-brand-charcoal text-white p-10 md:p-14 rounded-3xl space-y-10 text-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-brand-rose/10 rounded-full blur-[80px]" />
                  <h3 className="text-3xl md:text-4xl font-sans font-bold leading-tight">Proceed to Secure <span className="italic font-light text-brand-beige">Finalization</span></h3>
                  <p className="text-white/40 italic font-light max-w-md mx-auto">By clicking below, you agree to our terms of bespoke creation and service.</p>
                  <button 
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className={`w-full py-6 rounded-2xl text-[11px] uppercase tracking-widest font-black transition-all shadow-2xl relative ${isProcessing ? 'bg-brand-charcoal/50 cursor-not-allowed' : 'bg-brand-rose text-white hover:bg-white hover:text-brand-charcoal'}`}
                  >
                    {isProcessing ? 'Processing Masterpiece...' : 'Pay & Complete Reservation'}
                  </button>
                </div>
                <button onClick={() => setStep(2)} className="text-[10px] uppercase tracking-widest font-black text-brand-charcoal/40 hover:text-brand-charcoal transition-colors mx-auto block">
                  Modify Payment Method
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Order Summary */}
        <aside className="lg:w-96">
          <div className="bg-white p-10 md:p-12 rounded-[2.5rem] border border-brand-charcoal/5 shadow-xl space-y-10 sticky top-32">
            <h4 className="text-xl font-sans font-bold text-brand-charcoal">Order Summary</h4>
            
            <div className="space-y-6 max-h-[300px] overflow-y-auto no-scrollbar pr-2">
              {cart.map((item, index) => (
                <div key={`${item.id}-${index}`} className="flex justify-between items-center gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-20 bg-neutral-50 rounded-lg overflow-hidden shrink-0 border border-brand-charcoal/5">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="text-xs font-bold leading-tight line-clamp-1">{item.name}</p>
                      <p className="text-[10px] text-brand-charcoal/40 italic">{item.category}</p>
                    </div>
                  </div>
                  <span className="text-xs font-black">{item.price}</span>
                </div>
              ))}
            </div>

            <div className="pt-10 border-t border-brand-charcoal/5 space-y-4">
              <div className="flex justify-between text-xs italic text-brand-charcoal/60">
                <span>Subtotal</span>
                <span>₦{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs italic text-brand-charcoal/60">
                <span>Tailored Delivery</span>
                <span>₦{delivery.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-end pt-4">
                <span className="text-[10px] uppercase tracking-widest font-black">Total</span>
                <span className="text-2xl font-black">₦{total.toLocaleString()}</span>
              </div>
            </div>

            <div className="space-y-4 pt-6">
              <div className="flex items-center gap-3 text-brand-charcoal/40">
                <ShieldCheck size={14} />
                <span className="text-[10px] uppercase tracking-widest font-bold italic">Secure checkout</span>
              </div>
              <div className="flex items-center gap-3 text-brand-charcoal/40">
                <Truck size={14} />
                <span className="text-[10px] uppercase tracking-widest font-bold italic">Bespoke Handling</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CheckoutPage;
