import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import Home from './pages/Home';
import Cars from './pages/Cars';
import CarDetail from './pages/CarDetail';
import Auth from './pages/Auth';
import Contact from './pages/Contact';
import Favorites from './pages/Favorites';
import Compare from './pages/Compare';
import Admin from './pages/Admin';

export default function App() {
  const [darkMode, setDarkMode] = useState(true);

  return (
    <AuthProvider>
      <Router>
        <div className={darkMode ? 'dark bg-dark-950' : 'bg-white'}>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: darkMode ? '#1e293b' : '#fff',
                color: darkMode ? '#e2e8f0' : '#0f172a',
                border: darkMode ? '1px solid #334155' : '1px solid #e2e8f0',
              },
            }}
          />
          <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
          <Routes>
            <Route path="/" element={<Home darkMode={darkMode} />} />
            <Route path="/cars" element={<Cars darkMode={darkMode} />} />
            <Route path="/car/:id" element={<CarDetail darkMode={darkMode} />} />
            <Route path="/auth" element={<Auth darkMode={darkMode} />} />
            <Route path="/contact" element={<Contact darkMode={darkMode} />} />
            <Route path="/favorites" element={<Favorites darkMode={darkMode} />} />
            <Route path="/compare" element={<Compare darkMode={darkMode} />} />
            <Route path="/admin" element={<Admin darkMode={darkMode} />} />
          </Routes>
          <Footer darkMode={darkMode} />
          <WhatsAppButton />
        </div>
      </Router>
    </AuthProvider>
  );
}
