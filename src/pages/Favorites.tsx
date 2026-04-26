import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ArrowLeft, Fuel, Settings, Gauge, MapPin } from 'lucide-react';
import { cars } from '../data/cars';
import { useAuth } from '../context/AuthContext';

interface FavoritesProps {
  darkMode: boolean;
}

export default function Favorites({ darkMode }: FavoritesProps) {
  const { isFavorite, toggleFavorite } = useAuth();
  const favoriteCars = cars.filter(c => isFavorite(c.id));

  return (
    <div className={`min-h-screen pt-20 ${darkMode ? 'bg-dark-950 text-white' : 'bg-gray-50 text-dark-900'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/cars" className={`p-2 rounded-lg transition-all ${darkMode ? 'hover:bg-dark-800' : 'hover:bg-white'}`}>
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Heart className="w-8 h-8 text-red-500" />
              My Favorites
            </h1>
            <p className={`mt-1 ${darkMode ? 'text-dark-400' : 'text-dark-500'}`}>
              {favoriteCars.length} saved vehicles
            </p>
          </div>
        </div>

        {favoriteCars.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="w-20 h-20 mx-auto mb-4 opacity-20" />
            <h3 className="text-xl font-bold mb-2">No favorites yet</h3>
            <p className={`mb-6 ${darkMode ? 'text-dark-400' : 'text-dark-500'}`}>Start saving cars you love!</p>
            <Link to="/cars" className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-all">
              Browse Cars
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteCars.map((car, index) => (
              <motion.div
                key={car.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="relative"
              >
                <Link to={`/car/${car.id}`} className={`group block rounded-2xl overflow-hidden transition-all car-card-shadow hover:-translate-y-1 ${darkMode ? 'bg-dark-800 border border-dark-700' : 'bg-white'}`}>
                  <div className="relative h-52 overflow-hidden">
                    <img src={car.images[0]} alt={car.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="text-white font-bold text-lg">{car.name}</h3>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-3 text-xs mb-3">
                      <span className={`flex items-center gap-1 ${darkMode ? 'text-dark-400' : 'text-dark-500'}`}><Gauge className="w-3 h-3" /> {car.mileage?.toLocaleString()} km</span>
                      <span className={`flex items-center gap-1 ${darkMode ? 'text-dark-400' : 'text-dark-500'}`}><Fuel className="w-3 h-3" /> {car.fuelType}</span>
                      <span className={`flex items-center gap-1 ${darkMode ? 'text-dark-400' : 'text-dark-500'}`}><Settings className="w-3 h-3" /> {car.transmission}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-bold text-primary-500">${car.priceUSD?.toLocaleString()}</p>
                      <span className={`text-xs flex items-center gap-1 ${darkMode ? 'text-dark-400' : 'text-dark-400'}`}><MapPin className="w-3 h-3" /> {car.location.split(',')[0]}</span>
                    </div>
                  </div>
                </Link>
                <button onClick={() => toggleFavorite(car.id)}
                  className="absolute top-4 right-4 z-10 p-2 rounded-full bg-red-500 text-white transition-all hover:bg-red-600">
                  <Heart className="w-4 h-4 fill-current" />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
