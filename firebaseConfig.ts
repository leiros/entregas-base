// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDNsDMCkcIB6EW_ZDKa_ucUxjyQHJ9peZI",
  authDomain: "entregasnatture.firebaseapp.com",
  projectId: "entregasnatture",
  storageBucket: "entregasnatture.firebasestorage.app",
  messagingSenderId: "13398196402",
  appId: "1:13398196402:web:84a585bbe02c551b5e49ab",
  measurementId: "G-27TZHM75KN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);



//import { initializeApp } from "firebase/app";
//import { getFirestore } from "firebase/firestore";

// ESTAS SÃO AS CONFIGURAÇÕES DO SEU PROJETO FIREBASE
// Você encontra isso no Console do Firebase > Configurações do Projeto
//const firebaseConfig = {
//  apiKey: "BNx7YwZMq_TDBpODZ4zhyOiOzmh9UqBsaMLGNHIew5kDcznN97rje7POYI-a1XiJeUQJyFAwsO3j0xY9dwfTgxM",
//  authDomain: "entregasnatture.firebaseapp.com",
//  projectId: "entregasnatture",
//  storageBucket: "entregasnatture.appspot.com",
//  messagingSenderId: "SEU_SENDER_ID",
//  appId: "SEU_APP_ID"
/};

//const app = initializeApp(firebaseConfig);

//if (firebaseConfig.apiKey === "SUA_API_KEY") {
//  console.error("⚠️ CONFIGURAÇÃO PENDENTE: Você ainda não substituiu 'SUA_API_KEY' no arquivo firebaseConfig.ts!");
//}

//export const db_firestore = getFirestore(app);
