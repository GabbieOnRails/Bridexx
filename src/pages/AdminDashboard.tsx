import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, 
  Users, 
  BarChart2, 
  Settings, 
  Package, 
  Truck, 
  Clock, 
  CheckCircle,
  ChevronRight,
  Filter,
  Search,
  Calendar,
  DollarSign,
  Ruler,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Edit,
  ArrowUpRight,
  User,
  X,
  Lock
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, addDoc, getDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import ProtectedRoute from '../components/ProtectedRoute';

interface Order {
  id: string;
  orderId: string;
  userId: string;
  items: any[];
  productPrice: number;
  orderStatus: string;
  shippingFee: number | null;
  shippingPaymentStatus: string | null;
  expectedCompletionDate?: any;
  expectedDeliveryDate?: any;
  createdAt: any;
  measurements: any;
  customer?: any;
}

const AdminDashboard = () => {
  const { userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'orders' | 'customers' | 'analytics' | 'products'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isUpdatingOrder, setIsUpdatingOrder] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const ordersWithCustomers = await Promise.all(snapshot.docs.map(async (orderDoc) => {
        const orderData = orderDoc.data() as Order;
        const userDoc = await getDoc(doc(db, 'users', orderData.userId));
        return {
          id: orderDoc.id,
          ...orderData,
          customer: userDoc.data()
        };
      }));
      setOrders(ordersWithCustomers);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'orders');
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const usersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCustomers(usersData);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'users');
    });
    return unsubscribe;
  }, []);

  const updateOrderStatus = async (orderId: string, updates: any, userId: string, message: string) => {
    setIsUpdatingOrder(true);
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        ...updates,
        updatedAt: new Date()
      });

      // Send in-app notification
      await addDoc(collection(db, 'notifications'), {
        userId,
        orderId,
        message,
        read: false,
        type: 'status_update',
        createdAt: new Date()
      });

      if (selectedOrder?.id === orderId) {
        setSelectedOrder(prev => prev ? { ...prev, ...updates } : null);
      }
    } catch (err) {
      console.error("Order update error:", err);
    } finally {
      setIsUpdatingOrder(false);
    }
  };

  const statusOptions = [
    { value: 'payment_confirmed', label: 'Payment Confirmed' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'ready_for_shipping', label: 'Ready for Shipping' },
    { value: 'shipped', label: 'Shipped' },
  ];

  const totalProductRevenue = orders.reduce((acc, curr) => acc + curr.productPrice, 0);
  const totalShippingFees = orders.reduce((acc, curr) => acc + (curr.shippingFee || 0), 0);

  return (
    <ProtectedRoute requireAdmin>
      <div className="min-h-screen bg-neutral-900 py-12 px-6 md:px-12 text-white/90">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-8">
            <div>
              <h1 className="text-4xl font-sans font-bold italic text-white flex items-center gap-4">
                <Package className="text-brand-rose" /> Atelier Control Panel
              </h1>
              <p className="text-[10px] uppercase tracking-[0.3em] font-black text-white/30 mt-2">Managing the Bridexx Planet Universe</p>
            </div>
            
            <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/5">
              {[
                { id: 'orders', label: 'Orders', icon: ShoppingBag },
                { id: 'customers', label: 'Artisans/Clients', icon: Users },
                { id: 'analytics', label: 'Insights', icon: BarChart2 },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${activeTab === tab.id ? 'bg-white text-brand-charcoal shadow-xl' : 'text-white/40 hover:text-white'}`}
                >
                  <tab.icon size={16} />
                  <span className="text-[10px] uppercase tracking-widest font-black">{tab.label}</span>
                </button>
              ))}
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Sidebar / Stats */}
            <div className="lg:col-span-3 space-y-6">
              <div className="bg-white/5 p-8 rounded-[2rem] border border-white/5">
                <p className="text-[10px] uppercase tracking-widest font-black text-white/30 mb-2">Active Commissions</p>
                <h4 className="text-4xl font-sans font-bold">{orders.filter(o => o.orderStatus !== 'shipped').length}</h4>
                <div className="mt-4 flex items-center gap-2 text-green-400 text-xs italic">
                  <ArrowUpRight size={14} /> +24% this month
                </div>
              </div>
              <div className="bg-white/5 p-8 rounded-[2rem] border border-white/5">
                <p className="text-[10px] uppercase tracking-widest font-black text-white/30 mb-2">Total Artisanal Value</p>
                <h4 className="text-4xl font-sans font-bold italic">₦{(totalProductRevenue / 1000000).toFixed(1)}M</h4>
              </div>
              <div className="bg-brand-rose p-8 rounded-[2rem] shadow-2xl relative overflow-hidden">
                <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full" />
                <p className="text-[10px] uppercase tracking-widest font-black text-white/60 mb-2">Shipping Logistics</p>
                <h4 className="text-4xl font-sans font-bold text-white">₦{(totalShippingFees / 1000).toFixed(0)}K</h4>
              </div>
            </div>

            {/* Main Admin Area */}
            <div className="lg:col-span-9">
              <AnimatePresence mode="wait">
                {activeTab === 'orders' && (
                  <motion.div 
                    key="admin-orders"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    <div className="bg-white/5 rounded-[2.5rem] border border-white/5 overflow-hidden">
                      <div className="p-8 border-b border-white/5 flex flex-col md:flex-row justify-between gap-6">
                        <div className="relative flex-grow max-w-md">
                          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                          <input 
                            type="text" 
                            placeholder="Search Order ID or Client..." 
                            className="w-full bg-white/5 border border-white/10 px-12 py-3 rounded-xl text-[10px] uppercase tracking-widest font-black focus:outline-none focus:border-brand-rose"
                          />
                        </div>
                        <div className="flex gap-4">
                          <button className="flex items-center gap-2 px-6 py-3 bg-white/5 rounded-xl text-[10px] uppercase tracking-widest font-black hover:bg-white/10 transition-all border border-white/5">
                            <Filter size={14} /> All Status
                          </button>
                        </div>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="bg-white/[0.02]">
                              <th className="px-8 py-5 text-[9px] uppercase tracking-[0.2em] font-black text-white/30">Voucher</th>
                              <th className="px-8 py-5 text-[9px] uppercase tracking-[0.2em] font-black text-white/30">Client</th>
                              <th className="px-8 py-5 text-[9px] uppercase tracking-[0.2em] font-black text-white/30">Creation</th>
                              <th className="px-8 py-5 text-[9px] uppercase tracking-[0.2em] font-black text-white/30">Investment</th>
                              <th className="px-8 py-5 text-[9px] uppercase tracking-[0.2em] font-black text-white/30">Status</th>
                              <th className="px-8 py-5 text-[9px] uppercase tracking-[0.2em] font-black text-white/30"></th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                            {orders.map((order) => (
                              <tr key={order.id} className="hover:bg-white/[0.02] transition-colors cursor-pointer group" onClick={() => setSelectedOrder(order)}>
                                <td className="px-8 py-6">
                                  <span className="font-mono text-xs text-white/60 tracking-wider">#{order.orderId || order.id.slice(0,6).toUpperCase()}</span>
                                </td>
                                <td className="px-8 py-6">
                                  <p className="text-sm font-bold italic">{order.customer?.name || 'Unknown'}</p>
                                  <p className="text-[10px] uppercase tracking-widest font-black text-white/30 mt-1">{order.items[0]?.name}</p>
                                </td>
                                <td className="px-8 py-6 text-xs text-white/40">
                                  {new Date(order.createdAt?.seconds * 1000).toLocaleDateString()}
                                </td>
                                <td className="px-8 py-6 text-sm font-black">
                                  ₦{order.productPrice.toLocaleString()}
                                </td>
                                <td className="px-8 py-6">
                                  <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest ${
                                    order.orderStatus === 'payment_confirmed' ? 'bg-blue-500/10 text-blue-400' :
                                    order.orderStatus === 'in_progress' ? 'bg-amber-500/10 text-amber-400' :
                                    order.orderStatus === 'ready_for_shipping' ? 'bg-brand-rose/10 text-brand-rose' :
                                    'bg-green-500/10 text-green-400'
                                  }`}>
                                    {order.orderStatus.replace('_', ' ')}
                                  </span>
                                </td>
                                <td className="px-8 py-6 text-right">
                                  <ChevronRight size={16} className="text-white/10 group-hover:text-white/60 transition-colors" />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'customers' && (
                  <motion.div 
                    key="admin-customers"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white/5 rounded-[2.5rem] border border-white/5 p-12 text-center"
                  >
                    <Users className="mx-auto text-white/10 mb-6" size={64} />
                    <h3 className="text-2xl font-bold italic mb-4">Artisanal Database</h3>
                    <p className="text-white/30 italic max-w-md mx-auto mb-10">Manage client profiles, measurements and order history for your bespoke audience.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
                      {customers.map(customer => (
                        <div key={customer.id} className="bg-white/5 p-6 rounded-2xl border border-white/5 hover:bg-white/10 transition-all group">
                          <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 bg-white/10 text-white rounded-full flex items-center justify-center font-serif italic text-lg shadow-inner">
                              {customer.name?.charAt(0)}
                            </div>
                            <button className="p-2 text-white/20 hover:text-white transition-colors">
                              <ExternalLink size={14} />
                            </button>
                          </div>
                          <h4 className="text-sm font-bold italic">{customer.name}</h4>
                          <p className="text-[10px] uppercase tracking-widest font-black text-white/30 mt-1">{customer.email}</p>
                          <div className="mt-6 pt-4 border-t border-white/5 flex gap-4">
                            <div className="text-[9px] uppercase tracking-widest font-black text-white/20">
                              <span className="block text-white/60 mb-1">Orders</span>
                              {orders.filter(o => o.userId === customer.id).length}
                            </div>
                            <div className="text-[9px] uppercase tracking-widest font-black text-white/20">
                              <span className="block text-white/60 mb-1">Role</span>
                              {customer.role}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'analytics' && (
                  <motion.div 
                    key="admin-analytics"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-8"
                  >
                    <div className="bg-white/5 p-12 rounded-[2.5rem] border border-white/5">
                      <h4 className="text-lg font-bold italic mb-8">Revenue Breakdown</h4>
                      <div className="space-y-6">
                        <div>
                          <div className="flex justify-between items-end mb-2">
                            <span className="text-[10px] uppercase tracking-widest font-black text-white/40 italic">Product Commissions</span>
                            <span className="text-sm font-bold">₦{totalProductRevenue.toLocaleString()}</span>
                          </div>
                          <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-brand-rose" style={{ width: '85%' }} />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between items-end mb-2">
                            <span className="text-[10px] uppercase tracking-widest font-black text-white/40 italic">Logistics Fees</span>
                            <span className="text-sm font-bold">₦{totalShippingFees.toLocaleString()}</span>
                          </div>
                          <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-white/40" style={{ width: '15%' }} />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white/5 p-12 rounded-[2.5rem] border border-white/5">
                      <h4 className="text-lg font-bold italic mb-8">Order Dynamics</h4>
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { label: 'Confirmed', count: orders.filter(o => o.orderStatus === 'payment_confirmed').length },
                          { label: 'Artistry', count: orders.filter(o => o.orderStatus === 'in_progress').length },
                          { label: 'Logistics', count: orders.filter(o => o.orderStatus === 'ready_for_shipping').length },
                          { label: 'Dispatched', count: orders.filter(o => o.orderStatus === 'shipped').length },
                        ].map(stat => (
                          <div key={stat.label} className="p-6 bg-white/5 rounded-2xl border border-white/5 text-center">
                            <span className="text-[10px] uppercase tracking-widest font-black text-white/30 block mb-2">{stat.label}</span>
                            <span className="text-2xl font-bold italic">{stat.count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Order detail overlay */}
        <AnimatePresence>
          {selectedOrder && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedOrder(null)}
                className="fixed inset-0 bg-neutral-950/80 backdrop-blur-md z-[100]"
              />
              <motion.div 
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed top-0 right-0 bottom-0 w-full max-w-2xl bg-neutral-900 z-[110] overflow-y-auto no-scrollbar shadow-[0_0_100px_rgba(0,0,0,0.5)] border-l border-white/5"
              >
                <div className="p-12 md:p-16">
                  <div className="flex justify-between items-center mb-16">
                    <div>
                      <span className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-rose">Management</span>
                      <h2 className="text-3xl font-sans font-bold italic mt-2 text-white">Commission Details</h2>
                    </div>
                    <button 
                      onClick={() => setSelectedOrder(null)}
                      className="w-12 h-12 flex items-center justify-center bg-white/5 rounded-full hover:bg-white/10 transition-all"
                    >
                      <ExternalLink size={20} />
                    </button>
                  </div>

                  <div className="space-y-16">
                    {/* Status & Control Section */}
                    <div className="bg-white/5 p-10 rounded-[2.5rem] border border-white/5 space-y-10 shadow-inner">
                      <div>
                        <label className="text-[9px] uppercase tracking-widest font-black text-white/30 block mb-4 italic">Update Production State</label>
                        <div className="grid grid-cols-2 gap-3">
                          {statusOptions.map((opt) => (
                            <button 
                              key={opt.value}
                              onClick={() => {
                                let message = "";
                                if (opt.value === 'in_progress') message = "Artistry has begun on your bespoke garment. Estimated completion date documented.";
                                if (opt.value === 'ready_for_shipping') message = "Your dress is ready for the runway - please settle logistics to initiate courier.";
                                if (opt.value === 'shipped') message = "Your masterpiece has left the atelier. Courier delivery date updated.";
                                
                                updateOrderStatus(selectedOrder.id, { orderStatus: opt.value }, selectedOrder.userId, message);
                              }}
                              className={`px-4 py-3 rounded-xl border text-[9px] uppercase tracking-widest font-black transition-all ${selectedOrder.orderStatus === opt.value ? 'bg-brand-rose border-brand-rose text-white shadow-lg' : 'bg-white/5 border-white/10 text-white/40 hover:border-white/40'}`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-white/5">
                        <div className="space-y-3">
                          <label className="text-[9px] uppercase tracking-widest font-black text-white/30 flex items-center gap-2 italic">
                            <Clock size={12} /> Expected Completion
                          </label>
                          <input 
                            type="date" 
                            className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-brand-rose cursor-pointer"
                            onChange={(e) => updateOrderStatus(selectedOrder.id, { expectedCompletionDate: new Date(e.target.value) }, selectedOrder.userId, "Estimated completion date for your garment has been updated.")}
                          />
                        </div>
                        <div className="space-y-3">
                          <label className="text-[9px] uppercase tracking-widest font-black text-white/30 flex items-center gap-2 italic">
                            <Truck size={12} /> Courier Logistics Fee
                          </label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-white/20">₦</span>
                            <input 
                              type="number" 
                              placeholder="0.00"
                              className="w-full bg-white/5 border border-white/10 p-4 pl-10 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-brand-rose"
                              onBlur={(e) => {
                                if (e.target.value) {
                                  updateOrderStatus(selectedOrder.id, { shippingFee: parseFloat(e.target.value), shippingPaymentStatus: 'pending' }, selectedOrder.userId, "Logistics fee calculated for your delivery. Please check your dashboard.");
                                }
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Order Details */}
                    <div>
                      <h4 className="text-[10px] uppercase tracking-[0.4em] font-black text-brand-rose/60 mb-8 pb-4 border-b border-white/5 italic">Commission Particulars</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-8">
                          <div className="flex gap-6">
                            <div className="w-24 h-32 bg-white/5 rounded-2xl overflow-hidden border border-white/5">
                              {selectedOrder.items[0]?.image && <img src={selectedOrder.items[0].image} alt="" className="w-full h-full object-cover grayscale-50" />}
                            </div>
                            <div>
                              <p className="text-xl font-bold italic">{selectedOrder.items[0]?.name}</p>
                              <p className="text-[9px] uppercase tracking-widest font-black text-white/40 mt-1">{selectedOrder.items[0]?.category}</p>
                              <div className="mt-4 inline-block px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs font-black text-brand-rose">
                                ₦{selectedOrder.productPrice.toLocaleString()}
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-4 pt-6 border-t border-white/5">
                            <h5 className="text-[9px] uppercase tracking-widest font-black text-white/30 italic">Client Silhouette Profile</h5>
                            <div className="grid grid-cols-2 gap-4">
                              {Object.entries(selectedOrder.measurements).map(([key, val]: [string, any]) => (
                                <div key={key} className="flex justify-between items-center bg-white/[0.02] p-3 rounded-lg border border-white/[0.03]">
                                  <span className="text-[8px] uppercase tracking-widest font-black text-white/20">{key.replace(/([A-Z])/g, ' $1')}</span>
                                  <span className="text-xs font-bold italic">{val || '—'}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-10">
                          <div className="space-y-4">
                            <h5 className="text-[9px] uppercase tracking-widest font-black text-white/30 italic">Logistics Address</h5>
                            <div className="bg-white/5 p-6 rounded-2xl border border-white/5 space-y-4">
                              <div className="flex items-center gap-3 text-sm italic">
                                <User size={14} className="text-brand-rose" /> {selectedOrder.customer?.name}
                              </div>
                              <div className="flex items-center gap-3 text-sm italic">
                                <Mail size={14} className="text-brand-rose" /> {selectedOrder.customer?.email}
                              </div>
                              <div className="flex items-center gap-3 text-sm italic">
                                <Phone size={14} className="text-brand-rose" /> {selectedOrder.customer?.phone}
                              </div>
                              <div className="flex items-start gap-3 text-sm italic leading-relaxed pt-2 border-t border-white/5 mt-2">
                                <MapPin size={14} className="text-brand-rose shrink-0 mt-1" /> {selectedOrder.customer?.address}
                              </div>
                            </div>
                          </div>

                          <div className="p-8 bg-brand-rose/5 rounded-[2rem] border border-brand-rose/20">
                            <div className="flex gap-4 items-start">
                              <div className="w-10 h-10 bg-brand-rose/10 text-brand-rose rounded-full flex items-center justify-center shrink-0">
                                <CheckCircle size={20} />
                              </div>
                              <div>
                                <p className="text-xs font-black uppercase tracking-widest mb-1 text-white">Artisanal Assurance</p>
                                <p className="text-[10px] italic leading-relaxed text-white/60">Initial commission payment has been verified by the planet's gateway. Production is authorized.</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </ProtectedRoute>
  );
};

export default AdminDashboard;
