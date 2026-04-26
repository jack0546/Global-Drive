import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Car, Menu, X, User, LogOut, Shield, Heart, Moon, Sun } from 'lucide-react';
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
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 via-accent-500 to-gold-500 rounded-xl flex items-center justify-center transform group-hover:scale-105 transition-transform">
              <Car className="w-6 h-6 text-white" />
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

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                    darkMode ? 'hover:bg-dark-700 text-dark-200' : 'hover:bg-dark-100 text-dark-700'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-primary-500 to-accent-600">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-white font-semibold text-sm">{user.name[0]}</span>
                    )}
                  </div>
                  <span className="text-sm font-medium hidden sm:block">{user.name}</span>
                </button>
                {dropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                    <div className={`absolute right-0 mt-2 w-52 rounded-xl shadow-2xl border overflow-hidden z-20 ${
                      darkMode ? 'bg-dark-800 border-dark-700' : 'bg-white border-dark-200'
                    }`}>
                      {user.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setDropdownOpen(false)}
                          className={`flex items-center gap-3 px-4 py-3 text-sm transition-all ${
                            darkMode ? 'hover:bg-dark-700 text-dark-200' : 'hover:bg-dark-50 text-dark-700'
                          }`}
                        >
                          <Shield className="w-4 h-4 text-primary-400" />
                          Admin Dashboard
                        </Link>
                      )}
                      <Link
                        to="/favorites"
                        onClick={() => setDropdownOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 text-sm transition-all ${
                          darkMode ? 'hover:bg-dark-700 text-dark-200' : 'hover:bg-dark-50 text-dark-700'
                        }`}
                      >
                        <Heart className="w-4 h-4 text-red-400" />
                        Favorites
                      </Link>
                      <button
                        onClick={() => { logout(); setDropdownOpen(false); }}
                        className={`flex items-center gap-3 px-4 py-3 text-sm w-full transition-all ${
                          darkMode ? 'hover:bg-dark-700 text-red-400' : 'hover:bg-dark-50 text-red-600'
                        }`}
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
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
          </div>
        </div>
      )}
    </nav>
  );
}
