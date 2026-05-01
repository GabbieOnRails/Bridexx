import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  ShoppingBag, 
  Bell, 
  CreditCard, 
  Settings, 
  LogOut, 
  ChevronRight, 
  Clock, 
  CheckCircle, 
  Truck, 
  Package,
  Ruler,
  Edit2,
  Save,
  Shield,
  Mail,
  Phone,
  MapPin,
  Calendar,
  X,
  Lock
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import ProtectedRoute from '../components/ProtectedRoute';

interface Order {
  id: string;
  orderId: string;
  items: any[];
  productPrice: number;
  orderStatus: string;
  shippingFee: number | null;
  shippingPaymentStatus: string | null;
  expectedCompletionDate?: any;
  expectedDeliveryDate?: any;
  createdAt: any;
  measurements: any;
}

const Dashboard = () => {
  const { userProfile, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'measurements' | 'notifications' | 'payments'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: userProfile?.name || '',
    phone: userProfile?.phone || '',
    address: userProfile?.address || ''
  });

  useEffect(() => {
    if (!userProfile) return;

    const q = query(
      collection(db, 'orders'),
      where('userId', '==', userProfile.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];
      setOrders(ordersData);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'orders');
    });

    return unsubscribe;
  }, [userProfile]);

  useEffect(() => {
    if (!userProfile) return;

    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', userProfile.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setNotifications(notifsData);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'notifications');
    });

    return unsubscribe;
  }, [userProfile]);

  const handleUpdateProfile = async () => {
    if (!userProfile) return;
    try {
      await updateDoc(doc(db, 'users', userProfile.uid), {
        ...profileData,
        updatedAt: new Date()
      });
      setIsEditingProfile(false);
    } catch (err) {
      console.error("Profile update error:", err);
    }
  };

  const statusColors: Record<string, string> = {
    'payment_confirmed': 'bg-blue-50 text-blue-600',
    'in_progress': 'bg-amber-50 text-amber-600',
    'ready_for_shipping': 'bg-brand-rose/10 text-brand-rose',
    'shipped': 'bg-green-50 text-green-600',
  };

  const statusLabels: Record<string, string> = {
    'payment_confirmed': 'Payment Confirmed',
    'in_progress': 'In Artistry',
    'ready_for_shipping': 'Ready for Shipping',
    'shipped': 'Dispatched',
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-neutral-100/30 py-12 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
          
          {/* Sidebar */}
          <aside className="lg:w-80 shrink-0">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-brand-charcoal/5 sticky top-32">
              <div className="flex flex-col items-center mb-10 pb-10 border-bottom border-brand-charcoal/5 text-center">
                <div className="w-20 h-20 bg-brand-charcoal text-white rounded-full flex items-center justify-center mb-4 text-2xl font-serif italic">
                  {userProfile?.name.charAt(0)}
                </div>
                <h2 className="text-xl font-sans font-bold text-brand-charcoal leading-tight">{userProfile?.name}</h2>
                <p className="text-[10px] uppercase tracking-widest font-black text-brand-charcoal/30 mt-1">{userProfile?.email}</p>
              </div>

              <nav className="space-y-2">
                {[
                  { id: 'orders', label: 'My Orders', icon: ShoppingBag },
                  { id: 'profile', label: 'Profile', icon: User },
                  { id: 'measurements', label: 'Measurements', icon: Ruler },
                  { id: 'notifications', label: 'Alerts', icon: Bell, count: notifications.filter(n => !n.read).length },
                  { id: 'payments', label: 'Payments', icon: CreditCard },
                ].map((item) => (
                  <button 
                    key={item.id}
                    onClick={() => setActiveTab(item.id as any)}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${activeTab === item.id ? 'bg-brand-charcoal text-white shadow-lg' : 'hover:bg-neutral-50 text-brand-charcoal/60'}`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon size={18} />
                      <span className="text-[10px] uppercase tracking-widest font-black">{item.label}</span>
                    </div>
                    {item.count ? (
                      <span className="bg-brand-rose text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                        {item.count}
                      </span>
                    ) : (
                      <ChevronRight size={14} className={activeTab === item.id ? 'opacity-40' : 'opacity-20'} />
                    )}
                  </button>
                ))}

                <div className="pt-8 mt-8 border-t border-brand-charcoal/5">
                  <button 
                    onClick={logout}
                    className="w-full flex items-center gap-3 p-4 rounded-2xl text-red-500 hover:bg-red-50 transition-all font-black text-[10px] uppercase tracking-widest"
                  >
                    <LogOut size={18} />
                    <span>Log Out</span>
                  </button>
                </div>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-grow">
            <AnimatePresence mode="wait">
              {activeTab === 'orders' && (
                <motion.div 
                  key="orders-tab"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  <div className="flex justify-between items-end mb-4">
                    <div>
                      <h3 className="text-3xl font-sans font-bold text-brand-charcoal italic">Active Masterpieces</h3>
                      <p className="text-[10px] uppercase tracking-widest font-black text-brand-charcoal/30">Track your bespoke creations</p>
                    </div>
                  </div>

                  {orders.length === 0 ? (
                    <div className="bg-white p-20 rounded-[2.5rem] border border-brand-charcoal/5 shadow-xl text-center">
                      <ShoppingBag className="mx-auto text-brand-charcoal/10 mb-6" size={48} />
                      <p className="text-brand-charcoal/40 italic font-light mb-8">You haven't commissioned any masterpieces yet.</p>
                      <button onClick={() => setActiveTab('orders')} className="text-[10px] uppercase tracking-widest font-black border border-brand-charcoal/10 px-8 py-4 rounded-xl hover:bg-brand-charcoal hover:text-white transition-all">
                        Visit Boutique
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-6">
                      {orders.map((order) => (
                        <div key={order.id} className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-brand-charcoal/5 shadow-xl hover:shadow-2xl transition-all group overflow-hidden relative">
                          <div className={`absolute top-0 right-0 px-8 py-3 rounded-bl-3xl text-[9px] uppercase tracking-[0.2em] font-black ${statusColors[order.orderStatus]}`}>
                            {statusLabels[order.orderStatus]}
                          </div>

                          <div className="flex flex-col md:flex-row gap-8">
                            <div className="w-24 h-32 md:w-32 md:h-44 bg-neutral-50 rounded-2xl overflow-hidden shrink-0 border border-brand-charcoal/5">
                              {order.items[0]?.image && <img src={order.items[0].image} alt={order.items[0].name} className="w-full h-full object-cover" />}
                            </div>
                            
                            <div className="flex-grow flex flex-col">
                              <div className="mb-6">
                                <p className="text-[10px] uppercase tracking-widest font-black text-brand-charcoal/30 mb-2">Order ID: <span className="font-mono text-brand-charcoal/60">{order.orderId || order.id.slice(0,8).toUpperCase()}</span></p>
                                <h4 className="text-xl font-bold text-brand-charcoal">{order.items[0]?.name || 'Bespoke Garment'}</h4>
                                <p className="text-sm text-brand-charcoal/40 italic">{order.items[0]?.category}</p>
                              </div>

                              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-auto">
                                <div className="space-y-1">
                                  <span className="text-[9px] uppercase tracking-widest font-black text-brand-charcoal/30 block">Order Date</span>
                                  <span className="text-xs font-bold">{new Date(order.createdAt?.seconds * 1000).toLocaleDateString()}</span>
                                </div>
                                <div className="space-y-1">
                                  <span className="text-[9px] uppercase tracking-widest font-black text-brand-charcoal/30 block">Investment</span>
                                  <span className="text-xs font-bold">₦{order.productPrice.toLocaleString()}</span>
                                </div>
                                <div className="space-y-1">
                                  <span className="text-[9px] uppercase tracking-widest font-black text-brand-charcoal/30 block">Completion</span>
                                  <span className="text-xs font-bold text-brand-rose italic">{order.expectedCompletionDate ? new Date(order.expectedCompletionDate?.seconds * 1000).toLocaleDateString() : 'TBD'}</span>
                                </div>
                                <div className="space-y-1">
                                  <span className="text-[9px] uppercase tracking-widest font-black text-brand-charcoal/30 block">Shipping</span>
                                  <span className={`text-xs font-bold ${order.shippingFee ? 'text-brand-charcoal' : 'text-brand-charcoal/20italic'}`}>
                                    {order.shippingFee ? `₦${order.shippingFee.toLocaleString()}` : 'Calculating...'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {order.orderStatus === 'ready_for_shipping' && order.shippingPaymentStatus !== 'paid' && (
                            <div className="mt-10 pt-10 border-t border-brand-charcoal/5 flex flex-col sm:flex-row justify-between items-center gap-6">
                              <div className="flex items-center gap-4 text-brand-rose">
                                <div className="w-10 h-10 bg-brand-rose/5 rounded-full flex items-center justify-center">
                                  <Package size={20} />
                                </div>
                                <div>
                                  <p className="text-sm font-bold">Ready for Shipment</p>
                                  <p className="text-[10px] uppercase tracking-widest font-black opacity-60 italic">Please settle shipping to dispatch</p>
                                </div>
                              </div>
                              <button className="w-full sm:w-auto bg-brand-charcoal text-white px-10 py-4 rounded-xl text-[10px] uppercase tracking-widest font-black hover:bg-brand-rose transition-all flex items-center gap-3">
                                <CreditCard size={16} /> Pay Shipping Fee ₦{order.shippingFee?.toLocaleString()}
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'profile' && (
                <motion.div 
                  key="profile-tab"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  <div className="bg-white p-10 md:p-14 rounded-[2.5rem] border border-brand-charcoal/5 shadow-xl">
                    <div className="flex justify-between items-center mb-12">
                      <h3 className="text-3xl font-sans font-bold text-brand-charcoal italic">Atelier Profile</h3>
                      <button 
                        onClick={() => setIsEditingProfile(!isEditingProfile)}
                        className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-black text-brand-charcoal/40 hover:text-brand-charcoal transition-all"
                      >
                        {isEditingProfile ? <X size={14} /> : <Edit2 size={14} />}
                        {isEditingProfile ? 'Cancel' : 'Edit Profile'}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      <div className="space-y-8">
                        <div className="space-y-2">
                          <label className="text-[9px] uppercase tracking-widest font-black text-brand-charcoal/30 flex items-center gap-2">
                            <User size={12} /> Full Name
                          </label>
                          {isEditingProfile ? (
                            <input 
                              type="text" 
                              value={profileData.name}
                              onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                              className="w-full bg-neutral-50 border border-brand-charcoal/10 p-5 rounded-2xl focus:outline-none focus:border-brand-charcoal font-serif italic"
                            />
                          ) : (
                            <p className="text-lg font-bold text-brand-charcoal italic px-1">{userProfile?.name}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label className="text-[9px] uppercase tracking-widest font-black text-brand-charcoal/30 flex items-center gap-2">
                            <Mail size={12} /> Email Address
                          </label>
                          <p className="text-lg font-bold text-brand-charcoal italic px-1">{userProfile?.email}</p>
                          <p className="text-[9px] text-brand-charcoal/20 uppercase tracking-widest font-black">Email cannot be changed</p>
                        </div>
                      </div>

                      <div className="space-y-8">
                        <div className="space-y-2">
                          <label className="text-[9px] uppercase tracking-widest font-black text-brand-charcoal/30 flex items-center gap-2">
                            <Phone size={12} /> Phone Number
                          </label>
                          {isEditingProfile ? (
                            <input 
                              type="tel" 
                              value={profileData.phone}
                              onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                              className="w-full bg-neutral-50 border border-brand-charcoal/10 p-5 rounded-2xl focus:outline-none focus:border-brand-charcoal font-serif italic"
                            />
                          ) : (
                            <p className="text-lg font-bold text-brand-charcoal italic px-1">{userProfile?.phone}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label className="text-[9px] uppercase tracking-widest font-black text-brand-charcoal/30 flex items-center gap-2">
                            <MapPin size={12} /> Shipping Residence
                          </label>
                          {isEditingProfile ? (
                            <textarea 
                              value={profileData.address}
                              onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                              rows={3}
                              className="w-full bg-neutral-50 border border-brand-charcoal/10 p-5 rounded-2xl focus:outline-none focus:border-brand-charcoal font-serif italic resize-none"
                            />
                          ) : (
                            <p className="text-lg font-bold text-brand-charcoal italic px-1 leading-relaxed">{userProfile?.address}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {isEditingProfile && (
                      <div className="mt-12 pt-10 border-t border-brand-charcoal/5 flex justify-end">
                        <button 
                          onClick={handleUpdateProfile}
                          className="bg-brand-charcoal text-white px-12 py-5 rounded-2xl text-[10px] uppercase tracking-widest font-black hover:bg-brand-rose transition-all flex items-center gap-3 shadow-lg"
                        >
                          <Save size={16} /> Save Atelier Profile
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="bg-white p-10 md:p-14 rounded-[2.5rem] border border-brand-charcoal/5 shadow-xl">
                    <div className="flex items-center gap-4 mb-10">
                      <div className="w-12 h-12 bg-neutral-50 text-brand-charcoal rounded-full flex items-center justify-center">
                        <Lock size={24} />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold italic">Account Security</h4>
                        <p className="text-[10px] uppercase tracking-widest font-black text-brand-charcoal/30">Manage your access</p>
                      </div>
                    </div>
                    <button className="inline-flex items-center gap-3 text-[10px] uppercase tracking-widest font-black text-brand-charcoal border border-brand-charcoal/10 px-8 py-4 rounded-xl hover:bg-brand-charcoal hover:text-white transition-all">
                      Change Login Password <ChevronRight size={14} />
                    </button>
                  </div>
                </motion.div>
              )}

              {activeTab === 'measurements' && (
                <motion.div 
                  key="measurements-tab"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  <div className="bg-white p-10 md:p-14 rounded-[2.5rem] border border-brand-charcoal/5 shadow-xl">
                    <div className="flex justify-between items-center mb-12">
                      <div>
                        <h3 className="text-3xl font-sans font-bold text-brand-charcoal italic">Atelier Measurements</h3>
                        <p className="text-[10px] uppercase tracking-widest font-black text-brand-charcoal/30">Your silhouette profile for bespoke tailoring</p>
                      </div>
                      <Ruler className="text-brand-charcoal/10" size={48} />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                      {userProfile?.savedMeasurements ? Object.entries(userProfile.savedMeasurements).map(([key, value]: [string, any]) => (
                        <div key={key} className="p-6 bg-neutral-50 rounded-2xl border border-brand-charcoal/5">
                          <span className="text-[9px] uppercase tracking-widest font-black text-brand-charcoal/30 block mb-2">{key.replace(/([A-Z])/g, ' $1')}</span>
                          <span className="text-lg font-bold italic text-brand-charcoal">{value || '—'}</span>
                        </div>
                      )) : (
                        <div className="col-span-full py-12 text-center text-brand-charcoal/30 italic">
                          No measurements documented for this profile.
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-12 p-8 bg-brand-charcoal/5 rounded-3xl border border-brand-charcoal/5">
                      <div className="flex gap-4 items-start">
                        <Clock className="text-brand-rose shrink-0" size={20} />
                        <div>
                          <p className="text-xs font-bold mb-1 italic">Last documentation update</p>
                          <p className="text-[10px] uppercase tracking-widest font-black text-brand-charcoal/40">These measurements are used to draft your initial patterns. For physical fittings, our artisans will perform precision adjustments.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'notifications' && (
                <motion.div 
                  key="notifs-tab"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <h3 className="text-3xl font-sans font-bold text-brand-charcoal italic mb-8">Atelier Updates</h3>
                  
                  {notifications.length === 0 ? (
                    <div className="bg-white p-20 rounded-[2.5rem] border border-brand-charcoal/5 shadow-xl text-center">
                      <Bell className="mx-auto text-brand-charcoal/10 mb-6" size={48} />
                      <p className="text-brand-charcoal/40 italic font-light">No new alerts from the planet.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {notifications.map((notif) => (
                        <div key={notif.id} className={`p-6 rounded-2xl border transition-all ${notif.read ? 'bg-white border-brand-charcoal/5 grayscale-50' : 'bg-white border-brand-rose shadow-lg'}`}>
                          <div className="flex gap-6 items-start">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${notif.read ? 'bg-neutral-100 text-neutral-400' : 'bg-brand-rose/10 text-brand-rose'}`}>
                              <Bell size={20} />
                            </div>
                            <div className="flex-grow">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className={`text-sm font-bold ${notif.read ? 'text-brand-charcoal/60' : 'text-brand-charcoal'}`}>{notif.message}</h4>
                                <span className="text-[9px] uppercase tracking-widest font-black text-brand-charcoal/30">
                                  {new Date(notif.createdAt?.seconds * 1000).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-xs text-brand-charcoal/40 italic">Order: {notif.orderId}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'payments' && (
                <motion.div 
                  key="payments-tab"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-brand-charcoal text-white p-8 rounded-[2rem] shadow-xl relative overflow-hidden">
                      <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/5 rounded-full" />
                      <p className="text-[10px] uppercase tracking-widest font-black opacity-40 mb-2">Total Investments</p>
                      <h4 className="text-3xl font-sans font-bold">₦{orders.reduce((acc, ord) => acc + (ord.productPrice || 0) + (ord.shippingFee || 0), 0).toLocaleString()}</h4>
                    </div>
                    <div className="bg-white p-8 rounded-[2rem] shadow-lg border border-brand-charcoal/5">
                      <p className="text-[10px] uppercase tracking-widest font-black text-brand-charcoal/30 mb-2">Commissions</p>
                      <h4 className="text-3xl font-sans font-bold">₦{orders.reduce((acc, ord) => acc + (ord.productPrice || 0), 0).toLocaleString()}</h4>
                    </div>
                    <div className="bg-white p-8 rounded-[2rem] shadow-lg border border-brand-charcoal/5">
                      <p className="text-[10px] uppercase tracking-widest font-black text-brand-charcoal/30 mb-2">Courier Fees</p>
                      <h4 className="text-3xl font-sans font-bold">₦{orders.reduce((acc, ord) => acc + (ord.shippingFee || 0), 0).toLocaleString()}</h4>
                    </div>
                  </div>

                  <div className="bg-white rounded-[2.5rem] border border-brand-charcoal/5 shadow-xl overflow-hidden">
                    <div className="p-8 border-b border-brand-charcoal/5">
                      <h3 className="text-xl font-bold italic">Transaction Ledger</h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-neutral-50/50">
                            <th className="px-8 py-5 text-[9px] uppercase tracking-[0.2em] font-black text-brand-charcoal/40">Date</th>
                            <th className="px-8 py-5 text-[9px] uppercase tracking-[0.2em] font-black text-brand-charcoal/40">Voucher / Order</th>
                            <th className="px-8 py-5 text-[9px] uppercase tracking-[0.2em] font-black text-brand-charcoal/40">Type</th>
                            <th className="px-8 py-5 text-[9px] uppercase tracking-[0.2em] font-black text-brand-charcoal/40">Amount</th>
                            <th className="px-8 py-5 text-[9px] uppercase tracking-[0.2em] font-black text-brand-charcoal/40">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-charcoal/5">
                          {orders.map((order) => (
                            <React.Fragment key={`ledger-${order.id}`}>
                              <tr>
                                <td className="px-8 py-6 text-xs text-brand-charcoal/60 font-mono">
                                  {new Date(order.createdAt?.seconds * 1000).toLocaleDateString()}
                                </td>
                                <td className="px-8 py-6 text-sm font-bold italic">{order.orderId || order.id.slice(0,8).toUpperCase()}</td>
                                <td className="px-8 py-6 text-[10px] uppercase tracking-widest font-black">Commission</td>
                                <td className="px-8 py-6 text-sm font-black">₦{order.productPrice.toLocaleString()}</td>
                                <td className="px-8 py-6">
                                  <span className="px-3 py-1 rounded-full bg-green-50 text-green-600 text-[8px] font-black uppercase tracking-widest">Successful</span>
                                </td>
                              </tr>
                              {order.shippingFee && (
                                <tr>
                                  <td className="px-8 py-6 text-xs text-brand-charcoal/60 font-mono">
                                    {/* Date of shipping paid would ideally be different */}
                                    {new Date(order.createdAt?.seconds * 1000).toLocaleDateString()}
                                  </td>
                                  <td className="px-8 py-6 text-sm font-bold italic">{order.orderId || order.id.slice(0,8).toUpperCase()}</td>
                                  <td className="px-8 py-6 text-[10px] uppercase tracking-widest font-black">Courier</td>
                                  <td className="px-8 py-6 text-sm font-black">₦{order.shippingFee.toLocaleString()}</td>
                                  <td className="px-8 py-6">
                                    <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${order.shippingPaymentStatus === 'paid' ? 'bg-green-50 text-green-600' : 'bg-brand-rose/10 text-brand-rose'}`}>
                                      {order.shippingPaymentStatus === 'paid' ? 'Successful' : 'Awaiting'}
                                    </span>
                                  </td>
                                </tr>
                              )}
                            </React.Fragment>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;
