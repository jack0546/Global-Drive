export interface Car {
  id: string;
  brand: string;
  name: string;
  model: string;
  year: number;
  mileage: number;
  fuelType: 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid';
  transmission: 'Automatic' | 'Manual' | 'CVT';
  engineCapacity: string;
  condition: 'New' | 'Used' | 'Foreign Used';
  bodyType: string;
  priceGHS: number;
  priceUSD: number;
  images: string[];
  interiorImages: string[];
  exteriorImages: string[];
  engineImages: string[];
  partsImages: { url: string; name: string; price: number; available: boolean }[];
  description: string;
  importAvailable: boolean;
  location: string;
  featured: boolean;
  latestArrival: boolean;
  sold: boolean;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  favorites: string[];
  createdAt: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: 'inquiry' | 'test-drive' | 'import' | 'general';
  carName?: string;
  message: string;
  createdAt: string;
}

export interface Booking {
  id: string;
  userId: string;
  carId: string;
  type: 'test-drive' | 'purchase';
  date: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  avatar: string;
  role: string;
  content: string;
  rating: number;
}

export interface Brand {
  id: string;
  name: string;
  logo: string;
  count: number;
}

export const BRANDS = [
  'Toyota', 'Honda', 'Mercedes-Benz', 'BMW', 'Lexus',
  'Nissan', 'Hyundai', 'Kia', 'Ford', 'Others'
] as const;

export const BODY_TYPES = [
  'SUV', 'Sedan', 'Coupe', 'Hatchback', 'Convertible',
  'Pickup', 'Van', 'Wagon', 'Truck'
] as const;

export const FUEL_TYPES = ['Petrol', 'Diesel', 'Electric', 'Hybrid'] as const;
export const TRANSMISSIONS = ['Automatic', 'Manual', 'CVT'] as const;
export const CONDITIONS = ['New', 'Used', 'Foreign Used'] as const;

export interface FilterState {
  brand: string;
  minPrice: number;
  maxPrice: number;
  minYear: number;
  maxYear: number;
  transmission: string;
  fuelType: string;
  condition: string;
  bodyType: string;
  search: string;
}
