import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { X, Plus, Fuel, Settings, Gauge, Calendar, Shield, MapPin } from 'lucide-react';
import { cars } from '../data/cars';

interface CompareProps {
  darkMode: boolean;
}

export default function Compare({ darkMode }: CompareProps) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleCar = (id: string) => {
    if (selected.includes(id)) {
      setSelected(prev => prev.filter(s => s !== id));
    } else if (selected.length < 3) {
      setSelected(prev => [...prev, id]);
    }
  };

  const compareCars = cars.filter(c => selected.includes(c.id));

  const specs = [
    { key: 'year', label: 'Year', icon: Calendar },
    { key: 'mileage', label: 'Mileage', icon: Gauge, format: (v: number) => `${v?.toLocaleString()} km` },
    { key: 'fuelType', label: 'Fuel Type', icon: Fuel },
    { key: 'transmission', label: 'Transmission', icon: Settings },
    { key: 'engineCapacity', label: 'Engine', icon: Shield },
    { key: 'condition', label: 'Condition', icon: Shield },
    { key: 'bodyType', label: 'Body Type', icon: Shield },
    { key: 'location', label: 'Location', icon: MapPin },
  ];

  return (
    <div className={`min-h-screen pt-20 ${darkMode ? 'bg-dark-950 text-white' : 'bg-gray-50 text-dark-900'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Compare <span className="text-gradient">Vehicles</span>
          </h1>
          <p className={`max-w-2xl mx-auto ${darkMode ? 'text-dark-400' : 'text-dark-500'}`}>
            Select up to 3 vehicles to compare their specifications side by side
          </p>
        </div>

        {/* Car Selection */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[0, 1, 2].map(i => (
            <div key={i} className={`relative rounded-2xl border-2 border-dashed p-4 min-h-[200px] flex items-center justify-center transition-all ${
              selected[i] ? (darkMode ? 'border-primary-500 bg-dark-800' : 'border-primary-500 bg-white') : (darkMode ? 'border-dark-700 bg-dark-900/50' : 'border-dark-200 bg-white/50')
            }`}>
              {selected[i] ? (
                <div className="w-full">
                  <button onClick={() => setSelected(prev => prev.filter((_, idx) => idx !== i))}
                    className="absolute top-2 right-2 p-1 rounded-full bg-red-500 text-white hover:bg-red-600 transition-all">
                    <X className="w-4 h-4" />
                  </button>
                  <img src={cars.find(c => c.id === selected[i])?.images[0]} alt="" className="w-full h-32 object-cover rounded-xl mb-3" />
                  <p className="font-semibold text-sm text-center">{cars.find(c => c.id === selected[i])?.name}</p>
                  <p className="text-primary-500 font-bold text-sm text-center">${cars.find(c => c.id === selected[i])?.priceUSD?.toLocaleString()}</p>
                </div>
              ) : (
                <div className="text-center">
                  <Plus className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p className="text-sm opacity-50">Select Car {i + 1}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Car Selector */}
        <div className={`mb-8 p-4 rounded-2xl ${darkMode ? 'bg-dark-800 border border-dark-700' : 'bg-white shadow-sm'}`}>
          <h3 className="font-semibold mb-3">Choose cars to compare:</h3>
          <div className="flex flex-wrap gap-2">
            {cars.filter(c => !selected.includes(c.id)).slice(0, 10).map(car => (
              <button key={car.id} onClick={() => toggleCar(car.id)}
                disabled={selected.length >= 3}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  darkMode ? 'bg-dark-700 hover:bg-dark-600 text-dark-200' : 'bg-dark-100 hover:bg-dark-200 text-dark-700'
                } disabled:opacity-30`}>
                {car.name}
              </button>
            ))}
          </div>
        </div>

        {/* Comparison Table */}
        {compareCars.length >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-2xl overflow-hidden ${darkMode ? 'bg-dark-800 border border-dark-700' : 'bg-white shadow-lg'}`}
          >
            <table className="w-full">
              <thead>
                <tr className={darkMode ? 'border-b border-dark-700' : 'border-b border-dark-200'}>
                  <th className="p-4 text-left text-sm font-medium w-1/4">Specifications</th>
                  {compareCars.map(car => (
                    <th key={car.id} className="p-4 text-center">
                      <Link to={`/car/${car.id}`} className="hover:text-primary-500 transition-colors">
                        <img src={car.images[0]} alt={car.name} className="w-full h-24 object-cover rounded-xl mb-2" />
                        <p className="font-semibold text-sm">{car.name}</p>
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className={darkMode ? 'border-b border-dark-700' : 'border-b border-dark-200'}>
                  <td className="p-4 text-sm font-medium">Price (USD)</td>
                  {compareCars.map(car => (
                    <td key={car.id} className="p-4 text-center text-primary-500 font-bold">${car.priceUSD?.toLocaleString()}</td>
                  ))}
                </tr>
                <tr className={darkMode ? 'border-b border-dark-700' : 'border-b border-dark-200'}>
                  <td className="p-4 text-sm font-medium">Price (GHS)</td>
                  {compareCars.map(car => (
                    <td key={car.id} className="p-4 text-center font-semibold">GHS {car.priceGHS?.toLocaleString()}</td>
                  ))}
                </tr>
                {specs.map(spec => (
                  <tr key={spec.key} className={darkMode ? 'border-b border-dark-700' : 'border-b border-dark-200'}>
                    <td className="p-4 text-sm font-medium flex items-center gap-2">
                      <spec.icon className="w-4 h-4 text-primary-500" />
                      {spec.label}
                    </td>
                    {compareCars.map(car => {
                      const value = (car as any)[spec.key];
                      return (
                        <td key={car.id} className={`p-4 text-center text-sm ${darkMode ? 'text-dark-300' : 'text-dark-600'}`}>
                          {spec.format ? spec.format(value) : value}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}

        {compareCars.length < 2 && (
          <div className="text-center py-12">
            <p className={`text-lg ${darkMode ? 'text-dark-400' : 'text-dark-500'}`}>
              Select at least 2 cars to compare
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
