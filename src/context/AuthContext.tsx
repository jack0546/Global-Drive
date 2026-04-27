import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import toast from 'react-hot-toast';

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  favorites: string[];
  photoURL?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => void;
  toggleFavorite: (carId: string) => void;
  isFavorite: (carId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const ADMIN_EMAIL = 'globaldrive.gh@gmail.com';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const docRef = doc(db, 'users', firebaseUser.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUser({
              id: firebaseUser.uid,
              name: data.name || '',
              email: firebaseUser.email || '',
              role: data.role || (firebaseUser.email === ADMIN_EMAIL ? 'admin' : 'user'),
              favorites: data.favorites || [],
              photoURL: data.photoURL || firebaseUser.photoURL || undefined,
            });
          } else {
            setUser({
              id: firebaseUser.uid,
              name: firebaseUser.displayName || 'User',
              email: firebaseUser.email || '',
              role: firebaseUser.email === ADMIN_EMAIL ? 'admin' : 'user',
              favorites: [],
              photoURL: firebaseUser.photoURL || undefined,
            });
          }
        } catch (error) {
          console.error("Error fetching user data from Firestore", error);
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return true;
    } catch (error: any) {
      console.error("Login Error:", error);
      let message = "Invalid email or password";
      
      if (error.code === 'auth/user-not-found') message = "No account found with this email";
      else if (error.code === 'auth/wrong-password') message = "Incorrect password";
      else if (error.code === 'auth/invalid-email') message = "Invalid email address format";
      else if (error.code === 'auth/too-many-requests') message = "Too many failed attempts. Please try again later";
      else if (error.code === 'auth/internal-error') message = "Authentication service error";
      
      toast.error(message);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      const role = email === ADMIN_EMAIL ? 'admin' : 'user';
      
      const newUser: AuthUser = {
        id: firebaseUser.uid,
        name,
        email,
        role,
        favorites: [],
        photoURL: '',
      };

      // Save user profile in Firestore
      try {
        await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
      } catch (dbError) {
        console.error("Firestore Save Error:", dbError);
        // Still proceed since Auth was successful
      }
      
      setUser(newUser);
      return true;
    } catch (error: any) {
      console.error("Register Error:", error);
      let message = "Registration failed. Please try again.";
      
      if (error.code === 'auth/email-already-in-use') message = "This email is already registered";
      else if (error.code === 'auth/weak-password') message = "Password should be at least 6 characters";
      else if (error.code === 'auth/invalid-email') message = "Invalid email format";
      
      toast.error(message);
      return false;
    }
  };

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;

      const docRef = doc(db, 'users', firebaseUser.uid);
      let docSnap;
      
      try {
        docSnap = await getDoc(docRef);
      } catch (e) {
        console.error("Firestore Get Error:", e);
      }

      if (!docSnap || !docSnap.exists()) {
        const newUser: AuthUser = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || 'Google User',
          email: firebaseUser.email || '',
          role: firebaseUser.email === ADMIN_EMAIL ? 'admin' : 'user',
          favorites: [],
          photoURL: firebaseUser.photoURL || '',
        };
        try {
          await setDoc(docRef, newUser);
        } catch (e) {
          console.error("Firestore Create Error:", e);
        }
        setUser(newUser);
      }
      return true;
    } catch (error: any) {
      console.error("Google Login Error:", error);
      if (error.code !== 'auth/popup-closed-by-user') {
        toast.error("Failed to sign in with Google");
      }
      return false;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  const toggleFavorite = async (carId: string) => {
    if (!user) {
      toast.error("Please login to save favorites");
      return;
    }
    
    try {
      const newFavorites = user.favorites.includes(carId)
        ? user.favorites.filter(f => f !== carId)
        : [...user.favorites, carId];
        
      const updatedUser = { ...user, favorites: newFavorites };
      setUser(updatedUser);
      
      const userRef = doc(db, 'users', user.id);
      await updateDoc(userRef, {
        favorites: newFavorites
      });
    } catch (error) {
      console.error("Error updating favorites:", error);
      toast.error("Could not update favorites");
    }
  };

  const isFavorite = (carId: string) => {
    return user?.favorites.includes(carId) || false;
  };

  return (
    <AuthContext.Provider value={{ user, login, register, loginWithGoogle, logout, toggleFavorite, isFavorite }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
