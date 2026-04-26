import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Car, Users, MessageSquare, ShoppingCart, TrendingUp, Plus, Edit, Trash2, LogOut, Clock, Mail, Phone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cars } from '../data/cars';
import { db } from '../lib/firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';


interface AdminProps {
  darkMode: boolean;
}

export default function Admin({ darkMode }: AdminProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<'dashboard' | 'cars' | 'messages' | 'users'>('dashboard');
  const [liveOrders, setLiveOrders] = useState<any[]>([]);
  const [liveUsers, setLiveUsers] = useState<any[]>([]);
  const [stats, setStats] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ordersSnap = await getDocs(query(collection(db, 'orders'), orderBy('createdAt', 'desc')));
        const ordersData = ordersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setLiveOrders(ordersData);

        const usersSnap = await getDocs(collection(db, 'users'));
        const usersData = usersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setLiveUsers(usersData);

        setStats([
          { icon: Car, label: 'Total Cars', value: cars.length, color: 'from-blue-500 to-blue-600' },
          { icon: ShoppingCart, label: 'Inquiries', value: ordersData.length, color: 'from-green-500 to-green-600' },
          { icon: Users, label: 'Total Users', value: usersData.length, color: 'from-purple-500 to-purple-600' },
          { icon: TrendingUp, label: 'Sold (Manual)', value: cars.filter(c => c.sold).length, color: 'from-gold-500 to-gold-600' },
        ]);
      } catch (err) {
        console.error("Error fetching admin data:", err);
      }
    };
    fetchData();
  }, []);

  if (!user || user.role !== 'admin') {
    return (
      <div className={`min-h-screen pt-20 flex items-center justify-center ${darkMode ? 'bg-dark-950 text-white' : 'bg-gray-50'}`}>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="mb-4">Admin privileges required</p>
          <button onClick={() => navigate('/auth')} className="bg-primary-600 text-white px-6 py-2 rounded-xl hover:bg-primary-700 transition-all">
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pt-16 ${darkMode ? 'bg-dark-950 text-white' : 'bg-gray-50'}`}>
      <div className="flex">
        {/* Sidebar */}
        <div className={`w-64 min-h-screen border-r hidden md:block ${darkMode ? 'bg-dark-900 border-dark-800' : 'bg-white border-dark-200'}`}>
          <div className="p-6">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-accent-500 rounded-lg flex items-center justify-center">
                <Car className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-sm">Admin Panel</span>
            </div>

            <nav className="space-y-1">
              {[
                { id: 'dashboard', icon: TrendingUp, label: 'Dashboard' },
                { id: 'cars', icon: Car, label: 'Manage Cars' },
                { id: 'messages', icon: MessageSquare, label: 'Messages' },
                { id: 'users', icon: Users, label: 'Users' },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id as any)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    activeSection === item.id
                      ? 'bg-primary-600 text-white'
                      : darkMode ? 'text-dark-300 hover:bg-dark-800' : 'text-dark-600 hover:bg-dark-50'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="pt-8 mt-8 border-t border-dark-700">
              <button
                onClick={() => { logout(); navigate('/'); }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 md:p-8">
          {activeSection === 'dashboard' && (
            <div>
              <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {stats.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`p-6 rounded-2xl ${darkMode ? 'bg-dark-800 border border-dark-700' : 'bg-white shadow-sm'}`}
                  >
                    <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <p className={`text-sm ${darkMode ? 'text-dark-400' : 'text-dark-500'}`}>{stat.label}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  </motion.div>
                ))}
              </div>

              {/* Recent Cars */}
              <div className={`p-6 rounded-2xl ${darkMode ? 'bg-dark-800 border border-dark-700' : 'bg-white shadow-sm'}`}>
                <h2 className="font-bold text-lg mb-4">Recent Inventory</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className={`text-left text-xs font-medium ${darkMode ? 'text-dark-400 border-b border-dark-700' : 'text-dark-500 border-b border-dark-200'}`}>
                        <th className="pb-3 pr-4">Car</th>
                        <th className="pb-3 pr-4">Price</th>
                        <th className="pb-3 pr-4">Status</th>
                        <th className="pb-3">Listed</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cars.slice(0, 5).map(car => (
                        <tr key={car.id} className={`border-b ${darkMode ? 'border-dark-800' : 'border-dark-100'}`}>
                          <td className="py-3 pr-4">
                            <div className="flex items-center gap-3">
                              <img src={car.images[0]} alt="" className="w-12 h-12 rounded-lg object-cover" />
                              <span className="text-sm font-medium">{car.name}</span>
                            </div>
                          </td>
                          <td className="py-3 pr-4 text-sm">${car.priceUSD?.toLocaleString()}</td>
                          <td className="py-3 pr-4">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              car.sold ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'
                            }`}>
                              {car.sold ? 'Sold' : 'Available'}
                            </span>
                          </td>
                          <td className="py-3 text-sm">{car.createdAt}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'cars' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Manage Cars</h1>
                <button className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all">
                  <Plus className="w-4 h-4" /> Add Car
                </button>
              </div>
              <div className={`rounded-2xl overflow-hidden ${darkMode ? 'bg-dark-800 border border-dark-700' : 'bg-white shadow-sm'}`}>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className={`text-left text-xs font-medium ${darkMode ? 'text-dark-400 border-b border-dark-700' : 'text-dark-500 border-b border-dark-200'}`}>
                        <th className="p-4">Car</th>
                        <th className="p-4">Brand</th>
                        <th className="p-4">Price (USD)</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cars.map(car => (
                        <tr key={car.id} className={`${darkMode ? 'border-b border-dark-800 hover:bg-dark-700/50' : 'border-b border-dark-100 hover:bg-dark-50'}`}>
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <img src={car.images[0]} alt="" className="w-14 h-14 rounded-xl object-cover" />
                              <div>
                                <p className="text-sm font-semibold">{car.name}</p>
                                <p className={`text-xs ${darkMode ? 'text-dark-400' : 'text-dark-500'}`}>{car.year}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-sm">{car.brand}</td>
                          <td className="p-4 text-sm font-semibold">${car.priceUSD?.toLocaleString()}</td>
                          <td className="p-4">
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                              car.sold ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'
                            }`}>
                              {car.sold ? 'Sold' : 'Available'}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              <button className="p-2 rounded-lg bg-primary-500/20 text-primary-500 hover:bg-primary-500/30 transition-all">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button className="p-2 rounded-lg bg-red-500/20 text-red-500 hover:bg-red-500/30 transition-all">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'messages' && (
            <div>
              <h1 className="text-2xl font-bold mb-6">Messages & Inquiries</h1>
              {liveOrders.length > 0 ? (
                <div className={`rounded-2xl overflow-hidden ${darkMode ? 'bg-dark-800 border border-dark-700' : 'bg-white shadow-sm'}`}>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className={`text-left text-xs font-medium ${darkMode ? 'text-dark-400 border-b border-dark-700' : 'text-dark-500 border-b border-dark-200'}`}>
                          <th className="p-4">Customer</th>
                          <th className="p-4">Inquiry</th>
                          <th className="p-4">Status</th>
                          <th className="p-4">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {liveOrders.map(order => (
                          <tr key={order.id} className={`${darkMode ? 'border-b border-dark-800' : 'border-b border-dark-100'}`}>
                            <td className="p-4">
                              <p className="text-sm font-semibold">{order.name}</p>
                              <div className="flex flex-col gap-1 mt-1">
                                <span className={`text-xs flex items-center gap-1 ${darkMode ? 'text-dark-400' : 'text-dark-500'}`}><Mail className="w-3 h-3" /> {order.email}</span>
                                <span className={`text-xs flex items-center gap-1 ${darkMode ? 'text-dark-400' : 'text-dark-500'}`}><Phone className="w-3 h-3" /> {order.phone}</span>
                              </div>
                            </td>
                            <td className="p-4">
                              <p className="text-sm font-bold capitalize">{order.type.replace('-', ' ')}</p>
                              <p className="text-xs text-primary-500 mt-0.5">{order.carName || 'General Inquiry'}</p>
                              <p className={`text-xs mt-1 italic ${darkMode ? 'text-dark-300' : 'text-dark-600'}`}>{order.message}</p>
                            </td>
                            <td className="p-4 text-sm font-semibold">
                               <span className={`text-xs px-2 py-1 rounded-full ${order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-green-500/20 text-green-500'}`}>
                                  {order.status}
                               </span>
                            </td>
                            <td className="p-4 text-xs opacity-60">
                              {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : 'N/A'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className={`p-8 rounded-2xl text-center ${darkMode ? 'bg-dark-800 border border-dark-700' : 'bg-white shadow-sm'}`}>
                  <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <h3 className="text-lg font-bold mb-2">No Messages Yet</h3>
                  <p className={`text-sm ${darkMode ? 'text-dark-400' : 'text-dark-500'}`}>
                    When customers send inquiries, they will appear here.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeSection === 'users' && (
            <div>
              <h1 className="text-2xl font-bold mb-6">User Management</h1>
              <div className={`rounded-2xl overflow-hidden ${darkMode ? 'bg-dark-800 border border-dark-700' : 'bg-white shadow-sm'}`}>
                <table className="w-full">
                  <thead>
                    <tr className={`text-left text-xs font-medium ${darkMode ? 'text-dark-400 border-b border-dark-700' : 'text-dark-500 border-b border-dark-200'}`}>
                      <th className="p-4">Name</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Role</th>
                      <th className="p-4">Favorites</th>
                    </tr>
                  </thead>
                  <tbody>
                    {liveUsers.map((u: any) => (
                      <tr key={u.id} className={`${darkMode ? 'border-b border-dark-800' : 'border-b border-dark-100'}`}>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-sm">
                              {u.photoURL ? <img src={u.photoURL} alt="" /> : u.name[0]}
                            </div>
                            <span className="text-sm font-medium">{u.name}</span>
                          </div>
                        </td>
                        <td className="p-4 text-sm">{u.email}</td>
                        <td className="p-4">
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                            u.role === 'admin' ? 'bg-purple-500/20 text-purple-500' : 'bg-primary-500/20 text-primary-500'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="p-4 text-sm">{u.favorites?.length || 0} Cars</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
