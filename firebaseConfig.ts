
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Configuração do Firebase fornecida pelo usuário
const firebaseConfig = {
  apiKey: "AIzaSyDNsDMCkcIB6EW_ZDKa_ucUxjyQHJ9peZI", // ATENÇÃO: Verifique se a apiKey mudou no novo projeto!
  authDomain: "nattureentregas.firebaseapp.com",
  projectId: "nattureentregas",
  storageBucket: "nattureentregas.firebasestorage.app",
  messagingSenderId: "13398196402", // ATENÇÃO: Verifique se mudou!
  appId: "1:13398196402:web:84a585bbe02c551b5e49ab", // ATENÇÃO: Verifique se mudou!
  measurementId: "G-27TZHM75KN"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Exporta o Firestore para uso no sistema
export const db_firestore = getFirestore(app);

// Opcional: Analytics
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
