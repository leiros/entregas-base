
import React, { useState } from 'react';
import { Delivery, DeliveryStatus, User, UserRole } from '../types';

interface Props {
  db: any;
  user: User;
  onUpdateDeliveries: (deliveries: Delivery[]) => void;
}

const PortariaSection: React.FC<Props> = ({ db, user, onUpdateDeliveries }) => {
  const [trackingCode, setTrackingCode] = useState('');
  const [selectedTowerId, setSelectedTowerId] = useState('');
  const [selectedAptId, setSelectedAptId] = useState('');

  const isReadOnly = user.role === UserRole.SINDICO;

  const handleReceive = (e: React.FormEvent) => {
    e.preventDefault();
    if (isReadOnly) return;
    if (!trackingCode || !selectedAptId) return alert('Preencha todos os campos!');

    const newDelivery: Delivery = {
      id: Math.random().toString(36).substr(2, 9),
      trackingCode,
      status: DeliveryStatus.PORTARIA,
      towerId: selectedTowerId,
      apartmentId: selectedAptId,
      receivedAtPortaria: new Date().toISOString(),
      receivedByPortariaName: user.name,
    };

    onUpdateDeliveries([newDelivery, ...db.deliveries]);
    setTrackingCode('');
    setSelectedAptId('');
    alert('Encomenda recebida na Portaria!');
  };

  const moveDeliveriesToAdmin = () => {
    const toForward = db.deliveries.filter((d: Delivery) => d.status === DeliveryStatus.PORTARIA);
    if (toForward.length === 0) return alert('Nenhuma encomenda pendente na portaria.');
    
    const updated = db.deliveries.map((d: Delivery) => 
      d.status === DeliveryStatus.PORTARIA 
        ? { ...d, status: DeliveryStatus.ADMINISTRACAO_ESPERA, receivedAtAdmin: new Date().toISOString(), receivedByAdminName: 'Portaria Lote' } 
        : d
    );
    onUpdateDeliveries(updated);
    alert(`${toForward.length} encomendas encaminhadas para a Administração!`);
  };

  const deliverDirectly = (id: string) => {
    const recipient = prompt("Nome de quem está retirando:");
    if (!recipient) return;

    const updated = db.deliveries.map((d: Delivery) => 
      d.id === id 
        ? { ...d, status: DeliveryStatus.ENTREGUE, deliveredAt: new Date().toISOString(), deliveredToName: recipient } 
        : d
    );
    onUpdateDeliveries(updated);
  };

  const portariaPending = db.deliveries.filter((d: Delivery) => d.status === DeliveryStatus.PORTARIA);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-blue-200">
        <div className="bg-blue-600 px-6 py-4 flex justify-between items-center">
          <h2 className="text-lg font-bold text-white flex items-center">
            <span className="mr-2">🏪</span> Portaria: Recebimento de Encomendas
          </h2>
          {!isReadOnly && (
            <button 
              onClick={moveDeliveriesToAdmin}
              className="bg-white text-blue-600 hover:bg-blue-50 text-xs font-bold py-2 px-4 rounded-full shadow-sm transition-all"
            >
              Encaminhar Todas para ADM
            </button>
          )}
        </div>
        
        {!isReadOnly ? (
          <form onSubmit={handleReceive} className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Cód. Rastreio / Barras</label>
              <input 
                value={trackingCode}
                onChange={(e) => setTrackingCode(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 outline-none"
                placeholder="Ex: BR123456789"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Torre</label>
              <select 
                value={selectedTowerId}
                onChange={(e) => {
                  setSelectedTowerId(e.target.value);
                  setSelectedAptId('');
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 outline-none"
              >
                <option value="">Selecione a Torre</option>
                {db.towers.map((t: any) => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Apartamento</label>
              <select 
                value={selectedAptId}
                disabled={!selectedTowerId}
                onChange={(e) => setSelectedAptId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 outline-none disabled:bg-gray-50"
              >
                <option value="">Selecione o Apt</option>
                {db.apartments.filter((a: any) => a.towerId === selectedTowerId).map((a: any) => (
                  <option key={a.id} value={a.id}>{a.number}</option>
                ))}
              </select>
            </div>
            <button 
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-all shadow-md"
            >
              Registrar Entrada
            </button>
          </form>
        ) : (
          <div className="p-6 text-center text-gray-500 italic">
            Visualização de leitura para o Síndico.
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <div className="px-6 py-3 border-b border-gray-100 bg-gray-50">
          <h3 className="text-sm font-bold text-gray-700">Aguardando Encaminhamento ({portariaPending.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Data/Hora</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Cód. Rastreio</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Localização</th>
                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase">Ação</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {portariaPending.map((d: Delivery) => {
                const tower = db.towers.find((t: any) => t.id === d.towerId);
                const apt = db.apartments.find((a: any) => a.id === d.apartmentId);
                return (
                  <tr key={d.id} className="hover:bg-blue-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-600">
                      {new Date(d.receivedAtPortaria).toLocaleString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono font-bold text-blue-800">
                      {d.trackingCode}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs">
                      <span className="font-bold text-gray-800">{tower?.name}</span> - Apt {apt?.number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-xs">
                      {!isReadOnly && (
                        <button 
                          onClick={() => deliverDirectly(d.id)}
                          className="text-indigo-600 hover:text-indigo-900 font-bold underline"
                        >
                          Entregar ao Morador
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
              {portariaPending.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-400 italic">Sem encomendas pendentes na portaria.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PortariaSection;
