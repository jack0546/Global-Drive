import { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, X, Fuel, Settings, Heart, MapPin, Gauge } from 'lucide-react';
import { cars, brands } from '../data/cars';
import { useAuth } from '../context/AuthContext';

interface CarsProps {
  darkMode: boolean;
}

export default function Cars({ darkMode }: CarsProps) {
  const [searchParams] = useSearchParams();
  const { toggleFavorite, isFavorite } = useAuth();
  const initialTab = searchParams.get('tab') || searchParams.get('brand') || 'All';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    minPrice: 0,
    maxPrice: 1000000,
    minYear: 2018,
    transmission: '',
    fuelType: '',
    condition: '',
  });

  const filteredCars = useMemo(() => {
    let result = activeTab === 'All' ? cars : cars.filter(c => c.brand === activeTab);
    
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(c => c.name.toLowerCase().includes(q) || c.model.toLowerCase().includes(q));
    }
    if (filters.minPrice) result = result.filter(c => c.priceUSD >= filters.minPrice);
    if (filters.maxPrice < 1000000) result = result.filter(c => c.priceUSD <= filters.maxPrice);
    if (filters.minYear > 2018) result = result.filter(c => c.year >= filters.minYear);
    if (filters.transmission) result = result.filter(c => c.transmission === filters.transmission);
    if (filters.fuelType) result = result.filter(c => c.fuelType === filters.fuelType);
    if (filters.condition) result = result.filter(c => c.condition === filters.condition);
    
    return result;
  }, [activeTab, filters]);

  const allBrands = ['All', ...brands.map(b => b.name)];

  return (
    <div className={`min-h-screen pt-20 ${darkMode ? 'bg-dark-950 text-white' : 'bg-gray-50 text-dark-900'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Browse <span className="text-gradient">Cars</span></h1>
            <p className={`mt-1 ${darkMode ? 'text-dark-400' : 'text-dark-500'}`}>
              {filteredCars.length} vehicles available
            </p>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              darkMode ? 'bg-dark-800 hover:bg-dark-700 border border-dark-600' : 'bg-white hover:bg-dark-50 border border-dark-200'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {showFilters && <X className="w-4 h-4" />}
          </button>
        </motion.div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-dark-400' : 'text-dark-400'}`} />
          <input
            type="text"
            placeholder="Search cars by name or model..."
            value={filters.search}
            onChange={e => setFilters({ ...filters, search: e.target.value })}
            className={`w-full pl-12 pr-4 py-3 rounded-xl text-sm border transition-all ${
              darkMode ? 'bg-dark-800 border-dark-700 text-dark-200 placeholder-dark-500 focus:border-primary-500' : 'bg-white border-dark-200 text-dark-900 placeholder-dark-400 focus:border-primary-500'
            }`}
          />
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className={`mb-6 p-6 rounded-2xl ${darkMode ? 'bg-dark-800 border border-dark-700' : 'bg-white border border-dark-200'}`}
          >
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1.5">Min Price (USD)</label>
                <input type="number" placeholder="0" value={filters.minPrice || ''}
                  onChange={e => setFilters({ ...filters, minPrice: Number(e.target.value) })}
                  className={`w-full px-3 py-2 rounded-lg text-sm border ${darkMode ? 'bg-dark-700 border-dark-600 text-dark-200' : 'bg-dark-50 border-dark-200'}`} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5">Max Price (USD)</label>
                <input type="number" placeholder="1000000" value={filters.maxPrice >= 1000000 ? '' : filters.maxPrice}
                  onChange={e => setFilters({ ...filters, maxPrice: Number(e.target.value) || 1000000 })}
                  className={`w-full px-3 py-2 rounded-lg text-sm border ${darkMode ? 'bg-dark-700 border-dark-600 text-dark-200' : 'bg-dark-50 border-dark-200'}`} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5">Min Year</label>
                <select value={filters.minYear} onChange={e => setFilters({ ...filters, minYear: Number(e.target.value) })}
                  className={`w-full px-3 py-2 rounded-lg text-sm border ${darkMode ? 'bg-dark-700 border-dark-600 text-dark-200' : 'bg-dark-50 border-dark-200'}`}>
                  {[2018, 2019, 2020, 2021, 2022, 2023, 2024].map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5">Transmission</label>
                <select value={filters.transmission} onChange={e => setFilters({ ...filters, transmission: e.target.value })}
                  className={`w-full px-3 py-2 rounded-lg text-sm border ${darkMode ? 'bg-dark-700 border-dark-600 text-dark-200' : 'bg-dark-50 border-dark-200'}`}>
                  <option value="">All</option>
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                  <option value="CVT">CVT</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5">Fuel Type</label>
                <select value={filters.fuelType} onChange={e => setFilters({ ...filters, fuelType: e.target.value })}
                  className={`w-full px-3 py-2 rounded-lg text-sm border ${darkMode ? 'bg-dark-700 border-dark-600 text-dark-200' : 'bg-dark-50 border-dark-200'}`}>
                  <option value="">All</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Electric">Electric</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5">Condition</label>
                <select value={filters.condition} onChange={e => setFilters({ ...filters, condition: e.target.value })}
                  className={`w-full px-3 py-2 rounded-lg text-sm border ${darkMode ? 'bg-dark-700 border-dark-600 text-dark-200' : 'bg-dark-50 border-dark-200'}`}>
                  <option value="">All</option>
                  <option value="New">New</option>
                  <option value="Used">Used</option>
                  <option value="Foreign Used">Foreign Used</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}

        {/* Brand Tabs */}
        <div className="flex overflow-x-auto gap-2 pb-4 mb-8 scrollbar-hide">
          {allBrands.map(brand => (
            <button
              key={brand}
              onClick={() => setActiveTab(brand)}
              className={`px-5 py-2.5 rounded-xl whitespace-nowrap text-sm font-medium transition-all ${
                activeTab === brand
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30'
                  : darkMode ? 'bg-dark-800 text-dark-300 hover:bg-dark-700' : 'bg-white text-dark-600 hover:bg-dark-50 border border-dark-200'
              }`}
            >
              {brand}
            </button>
          ))}
        </div>

        {/* Car Grid */}
        {filteredCars.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-4 opacity-30 flex items-center justify-center">
              <svg className="w-16 h-16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.5-1.1-.7-1.8-.7H5c-.6 0-1.1.3-1.4.8l-1.5 2.8C1.5 11.3 2 12.2 3 12.5V16c0 .6.4 1 1 1h1" strokeLinecap="round" strokeLinejoin="round"/><path d="M7 17a2 2 0 1 0 4 0 2 2 0 0 0-4 0" strokeLinecap="round" strokeLinejoin="round"/><path d="M13 17a2 2 0 1 0 4 0 2 2 0 0 0-4 0" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <h3 className="text-xl font-bold mb-2">No cars found</h3>
            <p className={darkMode ? 'text-dark-400' : 'text-dark-500'}>Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCars.map((car, index) => (
              <motion.div
                key={car.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="relative"
              >
                <Link
                  to={`/car/${car.id}`}
                  className={`group block rounded-2xl overflow-hidden transition-all car-card-shadow hover:-translate-y-1 ${
                    darkMode ? 'bg-dark-800 border border-dark-700' : 'bg-white'
                  }`}
                >
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={car.images[0]}
                      alt={car.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    {car.featured && (
                      <span className="absolute top-3 left-3 bg-gold-500 text-dark-900 text-xs font-bold px-3 py-1 rounded-full">
                        FEATURED
                      </span>
                    )}
                    {car.sold && (
                      <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                        SOLD
                      </span>
                    )}
                    {car.condition === 'New' && !car.sold && (
                      <span className="absolute top-3 right-3 bg-primary-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                        NEW
                      </span>
                    )}
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="text-white font-bold text-lg drop-shadow-lg">{car.name}</h3>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-3 text-xs mb-3">
                      <span className={`flex items-center gap-1 ${darkMode ? 'text-dark-400' : 'text-dark-500'}`}>
                        <Gauge className="w-3 h-3" /> {car.mileage?.toLocaleString()} km
                      </span>
                      <span className={`flex items-center gap-1 ${darkMode ? 'text-dark-400' : 'text-dark-500'}`}>
                        <Fuel className="w-3 h-3" /> {car.fuelType}
                      </span>
                      <span className={`flex items-center gap-1 ${darkMode ? 'text-dark-400' : 'text-dark-500'}`}>
                        <Settings className="w-3 h-3" /> {car.transmission}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-lg font-bold text-primary-500">${car.priceUSD?.toLocaleString()}</p>
                        <p className={`text-xs ${darkMode ? 'text-dark-500' : 'text-dark-400'}`}>
                          GHS {car.priceGHS?.toLocaleString()}
                        </p>
                      </div>
                      <span className={`text-xs flex items-center gap-1 ${darkMode ? 'text-dark-400' : 'text-dark-400'}`}>
                        <MapPin className="w-3 h-3" /> {car.location.split(',')[0]}
                      </span>
                    </div>
                  </div>
                </Link>
                <button
                  onClick={(e) => { e.preventDefault(); toggleFavorite(car.id); }}
                  className={`absolute top-4 right-4 z-10 p-2 rounded-full transition-all ${
                    isFavorite(car.id)
                      ? 'bg-red-500 text-white'
                      : 'bg-black/50 text-white hover:bg-red-500'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isFavorite(car.id) ? 'fill-current' : ''}`} />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
