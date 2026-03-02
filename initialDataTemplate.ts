
import { Tower, Apartment, User, UserRole } from './types';

/**
 * TEMPLATE DE DADOS INICIAIS
 * 
 * Para replicar o sistema para um novo condomínio:
 * 1. Preencha as Torres abaixo.
 * 2. Preencha os Apartamentos (ou use a função geradora).
 * 3. Defina os usuários iniciais.
 */

export const NEW_CONDO_TOWERS: Tower[] = [
  { id: 't1', name: 'Torre 1' },
  { id: 't2', name: 'Torre 2' },
];

export const NEW_CONDO_USERS: User[] = [
  { id: 'u1', username: 'master', password: '123456', role: UserRole.MASTER, name: 'Suporte Master', active: true },
  { id: 'u2', username: 'admin', password: '123456', role: UserRole.ADMIN, name: 'Administração', active: true },
  { id: 'u3', username: 'portaria', password: '123456', role: UserRole.PORTARIA, name: 'Portaria', active: true },
];

/**
 * Função exemplo para gerar apartamentos em massa
 */
export const generateCustomApartments = (towerIds: string[], floors: number, unitsPerFloor: number): Apartment[] => {
  const apts: Apartment[] = [];
  towerIds.forEach(tId => {
    for (let floor = 1; floor <= floors; floor++) {
      for (let unit = 1; unit <= unitsPerFloor; unit++) {
        const aptNum = `${floor}${unit.toString().padStart(2, '0')}`;
        apts.push({
          id: `${tId}-${aptNum}`,
          towerId: tId,
          number: aptNum,
          residentName: `Morador Apt ${aptNum}`,
          residentPhone: "5511900000000"
        });
      }
    }
  });
  return apts;
};
