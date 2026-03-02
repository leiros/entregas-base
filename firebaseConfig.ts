
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

/**
 * Configuração do Firebase
 * Para replicar o sistema, altere as variáveis no arquivo .env ou substitua os valores abaixo.
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDNsDMCkcIB6EW_ZDKa_ucUxjyQHJ9peZI",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "nattureentregas.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "nattureentregas",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "nattureentregas.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "13398196402",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:13398196402:web:84a585bbe02c551b5e49ab",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-27TZHM75KN"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Exporta o Firestore para uso no sistema
export const db_firestore = getFirestore(app);

// Opcional: Analytics
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
