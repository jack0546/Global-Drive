import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Car, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

interface AuthProps {
  darkMode: boolean;
}

export default function Auth({ darkMode }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let success;
      if (isLogin) {
        success = await login(email, password);
        if (success) {
          toast.success('Welcome back!');
          navigate('/');
        } else {
          toast.error('Invalid email or password');
        }
      } else {
        if (!name.trim()) {
          toast.error('Please enter your name');
          setLoading(false);
          return;
        }
        success = await register(name, email, password);
        if (success) {
          toast.success('Account created successfully!');
          navigate('/');
        } else {
          toast.error('Email already exists');
        }
      }
    } catch {
      toast.error('Something went wrong');
    }
    setLoading(false);
  };

  return (
    <div className={`min-h-screen pt-20 flex items-center justify-center ${darkMode ? 'bg-dark-950 text-white' : 'bg-gray-50'}`}>
      <div className="w-full max-w-md px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-8 rounded-2xl ${darkMode ? 'bg-dark-800 border border-dark-700' : 'bg-white shadow-xl'}`}
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-600 via-accent-500 to-gold-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Car className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold">{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
            <p className={`text-sm mt-1 ${darkMode ? 'text-dark-400' : 'text-dark-500'}`}>
              {isLogin ? 'Sign in to your account' : 'Join Global Drive Africa'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium mb-1.5">Full Name</label>
                <div className="relative">
                  <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-dark-400' : 'text-dark-400'}`} />
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="John Doe"
                    className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm border transition-all ${
                      darkMode ? 'bg-dark-700 border-dark-600 text-dark-200 placeholder-dark-500 focus:border-primary-500' : 'bg-dark-50 border-dark-200 text-dark-900 focus:border-primary-500'
                    }`}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1.5">Email</label>
              <div className="relative">
                <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-dark-400' : 'text-dark-400'}`} />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm border transition-all ${
                    darkMode ? 'bg-dark-700 border-dark-600 text-dark-200 placeholder-dark-500 focus:border-primary-500' : 'bg-dark-50 border-dark-200 text-dark-900 focus:border-primary-500'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Password</label>
              <div className="relative">
                <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-dark-400' : 'text-dark-400'}`} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className={`w-full pl-10 pr-12 py-3 rounded-xl text-sm border transition-all ${
                    darkMode ? 'bg-dark-700 border-dark-600 text-dark-200 placeholder-dark-500 focus:border-primary-500' : 'bg-dark-50 border-dark-200 text-dark-900 focus:border-primary-500'
                  }`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 ${darkMode ? 'text-dark-400 hover:text-dark-200' : 'text-dark-400 hover:text-dark-600'}`}>
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white rounded-xl font-semibold transition-all"
            >
              {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className={`text-sm ${darkMode ? 'text-dark-400' : 'text-dark-500'}`}>
              {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button onClick={() => setIsLogin(!isLogin)} className="text-primary-500 hover:underline font-medium">
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>

          {isLogin && (
            <div className="mt-4 p-3 rounded-xl bg-primary-500/10 border border-primary-500/20">
              <p className="text-xs text-primary-600 text-center">
                <strong>Demo Admin:</strong> admin@globaldriveafrica.com / admin123
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
