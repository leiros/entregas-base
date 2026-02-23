
import { Tower, Apartment, User, UserRole } from './types';

export const TOWERS: Tower[] = [
  { id: 't1', name: 'Torre A - Ipê' },
  { id: 't2', name: 'Torre B - Jatobá' },
  { id: 't3', name: 'Torre C - Aroeira' },
  { id: 't4', name: 'Torre D - Algaroba' },
  { id: 't5', name: 'Torre E - Jacarandá' },
  { id: 't6', name: 'Torre F - Imbúia' },
];

export const generateApartments = (): Apartment[] => {
  const apts: Apartment[] = [];
  TOWERS.forEach(t => {
    for (let floor = 1; floor <= 20; floor++) {
      for (let unit = 1; unit <= 4; unit++) {
        const aptNum = `${floor}${unit.toString().padStart(2, '0')}`;
        apts.push({
          id: `${t.id}-${aptNum}`,
          towerId: t.id,
          number: aptNum,
          residentName: `Morador ${aptNum} ${t.name.split(' - ')[1]}`,
          residentPhone: `551199999${Math.floor(Math.random() * 9000) + 1000}`
        });
      }
    }
  });
  return apts;
};

export const INITIAL_USERS: User[] = [
  { id: 'u1', username: 'master', password: '123456', role: UserRole.MASTER, name: 'Suporte Master', active: true },
  { id: 'u2', username: 'admin', password: '123456', role: UserRole.ADMIN, name: 'Administração Geral', active: true },
  { id: 'u3', username: 'portaria', password: '123456', role: UserRole.PORTARIA, name: 'Portaria Principal', active: true },
  { id: 'u4', username: 'sindico', password: '123456', role: UserRole.SINDICO, name: 'Síndico Geral', active: true }
];
