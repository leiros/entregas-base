
export enum UserRole {
  MASTER = 'MASTER',
  ADMIN = 'ADMIN',
  PORTARIA = 'PORTARIA',
  SINDICO = 'SINDICO'
}

export enum DeliveryStatus {
  PORTARIA = 'PORTARIA',
  ADMINISTRACAO_ESPERA = 'ADMINISTRACAO_ESPERA',
  PENDENTE_RECOLHIMENTO = 'PENDENTE_RECOLHIMENTO',
  ENTREGUE = 'ENTREGUE'
}

export interface User {
  id: string;
  username: string;
  password?: string;
  role: UserRole;
  name: string;
  active: boolean;
}

export interface Tower {
  id: string;
  name: string;
}

export interface Apartment {
  id: string;
  towerId: string;
  number: string;
  residentName: string;
  residentPhone: string;
}

export interface Delivery {
  id: string;
  trackingCode: string;
  status: DeliveryStatus;
  towerId: string;
  apartmentId: string;
  receivedAtPortaria: string; // ISO Date
  receivedByPortariaName: string;
  receivedAtAdmin?: string;
  receivedByAdminName?: string;
  notifiedAt?: string;
  deliveredAt?: string;
  deliveredToName?: string;
}

export interface DashboardStats {
  receivedWeek: number;
  receivedToday: number;
  retainedAdmin: number;
  deliveredToday: number;
  deliveredWeek: number;
}

export enum Section {
  DASHBOARD = 'DASHBOARD',
  PORTARIA = 'PORTARIA',
  ADMINISTRACAO = 'ADMINISTRACAO',
  ENCOMENDAS = 'ENCOMENDAS',
  MORADORES = 'MORADORES',
  USUARIOS = 'USUARIOS'
}
