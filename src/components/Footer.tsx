import { Link } from 'react-router-dom';
import { Car, Mail, Phone, MapPin, Globe, MessageCircle, Camera, Video } from 'lucide-react';

interface FooterProps {
  darkMode: boolean;
}

export default function Footer({ darkMode }: FooterProps) {
  return (
    <footer className={`${darkMode ? 'bg-dark-950 border-t border-dark-800' : 'bg-dark-900 text-white'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 via-accent-500 to-gold-500 rounded-xl flex items-center justify-center">
                <Car className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="font-bold text-lg text-white">Global Drive</span>
                <span className="text-xs block text-gradient font-semibold -mt-1">Africa</span>
              </div>
            </Link>
            <p className={`text-sm ${darkMode ? 'text-dark-400' : 'text-dark-300'}`}>
              Premium car dealership specializing in imported and local vehicles across Africa. Your trusted partner in automotive excellence.
            </p>
            <div className="flex gap-3">
              {[Globe, MessageCircle, Camera, Video].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                    darkMode ? 'bg-dark-800 hover:bg-primary-600 text-dark-300 hover:text-white' : 'bg-dark-800 hover:bg-primary-600 text-dark-300 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { label: 'Browse Cars', to: '/cars' },
                { label: 'Request Import', to: '/contact' },
                { label: 'Parts & Accessories', to: '/cars' },
                { label: 'Car Comparison', to: '/compare' },
              ].map(link => (
                <li key={link.label}>
                  <Link to={link.to} className={`text-sm transition-all hover:text-primary-400 ${darkMode ? 'text-dark-400' : 'text-dark-300'}`}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Brands */}
          <div>
            <h3 className="font-semibold text-white mb-4">Brands</h3>
            <ul className="space-y-3">
              {['Toyota', 'Mercedes-Benz', 'BMW', 'Lexus', 'Honda', 'Nissan', 'Hyundai', 'Kia'].map(brand => (
                <li key={brand}>
                  <Link to={`/cars?brand=${brand}`} className={`text-sm transition-all hover:text-primary-400 ${darkMode ? 'text-dark-400' : 'text-dark-300'}`}>
                    {brand}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary-400 shrink-0 mt-0.5" />
                <span className={`text-sm ${darkMode ? 'text-dark-400' : 'text-dark-300'}`}>
                  Accra, Ghana<br />Airport City
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary-400 shrink-0" />
                <a href="tel:+0244240166" className={`text-sm transition-all hover:text-primary-400 ${darkMode ? 'text-dark-400' : 'text-dark-300'}`}>
                  0244240166
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary-400 shrink-0" />
                <a href="mailto:globaldrive.gh@gmail.com" className={`text-sm transition-all hover:text-primary-400 ${darkMode ? 'text-dark-400' : 'text-dark-300'}`}>
                  globaldrive.gh@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className={`mt-8 pt-8 border-t ${darkMode ? 'border-dark-800' : 'border-dark-800'} flex flex-col sm:flex-row items-center justify-between gap-4`}>
          <p className={`text-sm ${darkMode ? 'text-dark-500' : 'text-dark-400'}`}>
            © {new Date().getFullYear()} Global Drive Africa. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className={`text-xs ${darkMode ? 'text-dark-500 hover:text-dark-300' : 'text-dark-400 hover:text-dark-200'}`}>Privacy Policy</a>
            <a href="#" className={`text-xs ${darkMode ? 'text-dark-500 hover:text-dark-300' : 'text-dark-400 hover:text-dark-200'}`}>Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
