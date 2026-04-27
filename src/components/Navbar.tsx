import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Car, Menu, X, User, LogOut, Shield, Heart, Moon, Sun, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (v: boolean) => void;
}

export default function Navbar({ darkMode, setDarkMode }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const links = [
    { href: '/', label: 'Home' },
    { href: '/cars', label: 'Browse Cars' },
    { href: '/cars?tab=Mercedes-Benz', label: 'Import' },
    { href: '/contact', label: 'Contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path.split('?')[0]);
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${darkMode ? 'bg-dark-900/95 backdrop-blur-md border-b border-dark-700' : 'bg-white/95 backdrop-blur-md border-b border-dark-200'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center transform group-hover:scale-105 transition-transform">
              <img src="/logo.jpg" alt="Global Drive" className="w-full h-full object-cover" />
            </div>
            <div>
              <span className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-dark-900'}`}>Global Drive</span>
              <span className="text-xs block text-gradient font-semibold -mt-1">Africa</span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {links.map(link => (
              <Link
                key={link.href}
                to={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive(link.href)
                    ? darkMode ? 'bg-primary-600/20 text-primary-400' : 'bg-primary-50 text-primary-700'
                    : darkMode ? 'text-dark-300 hover:text-white hover:bg-dark-700' : 'text-dark-600 hover:text-dark-900 hover:bg-dark-100'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg transition-all ${
                darkMode ? 'text-gold-400 hover:bg-dark-700' : 'text-dark-500 hover:bg-dark-100'
              }`}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* User Section */}
            {user ? (
              <div className="flex items-center gap-1">
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className={`p-2 rounded-lg transition-all ${
                      darkMode ? 'text-primary-400 hover:bg-dark-700' : 'text-primary-600 hover:bg-dark-100'
                    }`}
                    title="Admin Dashboard"
                  >
                    <Shield className="w-5 h-5" />
                  </Link>
                )}
                <Link
                  to="/favorites"
                  className={`p-2 rounded-lg transition-all ${
                    darkMode ? 'text-red-400 hover:bg-dark-700' : 'text-red-600 hover:bg-dark-100'
                  }`}
                  title="My Favorites"
                >
                  <Heart className="w-5 h-5" />
                </Link>
                <Link
                  to="/history"
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                    darkMode ? 'hover:bg-dark-700 text-dark-200' : 'hover:bg-dark-100 text-dark-700'
                  }`}
                  title="My History"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-primary-500 to-accent-600">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-white font-semibold text-sm">{user.name[0]}</span>
                    )}
                  </div>
                  <span className="text-sm font-medium hidden sm:block">History</span>
                </Link>
                <button
                  onClick={() => { logout(); window.location.href = '/'; }}
                  className={`p-2 rounded-lg transition-all ${
                    darkMode ? 'text-red-400 hover:bg-dark-700' : 'text-red-600 hover:bg-dark-100'
                  }`}
                  title="Sign Out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  darkMode ? 'bg-primary-600 hover:bg-primary-700 text-white' : 'bg-primary-600 hover:bg-primary-700 text-white'
                }`}
              >
                <User className="w-4 h-4" />
                Sign In
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`md:hidden p-2 rounded-lg ${darkMode ? 'text-dark-300 hover:bg-dark-700' : 'text-dark-600 hover:bg-dark-100'}`}
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className={`md:hidden border-t ${darkMode ? 'bg-dark-900 border-dark-700' : 'bg-white border-dark-200'}`}>
          <div className="px-4 py-3 space-y-1">
            {links.map(link => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActive(link.href)
                    ? darkMode ? 'bg-primary-600/20 text-primary-400' : 'bg-primary-50 text-primary-700'
                    : darkMode ? 'text-dark-300 hover:bg-dark-700' : 'text-dark-600 hover:bg-dark-100'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {user ? (
              <>
                <div className={`my-2 border-t ${darkMode ? 'border-dark-700' : 'border-dark-200'}`} />
                <Link
                  to="/history"
                  onClick={() => setMobileOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium ${darkMode ? 'text-dark-300 hover:bg-dark-700' : 'text-dark-600 hover:bg-dark-100'}`}
                >
                  My History
                </Link>
                <Link
                  to="/favorites"
                  onClick={() => setMobileOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium ${darkMode ? 'text-dark-300 hover:bg-dark-700' : 'text-dark-600 hover:bg-dark-100'}`}
                >
                  My Favorites
                </Link>
                <button
                  onClick={() => { logout(); setMobileOpen(false); }}
                  className="block w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-red-500 hover:bg-red-500/10"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-3 rounded-lg text-sm font-medium ${darkMode ? 'text-dark-300 hover:bg-dark-700' : 'text-dark-600 hover:bg-dark-100'}`}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
