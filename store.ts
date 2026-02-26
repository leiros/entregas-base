
import { 
  collection, 
  getDocs, 
  setDoc, 
  doc, 
  updateDoc, 
  onSnapshot
} from "firebase/firestore";
import { db_firestore } from "./firebaseConfig";
import { Delivery, User, Apartment, Tower, DeliveryStatus, DashboardStats } from './types';

export interface DB {
  users: User[];
  deliveries: Delivery[];
  towers: Tower[];
  apartments: Apartment[];
}

// Inicializa os dados básicos no Firestore se estiver vazio
export const initializeFirestore = async (initialData: DB) => {
  try {
    console.log("Verificando conexão com Firestore...");
    const towersCol = collection(db_firestore, "towers");
    const snapshot = await getDocs(towersCol);
    
    if (snapshot.empty) {
      console.log("Firestore vazio. Inicializando com dados padrão...");
      
      // Salva Torres
      for (const tower of initialData.towers) {
        await setDoc(doc(db_firestore, "towers", tower.id), tower);
      }
      
      // Salva Usuários
      for (const user of initialData.users) {
        await setDoc(doc(db_firestore, "users", user.id), user);
      }
      
      // Salva Apartamentos (Lote)
      for (const apt of initialData.apartments) {
        await setDoc(doc(db_firestore, "apartments", apt.id), apt);
      }
      console.log("Inicialização concluída com sucesso!");
    } else {
      console.log("Firestore já contém dados.");
    }
  } catch (error: any) {
    console.error("Erro detalhado ao inicializar Firestore:", error);
    if (error.code === 'permission-denied') {
      console.error("ERRO DE PERMISSÃO: Verifique as regras do seu Firestore.");
    }
    throw error;
  }
};

export const fetchDBFromFirestore = async (): Promise<DB> => {
  try {
    const towers = (await getDocs(collection(db_firestore, "towers"))).docs.map(d => d.data() as Tower);
    const users = (await getDocs(collection(db_firestore, "users"))).docs.map(d => d.data() as User);
    const apartments = (await getDocs(collection(db_firestore, "apartments"))).docs.map(d => d.data() as Apartment);
    const deliveries = (await getDocs(collection(db_firestore, "deliveries"))).docs.map(d => d.data() as Delivery);
    
    return { towers, users, apartments, deliveries };
  } catch (error) {
    console.error("Erro ao buscar dados do Firestore:", error);
    throw error;
  }
};

// Escuta mudanças em tempo real nas encomendas
export const subscribeToDeliveries = (callback: (deliveries: Delivery[]) => void) => {
  return onSnapshot(collection(db_firestore, "deliveries"), (snapshot) => {
    const deliveries = snapshot.docs.map(d => d.data() as Delivery);
    callback(deliveries);
  });
};

export const saveDeliveryToFirestore = async (delivery: Delivery) => {
  await setDoc(doc(db_firestore, "deliveries", delivery.id), delivery);
};

export const updateDeliveryInFirestore = async (id: string, data: Partial<Delivery>) => {
  await updateDoc(doc(db_firestore, "deliveries", id), data);
};

export const saveUserToFirestore = async (user: User) => {
  await setDoc(doc(db_firestore, "users", user.id), user);
};

export const updateUserInFirestore = async (id: string, data: Partial<User>) => {
  await updateDoc(doc(db_firestore, "users", id), data);
};

export const saveApartmentToFirestore = async (apt: Apartment) => {
  await setDoc(doc(db_firestore, "apartments", apt.id), apt);
};

export const getDashboardStats = (deliveries: Delivery[]): DashboardStats => {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfWeek = startOfDay - (now.getDay() * 24 * 60 * 60 * 1000);

  const isToday = (dateStr: string) => new Date(dateStr).getTime() >= startOfDay;
  const isThisWeek = (dateStr: string) => new Date(dateStr).getTime() >= startOfWeek;

  return {
    receivedToday: deliveries.filter(d => isToday(d.receivedAtPortaria)).length,
    receivedWeek: deliveries.filter(d => isThisWeek(d.receivedAtPortaria)).length,
    retainedAdmin: deliveries.filter(d => d.status === DeliveryStatus.ADMINISTRACAO_ESPERA || d.status === DeliveryStatus.PENDENTE_RECOLHIMENTO).length,
    deliveredToday: deliveries.filter(d => d.deliveredAt && isToday(d.deliveredAt)).length,
    deliveredWeek: deliveries.filter(d => d.deliveredAt && isThisWeek(d.deliveredAt)).length,
  };
};
