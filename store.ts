
import { Delivery, User, Apartment, Tower, DeliveryStatus, UserRole, DashboardStats } from './types';
import { TOWERS, generateApartments, INITIAL_USERS } from './mockData';

const DB_KEY = 'entregas_app_db';

interface DB {
  users: User[];
  deliveries: Delivery[];
  towers: Tower[];
  apartments: Apartment[];
}

const initializeDB = (): DB => {
  const saved = localStorage.getItem(DB_KEY);
  if (saved) return JSON.parse(saved);

  const initialDB: DB = {
    users: INITIAL_USERS,
    deliveries: [],
    towers: TOWERS,
    apartments: generateApartments()
  };
  localStorage.setItem(DB_KEY, JSON.stringify(initialDB));
  return initialDB;
};

export const getDB = () => initializeDB();

export const saveDB = (db: DB) => {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
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
