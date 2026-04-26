import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Heart, Fuel, Settings, Gauge, MapPin, Calendar, Shield, Truck, Check, X as XIcon, MessageCircle, ShoppingCart } from 'lucide-react';
import { cars } from '../data/cars';
import { useAuth } from '../context/AuthContext';

interface CarDetailProps {
  darkMode: boolean;
}

export default function CarDetail({ darkMode }: CarDetailProps) {
  const { id } = useParams();
  const { toggleFavorite, isFavorite } = useAuth();
  const car = cars.find(c => c.id === id);
  const [currentImage, setCurrentImage] = useState(0);
  const [activeTab, setActiveTab] = useState<'gallery' | 'interior' | 'exterior' | 'engine' | 'parts'>('gallery');

  if (!car) {
    return (
      <div className={`min-h-screen pt-20 flex items-center justify-center ${darkMode ? 'bg-dark-950 text-white' : 'bg-gray-50'}`}>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Car Not Found</h2>
          <Link to="/cars" className="text-primary-500 hover:underline">Back to listings</Link>
        </div>
      </div>
    );
  }

  const getImages = () => {
    switch (activeTab) {
      case 'gallery': return car.images;
      case 'interior': return car.interiorImages;
      case 'exterior': return car.exteriorImages;
      case 'engine': return car.engineImages;
      case 'parts': return car.partsImages.map(p => p.url);
    }
  };

  const images = getImages();
  const whatsappUrl = `https://wa.me/233244240166?text=${encodeURIComponent(`Hello Global Drive Africa, I'm interested in ${car.name}`)}`;

  return (
    <div className={`min-h-screen pt-20 ${darkMode ? 'bg-dark-950 text-white' : 'bg-gray-50 text-dark-900'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm mb-6">
          <Link to="/" className={`hover:text-primary-500 ${darkMode ? 'text-dark-400' : 'text-dark-500'}`}>Home</Link>
          <span className={darkMode ? 'text-dark-600' : 'text-dark-300'}>/</span>
          <Link to="/cars" className={`hover:text-primary-500 ${darkMode ? 'text-dark-400' : 'text-dark-500'}`}>Cars</Link>
          <span className={darkMode ? 'text-dark-600' : 'text-dark-300'}>/</span>
          <span className="text-primary-500 font-medium">{car.name}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left - Images */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            {/* Main Image */}
            <div className={`relative rounded-2xl overflow-hidden mb-4 ${darkMode ? 'bg-dark-800' : 'bg-white'}`}>
              {images.length > 0 ? (
                <img src={images[currentImage]} alt={car.name} className="w-full h-[400px] object-cover" />
              ) : (
                <div className="w-full h-[400px] flex items-center justify-center text-dark-500">
                  No images available
                </div>
              )}
              {images.length > 1 && (
                <>
                  <button onClick={() => setCurrentImage(prev => (prev - 1 + images.length) % images.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-all">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button onClick={() => setCurrentImage(prev => (prev + 1) % images.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-all">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
              <button
                onClick={() => toggleFavorite(car.id)}
                className={`absolute top-4 right-4 p-3 rounded-full transition-all ${
                  isFavorite(car.id) ? 'bg-red-500 text-white' : 'bg-black/50 text-white hover:bg-red-500'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorite(car.id) ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Thumbnail Tabs */}
            <div className="flex gap-2 mb-4 overflow-x-auto">
              {(['gallery', 'interior', 'exterior', 'engine', 'parts'] as const).map(tab => (
                <button key={tab}
                  onClick={() => { setActiveTab(tab); setCurrentImage(0); }}
                  className={`px-4 py-2 rounded-xl text-xs font-medium capitalize transition-all whitespace-nowrap ${
                    activeTab === tab
                      ? 'bg-primary-600 text-white'
                      : darkMode ? 'bg-dark-800 text-dark-300 hover:bg-dark-700' : 'bg-white text-dark-600 hover:bg-dark-50 border border-dark-200'
                  }`}
                >
                  {tab === 'gallery' ? '📸 Photos' : tab === 'interior' ? '🛋 Interior' : tab === 'exterior' ? '🚗 Exterior' : tab === 'engine' ? '🔧 Engine' : '⚙️ Parts'}
                </button>
              ))}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setCurrentImage(i)}
                    className={`shrink-0 w-20 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                      i === currentImage ? 'border-primary-500' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Parts Section */}
            {activeTab === 'parts' && car.partsImages.length > 0 && (
              <div className={`mt-6 p-6 rounded-2xl ${darkMode ? 'bg-dark-800 border border-dark-700' : 'bg-white border border-dark-200'}`}>
                <h3 className="font-bold text-lg mb-4">Available Spare Parts</h3>
                <div className="grid grid-cols-2 gap-4">
                  {car.partsImages.map((part, i) => (
                    <div key={i} className={`p-4 rounded-xl ${darkMode ? 'bg-dark-700' : 'bg-dark-50'}`}>
                      <img src={part.url} alt={part.name} className="w-full h-32 object-cover rounded-lg mb-3" />
                      <h4 className="font-semibold text-sm">{part.name}</h4>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-primary-500 font-bold">${part.price}</span>
                        {part.available ? (
                          <span className="text-xs flex items-center gap-1 text-green-500"><Check className="w-3 h-3" /> In Stock</span>
                        ) : (
                          <span className="text-xs flex items-center gap-1 text-red-500"><XIcon className="w-3 h-3" /> Out of Stock</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Right - Details */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div className={`p-6 rounded-2xl ${darkMode ? 'bg-dark-800 border border-dark-700' : 'bg-white'}`}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {car.featured && <span className="bg-gold-500 text-dark-900 text-xs font-bold px-3 py-1 rounded-full">FEATURED</span>}
                    {car.condition === 'New' && <span className="bg-primary-500 text-white text-xs font-bold px-3 py-1 rounded-full">NEW</span>}
                    {car.sold && <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">SOLD</span>}
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold">{car.name}</h1>
                  <p className={`text-sm mt-1 ${darkMode ? 'text-dark-400' : 'text-dark-500'}`}>{car.model} · {car.year}</p>
                </div>
              </div>

              {/* Price */}
              <div className={`p-4 rounded-xl mb-6 ${darkMode ? 'bg-dark-700' : 'bg-dark-50'}`}>
                <p className="text-3xl font-bold text-primary-500">${car.priceUSD?.toLocaleString()} <span className="text-sm font-normal text-dark-400">USD</span></p>
                <p className={`text-sm mt-1 ${darkMode ? 'text-dark-400' : 'text-dark-500'}`}>GHS {car.priceGHS?.toLocaleString()}</p>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {[
                  { icon: Calendar, label: 'Year', value: car.year },
                  { icon: Gauge, label: 'Mileage', value: `${car.mileage?.toLocaleString()} km` },
                  { icon: Fuel, label: 'Fuel Type', value: car.fuelType },
                  { icon: Settings, label: 'Transmission', value: car.transmission },
                  { icon: Shield, label: 'Condition', value: car.condition },
                  { icon: MapPin, label: 'Location', value: car.location },
                ].map(spec => (
                  <div key={spec.label} className={`flex items-center gap-3 p-3 rounded-xl ${darkMode ? 'bg-dark-700' : 'bg-dark-50'}`}>
                    <spec.icon className={`w-5 h-5 ${darkMode ? 'text-primary-400' : 'text-primary-600'}`} />
                    <div>
                      <p className={`text-xs ${darkMode ? 'text-dark-400' : 'text-dark-500'}`}>{spec.label}</p>
                      <p className="font-semibold text-sm">{spec.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="font-bold mb-2">Description</h3>
                <p className={`text-sm leading-relaxed ${darkMode ? 'text-dark-300' : 'text-dark-600'}`}>{car.description}</p>
              </div>

              {/* Import Availability */}
              <div className={`flex items-center gap-3 p-4 rounded-xl mb-6 ${car.importAvailable ? (darkMode ? 'bg-green-500/10' : 'bg-green-50') : (darkMode ? 'bg-red-500/10' : 'bg-red-50')}`}>
                {car.importAvailable ? (
                  <>
                    <Truck className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="font-semibold text-sm text-green-600">Import Available</p>
                      <p className={`text-xs ${darkMode ? 'text-dark-400' : 'text-dark-500'}`}>We can import this model for you</p>
                    </div>
                  </>
                ) : (
                  <>
                    <XIcon className="w-5 h-5 text-red-500" />
                    <div>
                      <p className="font-semibold text-sm text-red-600">Import Not Available</p>
                      <p className={`text-xs ${darkMode ? 'text-dark-400' : 'text-dark-500'}`}>Currently available for local purchase only</p>
                    </div>
                  </>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-3.5 rounded-xl font-semibold transition-all">
                  <MessageCircle className="w-5 h-5" />
                  Inquire on WhatsApp
                </a>
                <Link to="/contact"
                  className="flex-1 flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white py-3.5 rounded-xl font-semibold transition-all">
                  <ShoppingCart className="w-5 h-5" />
                  Request Test Drive
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
