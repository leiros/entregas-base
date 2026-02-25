
import { Delivery, User, Apartment, Tower, DeliveryStatus, DashboardStats } from './types';

export interface DB {
  users: User[];
  deliveries: Delivery[];
  towers: Tower[];
  apartments: Apartment[];
}

export const fetchDB = async (): Promise<DB> => {
  const response = await fetch('/api/db');
  if (!response.ok) throw new Error('Failed to fetch DB');
  return response.json();
};

export const saveDeliveries = async (deliveries: Delivery[]) => {
  const response = await fetch('/api/deliveries', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(deliveries)
  });
  return response.json();
};

export const saveUsers = async (users: User[]) => {
  const response = await fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(users)
  });
  return response.json();
};

export const saveApartments = async (apts: Apartment[]) => {
  const response = await fetch('/api/apartments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(apts)
  });
  return response.json();
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
