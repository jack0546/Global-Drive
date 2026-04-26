import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Clock, ChevronRight, MessageSquare, Car } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';

interface Order {
  id: string;
  type: string;
  carName: string;
  createdAt: any;
  status: string;
  message: string;
}

interface HistoryProps {
  darkMode: boolean;
}

export default function History({ darkMode }: HistoryProps) {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      try {
        const q = query(
          collection(db, 'orders'),
          where('userId', '==', user.id),
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Order[];
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (!user) {
    return (
      <div className={`min-h-screen pt-20 flex items-center justify-center ${darkMode ? 'bg-dark-950 text-white' : 'bg-gray-50'}`}>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please login to view history</h2>
          <Link to="/auth" className="bg-primary-600 text-white px-6 py-2 rounded-xl hover:bg-primary-700 transition-all">Sign In</Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pt-20 ${darkMode ? 'bg-dark-950 text-white' : 'bg-gray-50 text-dark-900'}`}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-primary-600/20 rounded-2xl flex items-center justify-center">
            <ShoppingBag className="w-6 h-6 text-primary-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">My History</h1>
            <p className={`text-sm ${darkMode ? 'text-dark-400' : 'text-dark-500'}`}>View your car inquiries and requests</p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className={`h-24 animate-pulse rounded-2xl ${darkMode ? 'bg-dark-800' : 'bg-white shadow-sm'}`} />
            ))}
          </div>
        ) : orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order, i) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`p-5 rounded-2xl border transition-all ${
                  darkMode ? 'bg-dark-800 border-dark-700 hover:border-dark-600' : 'bg-white border-dark-200 hover:shadow-md'
                }`}
              >
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      order.type === 'inquiry' ? 'bg-blue-500/10 text-blue-500' : 'bg-purple-500/10 text-purple-500'
                    }`}>
                      {order.type === 'test-drive' ? <Car className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
                    </div>
                    <div>
                      <h3 className="font-bold">{order.carName || 'General Inquiry'}</h3>
                      <div className="flex items-center gap-2 text-xs opacity-60 mt-0.5">
                        <Clock className="w-3 h-3" />
                        {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : 'Recent'}
                        <span className="mx-1">•</span>
                        <span className="capitalize">{order.type.replace('-', ' ')}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      order.status === 'completed' ? 'bg-green-500/20 text-green-500' : 
                      order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' : 
                      'bg-gray-500/20 text-gray-500'
                    }`}>
                      {order.status.toUpperCase()}
                    </span>
                    <ChevronRight className="w-5 h-5 opacity-30" />
                  </div>
                </div>
                {order.message && (
                  <p className={`mt-4 text-xs italic line-clamp-1 ${darkMode ? 'text-dark-400' : 'text-dark-500'}`}>
                    "{order.message}"
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className={`p-12 text-center rounded-3xl ${darkMode ? 'bg-dark-800' : 'bg-white shadow-sm'}`}>
            <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <h2 className="text-xl font-bold mb-2">No history found</h2>
            <p className={`mb-6 ${darkMode ? 'text-dark-400' : 'text-dark-500'}`}>You haven't made any inquiries yet.</p>
            <Link to="/cars" className="inline-flex bg-primary-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-all">
              Browse Cars
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
