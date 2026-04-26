import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBclY5zCvMmRbca3xP7cOYSRcmxjRa7wYA",
  authDomain: "donald-laptops.firebaseapp.com",
  projectId: "donald-laptops",
  storageBucket: "donald-laptops.firebasestorage.app",
  messagingSenderId: "856741060528",
  appId: "1:856741060528:web:bfbb8dcb66122fa3378075",
  measurementId: "G-5PHKYG4ETH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;
const db = getFirestore(app);
const auth = getAuth(app);

export { app, analytics, db, auth };
