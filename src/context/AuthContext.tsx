import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  favorites: string[];
}

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  toggleFavorite: (carId: string) => void;
  isFavorite: (carId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const ADMIN_EMAIL = 'admin@globaldriveafrica.com';
const ADMIN_PASSWORD = 'admin123';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('gda_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {}
    }
  }, []);

  const login = async (email: string, password: string) => {
    // Mock authentication
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const adminUser: AuthUser = {
        id: 'admin-1',
        name: 'Admin',
        email: ADMIN_EMAIL,
        role: 'admin',
        favorites: [],
      };
      setUser(adminUser);
      localStorage.setItem('gda_user', JSON.stringify(adminUser));
      return true;
    }

    // Check registered users
    const users = JSON.parse(localStorage.getItem('gda_users') || '[]');
    const found = users.find((u: any) => u.email === email && u.password === password);
    if (found) {
      const authUser: AuthUser = {
        id: found.id,
        name: found.name,
        email: found.email,
        role: 'user',
        favorites: found.favorites || [],
      };
      setUser(authUser);
      localStorage.setItem('gda_user', JSON.stringify(authUser));
      return true;
    }
    return false;
  };

  const register = async (name: string, email: string, password: string) => {
    const users = JSON.parse(localStorage.getItem('gda_users') || '[]');
    if (users.some((u: any) => u.email === email)) return false;

    const newUser = {
      id: 'user-' + Date.now(),
      name,
      email,
      password,
      role: 'user' as const,
      favorites: [],
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    localStorage.setItem('gda_users', JSON.stringify(users));

    const authUser: AuthUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: 'user',
      favorites: [],
    };
    setUser(authUser);
    localStorage.setItem('gda_user', JSON.stringify(authUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('gda_user');
  };

  const toggleFavorite = (carId: string) => {
    if (!user) return;
    const updated = { ...user };
    if (updated.favorites.includes(carId)) {
      updated.favorites = updated.favorites.filter(f => f !== carId);
    } else {
      updated.favorites = [...updated.favorites, carId];
    }
    setUser(updated);
    localStorage.setItem('gda_user', JSON.stringify(updated));

    // Also update in users list
    const users = JSON.parse(localStorage.getItem('gda_users') || '[]');
    const idx = users.findIndex((u: any) => u.id === user.id);
    if (idx !== -1) {
      users[idx].favorites = updated.favorites;
      localStorage.setItem('gda_users', JSON.stringify(users));
    }
  };

  const isFavorite = (carId: string) => {
    return user?.favorites.includes(carId) || false;
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, toggleFavorite, isFavorite }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
