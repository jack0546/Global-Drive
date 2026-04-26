import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Car, Search, ArrowRight, Star, Shield, Truck, HeadphonesIcon, Sparkles, Clock, Fuel, Settings } from 'lucide-react';
import { cars, featuredCars, latestArrivals, testimonials, brands } from '../data/cars';

interface HomeProps {
  darkMode: boolean;
}

export default function Home({ darkMode }: HomeProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeTab, setActiveTab] = useState('Toyota');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % featuredCars.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const filteredByTab = cars.filter(c => c.brand === activeTab);

  return (
    <div className={`${darkMode ? 'bg-dark-950 text-white' : 'bg-white text-dark-900'}`}>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <div className={`absolute inset-0 ${darkMode ? 'bg-dark-950/90' : 'bg-black/60'} z-10`} />
          <img
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1920"
            alt="Luxury cars"
            className="w-full h-full object-cover"
          />
          <div className={`absolute inset-0 bg-gradient-to-r ${darkMode ? 'from-dark-950/80 via-dark-950/50 to-transparent' : 'from-black/80 via-black/50 to-transparent'} z-20`} />
        </div>

        <div className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 mb-6">
                <Sparkles className="w-4 h-4 text-gold-400" />
                <span className="text-sm text-gold-300 font-medium">Premium Auto Dealer</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
                <span className="text-white">Drive Your</span><br />
                <span className="text-gradient">Dream Car</span><br />
                <span className="text-white">In Africa</span>
              </h1>
              <p className="text-lg text-dark-300 mb-8 max-w-xl">
                Global Drive Africa brings the world's finest automobiles to your doorstep. 
                Import, buy, and sell premium vehicles across Ghana and Africa.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/cars"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-primary-600/30 transition-all"
                >
                  Browse Cars
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 border-2 border-white/20 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all"
                >
                  Request Import
                </Link>
              </div>

              {/* Stats */}
              <div className="flex gap-8 mt-12 pt-8 border-t border-white/10">
                {[
                  { value: '500+', label: 'Cars Sold' },
                  { value: '50+', label: 'Brands' },
                  { value: '98%', label: 'Satisfaction' },
                ].map(stat => (
                  <div key={stat.label}>
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-sm text-dark-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Featured Cars Slider */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={featuredCars[currentSlide]?.images[0]}
                  alt={featuredCars[currentSlide]?.name}
                  className="w-full h-[400px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-gold-500 text-dark-900 text-xs font-bold px-3 py-1 rounded-full">FEATURED</span>
                    {featuredCars[currentSlide]?.latestArrival && (
                      <span className="bg-primary-500 text-white text-xs font-bold px-3 py-1 rounded-full">NEW ARRIVAL</span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-white">{featuredCars[currentSlide]?.name}</h3>
                  <p className="text-gold-400 font-semibold">
                    ${featuredCars[currentSlide]?.priceUSD?.toLocaleString()} USD
                  </p>
                  <Link
                    to={`/car/${featuredCars[currentSlide]?.id}`}
                    className="inline-flex items-center gap-1 text-sm text-primary-400 hover:text-primary-300 mt-2"
                  >
                    View Details <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
              <div className="flex justify-center gap-2 mt-4">
                {featuredCars.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i === currentSlide ? 'w-8 bg-primary-500' : 'bg-dark-600'
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className={`py-16 ${darkMode ? 'bg-dark-900' : 'bg-dark-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`p-8 rounded-2xl ${darkMode ? 'bg-dark-800 border border-dark-700' : 'bg-white shadow-xl'} -mt-24 relative z-10`}
          >
            <div className="flex items-center gap-3 mb-6">
              <Search className="w-6 h-6 text-primary-500" />
              <h2 className="text-xl font-bold">Find Your Perfect Car</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <select className={`px-4 py-3 rounded-xl text-sm border ${darkMode ? 'bg-dark-700 border-dark-600 text-dark-200' : 'bg-dark-50 border-dark-200 text-dark-700'}`}>
                <option>All Brands</option>
                {brands.map(b => <option key={b.id}>{b.name}</option>)}
              </select>
              <select className={`px-4 py-3 rounded-xl text-sm border ${darkMode ? 'bg-dark-700 border-dark-600 text-dark-200' : 'bg-dark-50 border-dark-200 text-dark-700'}`}>
                <option>Min Price</option>
                <option>$10,000</option>
                <option>$20,000</option>
                <option>$50,000</option>
              </select>
              <select className={`px-4 py-3 rounded-xl text-sm border ${darkMode ? 'bg-dark-700 border-dark-600 text-dark-200' : 'bg-dark-50 border-dark-200 text-dark-700'}`}>
                <option>Max Price</option>
                <option>$50,000</option>
                <option>$100,000</option>
                <option>$200,000</option>
              </select>
              <select className={`px-4 py-3 rounded-xl text-sm border ${darkMode ? 'bg-dark-700 border-dark-600 text-dark-200' : 'bg-dark-50 border-dark-200 text-dark-700'}`}>
                <option>Year</option>
                <option>2024</option>
                <option>2023</option>
                <option>2022</option>
              </select>
              <select className={`px-4 py-3 rounded-xl text-sm border ${darkMode ? 'bg-dark-700 border-dark-600 text-dark-200' : 'bg-dark-50 border-dark-200 text-dark-700'}`}>
                <option>Transmission</option>
                <option>Automatic</option>
                <option>Manual</option>
              </select>
              <Link
                to="/cars"
                className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4" /> Search
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Browse by Brand Tabs */}
      <section className={`py-16 ${darkMode ? 'bg-dark-950' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Browse by <span className="text-gradient">Brand</span>
            </h2>
            <p className={`text-lg ${darkMode ? 'text-dark-400' : 'text-dark-500'}`}>
              Explore our extensive collection from the world's leading manufacturers
            </p>
          </motion.div>

          {/* Brand Tabs */}
          <div className="flex overflow-x-auto gap-2 pb-4 mb-8 scrollbar-hide">
            {brands.map(brand => (
              <button
                key={brand.id}
                onClick={() => setActiveTab(brand.name)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl whitespace-nowrap transition-all ${
                  activeTab === brand.name
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30'
                    : darkMode ? 'bg-dark-800 text-dark-300 hover:bg-dark-700' : 'bg-dark-100 text-dark-600 hover:bg-dark-200'
                }`}
              >
                <span className="text-lg">{brand.logo ? '🚗' : '🚙'}</span>
                <span className="font-medium text-sm">{brand.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  activeTab === brand.name ? 'bg-white/20' : darkMode ? 'bg-dark-700' : 'bg-dark-200'
                }`}>
                  {brand.count}
                </span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredByTab.slice(0, 3).map((car, index) => (
              <motion.div
                key={car.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={`/car/${car.id}`}
                  className={`group block rounded-2xl overflow-hidden transition-all car-card-shadow hover:-translate-y-1 ${
                    darkMode ? 'bg-dark-800 border border-dark-700' : 'bg-white'
                  }`}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={car.images[0]}
                      alt={car.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {car.featured && (
                      <span className="absolute top-3 left-3 bg-gold-500 text-dark-900 text-xs font-bold px-3 py-1 rounded-full">
                        FEATURED
                      </span>
                    )}
                    {car.condition === 'New' && (
                      <span className="absolute top-3 right-3 bg-primary-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                        NEW
                      </span>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-lg mb-1">{car.name}</h3>
                    <p className={`text-sm mb-3 ${darkMode ? 'text-dark-400' : 'text-dark-500'}`}>
                      {car.year} · {car.mileage?.toLocaleString()} km
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-lg font-bold text-primary-500">${car.priceUSD?.toLocaleString()}</p>
                        <p className={`text-xs ${darkMode ? 'text-dark-500' : 'text-dark-400'}`}>
                          GHS {car.priceGHS?.toLocaleString()}
                        </p>
                      </div>
                      <div className={`flex gap-1.5 ${darkMode ? 'text-dark-400' : 'text-dark-400'}`}>
                        <span className="text-xs flex items-center gap-1"><Fuel className="w-3 h-3" />{car.fuelType}</span>
                        <span className="text-xs flex items-center gap-1"><Settings className="w-3 h-3" />{car.transmission}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              to="/cars"
              className="inline-flex items-center gap-2 text-primary-500 hover:text-primary-400 font-semibold transition-all"
            >
              View All {activeTab} Cars <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Arrivals */}
      <section className={`py-16 ${darkMode ? 'bg-dark-900' : 'bg-dark-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-10"
          >
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-primary-500" />
                <span className="text-sm font-semibold text-primary-500 uppercase tracking-wider">Latest Arrivals</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold">Fresh From The Lot</h2>
            </div>
            <Link
              to="/cars"
              className="hidden sm:inline-flex items-center gap-2 text-primary-500 hover:text-primary-400 font-semibold"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {latestArrivals.slice(0, 4).map((car, index) => (
              <motion.div
                key={car.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={`/car/${car.id}`}
                  className={`group block rounded-2xl overflow-hidden transition-all car-card-shadow hover:-translate-y-1 ${
                    darkMode ? 'bg-dark-800 border border-dark-700' : 'bg-white'
                  }`}
                >
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={car.images[0]}
                      alt={car.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-2 right-2 bg-primary-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      NEW
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-sm mb-1">{car.name}</h3>
                    <p className={`text-xs mb-2 ${darkMode ? 'text-dark-400' : 'text-dark-500'}`}>{car.year}</p>
                    <p className="text-base font-bold text-primary-500">${car.priceUSD?.toLocaleString()}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Brands */}
      <section className={`py-16 ${darkMode ? 'bg-dark-950' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Popular <span className="text-gradient">Brands</span></h2>
            <p className={`text-lg ${darkMode ? 'text-dark-400' : 'text-dark-500'}`}>
              We stock the most sought-after automotive brands
            </p>
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {brands.slice(0, 10).map((brand, index) => (
              <motion.div
                key={brand.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  to={`/cars?brand=${brand.name}`}
                  className={`flex flex-col items-center gap-3 p-6 rounded-2xl transition-all ${
                    darkMode ? 'bg-dark-800 hover:bg-dark-700 border border-dark-700' : 'bg-dark-50 hover:bg-dark-100'
                  }`}
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center text-3xl">
                    🚗
                  </div>
                  <span className={`font-semibold text-sm ${darkMode ? 'text-dark-200' : 'text-dark-700'}`}>{brand.name}</span>
                  <span className={`text-xs ${darkMode ? 'text-dark-500' : 'text-dark-400'}`}>{brand.count} cars</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className={`py-20 ${darkMode ? 'bg-dark-900' : 'bg-dark-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose <span className="text-gradient">Global Drive Africa</span>
            </h2>
            <p className={`text-lg ${darkMode ? 'text-dark-400' : 'text-dark-500'}`}>
              We provide an unmatched car buying experience across Africa
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: 'Trusted Dealer', desc: 'Licensed and verified automotive dealer with years of experience.' },
              { icon: Truck, title: 'Import Expertise', desc: 'Seamless import process from Japan, USA, and Europe to Ghana.' },
              { icon: HeadphonesIcon, title: '24/7 Support', desc: 'Dedicated customer service team always ready to help.' },
              { icon: Car, title: 'Quality Guaranteed', desc: 'Every vehicle undergoes thorough inspection and certification.' },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`p-6 rounded-2xl transition-all car-card-shadow ${
                  darkMode ? 'bg-dark-800 border border-dark-700 hover:bg-dark-700' : 'bg-white hover:shadow-xl'
                }`}
              >
                <div className="w-14 h-14 bg-gradient-to-br from-primary-500/20 to-accent-500/20 rounded-xl flex items-center justify-center mb-4">
                  <item.icon className="w-7 h-7 text-primary-500" />
                </div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className={`text-sm ${darkMode ? 'text-dark-400' : 'text-dark-500'}`}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className={`py-20 ${darkMode ? 'bg-dark-950' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What Our <span className="text-gradient">Customers Say</span>
            </h2>
            <p className={`text-lg ${darkMode ? 'text-dark-400' : 'text-dark-500'}`}>
              Hear from our satisfied clients across Africa
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`p-6 rounded-2xl ${darkMode ? 'bg-dark-800 border border-dark-700' : 'bg-dark-50'}`}
              >
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < testimonial.rating ? 'text-gold-400 fill-gold-400' : darkMode ? 'text-dark-600' : 'text-dark-300'}`} />
                  ))}
                </div>
                <p className={`mb-4 italic ${darkMode ? 'text-dark-300' : 'text-dark-600'}`}>
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold">
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{testimonial.name}</p>
                    <p className={`text-xs ${darkMode ? 'text-dark-500' : 'text-dark-400'}`}>{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-20 relative overflow-hidden ${darkMode ? 'bg-dark-900' : 'bg-dark-900'}`}>
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Ready to Find Your <span className="text-gradient">Dream Car</span>?
            </h2>
            <p className="text-lg text-dark-300 mb-8 max-w-2xl mx-auto">
              Get in touch with our team today. We'll help you find, import, or sell the perfect vehicle.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/cars"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                Browse Inventory <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-white text-dark-900 px-8 py-4 rounded-xl font-semibold hover:bg-dark-100 transition-all"
              >
                Contact Dealer
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
