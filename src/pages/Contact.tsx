import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, MessageCircle, Send, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface ContactProps {
  darkMode: boolean;
}

export default function Contact({ darkMode }: ContactProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    type: 'general',
    carName: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('https://formspree.io/f/mjgprlgl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        if (formData.type !== 'general') {
          try {
            const ordersRef = collection(db, 'orders');
            await addDoc(ordersRef, {
              userId: user?.id || 'anonymous',
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
              type: formData.type,
              carName: formData.carName,
              message: formData.message,
              createdAt: serverTimestamp(),
              status: 'pending'
            });
          } catch (dbError) {
            console.error("Error saving order to Firestore:", dbError);
            // We don't fail the whole submission since Formspree succeeded
          }
        }

        toast.success('Message sent successfully! We will get back to you soon.');
        setFormData({ name: '', email: '', phone: '', type: 'general', carName: '', message: '' });
      } else {
        toast.error('Failed to send message. Please try again later.');
      }
    } catch (error) {
      toast.error('An error occurred while sending your message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen pt-20 ${darkMode ? 'bg-dark-950 text-white' : 'bg-gray-50 text-dark-900'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Get In <span className="text-gradient">Touch</span>
          </h1>
          <p className={`text-lg max-w-2xl mx-auto ${darkMode ? 'text-dark-400' : 'text-dark-500'}`}>
            Have a question about our vehicles or services? We're here to help you drive your dream car.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {[
              { icon: MapPin, title: 'Visit Us', details: ['Airport City, Accra', 'Ghana, West Africa'] },
              { icon: Phone, title: 'Call Us', details: ['+233244240166', 'Mon-Sat: 9AM - 6PM'] },
              { icon: Mail, title: 'Email Us', details: ['globaldrive.gh@gmail.com', 'We reply within 24 hours'] },
              { icon: Clock, title: 'Business Hours', details: ['Mon - Fri: 8AM - 6PM', 'Sat: 9AM - 4PM', 'Sun: Closed'] },
            ].map((item, i) => (
              <div key={i} className={`flex items-start gap-4 p-4 rounded-xl ${darkMode ? 'bg-dark-800 border border-dark-700' : 'bg-white shadow-sm'}`}>
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500/20 to-accent-500/20 rounded-xl flex items-center justify-center shrink-0">
                  <item.icon className="w-6 h-6 text-primary-500" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  {item.details.map((d, j) => (
                    <p key={j} className={`text-sm ${darkMode ? 'text-dark-400' : 'text-dark-500'}`}>{d}</p>
                  ))}
                </div>
              </div>
            ))}

            {/* WhatsApp */}
            <a
              href="https://wa.me/233244240166"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 rounded-xl bg-green-500/10 border border-green-500/20 hover:bg-green-500/20 transition-all"
            >
              <MessageCircle className="w-6 h-6 text-green-500" />
              <div>
                <p className="font-semibold text-sm text-green-600">Chat on WhatsApp</p>
                <p className="text-xs text-green-500/70">Fastest response time</p>
              </div>
            </a>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <form onSubmit={handleSubmit} className={`p-6 rounded-2xl ${darkMode ? 'bg-dark-800 border border-dark-700' : 'bg-white shadow-xl'}`}>
              <h2 className="text-xl font-bold mb-6">Send Us a Message</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl text-sm border transition-all ${
                      darkMode ? 'bg-dark-700 border-dark-600 text-dark-200 placeholder-dark-500 focus:border-primary-500' : 'bg-dark-50 border-dark-200 focus:border-primary-500'
                    }`}
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl text-sm border transition-all ${
                      darkMode ? 'bg-dark-700 border-dark-600 text-dark-200 placeholder-dark-500 focus:border-primary-500' : 'bg-dark-50 border-dark-200 focus:border-primary-500'
                    }`}
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl text-sm border transition-all ${
                      darkMode ? 'bg-dark-700 border-dark-600 text-dark-200 placeholder-dark-500 focus:border-primary-500' : 'bg-dark-50 border-dark-200 focus:border-primary-500'
                    }`}
                    placeholder="+233244240166"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Inquiry Type *</label>
                  <select
                    required
                    value={formData.type}
                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl text-sm border transition-all ${
                      darkMode ? 'bg-dark-700 border-dark-600 text-dark-200 focus:border-primary-500' : 'bg-dark-50 border-dark-200 focus:border-primary-500'
                    }`}
                  >
                    <option value="general">General Inquiry</option>
                    <option value="inquiry">Car Inquiry</option>
                    <option value="test-drive">Test Drive Request</option>
                    <option value="import">Import Request</option>
                  </select>
                </div>
              </div>

              {formData.type !== 'general' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1.5">Car Name / Model</label>
                  <input
                    type="text"
                    value={formData.carName}
                    onChange={e => setFormData({ ...formData, carName: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl text-sm border transition-all ${
                      darkMode ? 'bg-dark-700 border-dark-600 text-dark-200 placeholder-dark-500 focus:border-primary-500' : 'bg-dark-50 border-dark-200 focus:border-primary-500'
                    }`}
                    placeholder="e.g., Toyota Land Cruiser V8"
                  />
                </div>
              )}

              <div className="mb-6">
                <label className="block text-sm font-medium mb-1.5">Message *</label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl text-sm border transition-all ${
                    darkMode ? 'bg-dark-700 border-dark-600 text-dark-200 placeholder-dark-500 focus:border-primary-500' : 'bg-dark-50 border-dark-200 focus:border-primary-500'
                  }`}
                  placeholder="Tell us how we can help you..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white py-3.5 rounded-xl font-semibold transition-all"
              >
                <Send className="w-4 h-4" />
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
