
import React, { useState } from 'react';
import { Delivery, DeliveryStatus, User, UserRole } from '../types';

interface Props {
  db: any;
  user: User;
  onUpdateDeliveries: (deliveries: Delivery[]) => void;
}

const AdminSection: React.FC<Props> = ({ db, user, onUpdateDeliveries }) => {
  const [deliveryToConfirm, setDeliveryToConfirm] = useState<string | null>(null);
  const [recipientName, setRecipientName] = useState('');

  const pendingNotification = db.deliveries.filter((d: Delivery) => d.status === DeliveryStatus.ADMINISTRACAO_ESPERA);
  const pendingCollection = db.deliveries.filter((d: Delivery) => d.status === DeliveryStatus.PENDENTE_RECOLHIMENTO);

  const isReadOnly = user.role === UserRole.SINDICO;

  const notifyResident = (d: Delivery) => {
    if (isReadOnly) return;
    const apt = db.apartments.find((a: any) => a.id === d.apartmentId);
    const tower = db.towers.find((t: any) => t.id === d.towerId);
    
    // Simulate WhatsApp API Call
    const message = `Olá ${apt.residentName}, sua encomenda (${d.trackingCode}) chegou na administração do condomínio ${tower.name}! Por favor, retire no horário comercial.`;
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${apt.residentPhone}&text=${encodeURIComponent(message)}`;
    
    // In a real app, this would be a server-side API call. Here we open a window or simulate.
    console.log(`Enviando WhatsApp para ${apt.residentPhone}: ${message}`);
    
    const updated = db.deliveries.map((item: Delivery) => 
      item.id === d.id 
        ? { ...item, status: DeliveryStatus.PENDENTE_RECOLHIMENTO, notifiedAt: new Date().toISOString() } 
        : item
    );
    onUpdateDeliveries(updated);
    alert('Notificação enviada com sucesso (Simulado via WhatsApp)!');
    window.open(whatsappUrl, '_blank');
  };

  const handleConfirmDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deliveryToConfirm || !recipientName) return;

    const updated = db.deliveries.map((d: Delivery) => 
      d.id === deliveryToConfirm 
        ? { ...d, status: DeliveryStatus.ENTREGUE, deliveredAt: new Date().toISOString(), deliveredToName: recipientName } 
        : d
    );
    onUpdateDeliveries(updated);
    setDeliveryToConfirm(null);
    setRecipientName('');
    alert('Entrega finalizada com sucesso!');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Delivery Confirmation Modal */}
      {deliveryToConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md transform transition-all animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Confirmar Entrega</h3>
            <form onSubmit={handleConfirmDelivery} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Nome de quem está retirando</label>
                <input 
                  autoFocus
                  value={recipientName}
                  onChange={e => setRecipientName(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium"
                  placeholder="Nome completo do morador ou autorizado"
                  required
                />
              </div>
              <div className="flex gap-3 mt-8">
                <button 
                  type="button"
                  onClick={() => {
                    setDeliveryToConfirm(null);
                    setRecipientName('');
                  }}
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 font-bold text-gray-600 transition-all"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold shadow-lg shadow-green-600/20 transition-all"
                >
                  Finalizar Entrega
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Pending Notification */}
      <div className="bg-white rounded-xl shadow-lg border border-indigo-100 overflow-hidden">
        <div className="bg-indigo-600 px-6 py-4">
          <h2 className="text-lg font-bold text-white flex items-center">
            <span className="mr-2">📢</span> Aguardando Aviso ({pendingNotification.length})
          </h2>
        </div>
        <div className="p-4 space-y-4 max-h-[400px] overflow-y-auto">
          {pendingNotification.map((d: Delivery) => {
            const tower = db.towers.find((t: any) => t.id === d.towerId);
            const apt = db.apartments.find((a: any) => a.id === d.apartmentId);
            return (
              <div key={d.id} className="border border-gray-100 p-4 rounded-lg bg-indigo-50 flex justify-between items-center transform transition-all hover:scale-[1.02]">
                <div>
                  <div className="text-sm font-bold text-indigo-900">{d.trackingCode}</div>
                  <div className="text-xs text-indigo-700">{tower?.name} - Apt {apt?.number}</div>
                  <div className="text-[10px] text-indigo-400 mt-1 uppercase font-bold">Chegou na ADM: {new Date(d.receivedAtAdmin!).toLocaleTimeString()}</div>
                </div>
                {!isReadOnly && (
                  <button 
                    onClick={() => notifyResident(d)}
                    className="bg-green-500 hover:bg-green-600 text-white text-xs font-bold py-2 px-3 rounded shadow transition-colors flex items-center"
                  >
                    <span className="mr-1">💬</span> Avisar Morador
                  </button>
                )}
              </div>
            );
          })}
          {pendingNotification.length === 0 && <p className="text-center text-gray-400 py-10 italic">Tudo limpo por aqui.</p>}
        </div>
      </div>

      {/* Pending Collection */}
      <div className="bg-white rounded-xl shadow-lg border border-green-100 overflow-hidden">
        <div className="bg-green-600 px-6 py-4">
          <h2 className="text-lg font-bold text-white flex items-center">
            <span className="mr-2">📦</span> Pendente de Recolhimento ({pendingCollection.length})
          </h2>
        </div>
        <div className="p-4 space-y-4 max-h-[400px] overflow-y-auto">
          {pendingCollection.map((d: Delivery) => {
            const tower = db.towers.find((t: any) => t.id === d.towerId);
            const apt = db.apartments.find((a: any) => a.id === d.apartmentId);
            return (
              <div key={d.id} className="border border-gray-100 p-4 rounded-lg bg-green-50 flex justify-between items-center border-l-4 border-l-green-400">
                <div>
                  <div className="text-sm font-bold text-green-900">{d.trackingCode}</div>
                  <div className="text-xs text-green-700">{tower?.name} - Apt {apt?.number}</div>
                  <div className="text-[10px] text-green-500 mt-1 font-bold">Notificado em: {new Date(d.notifiedAt!).toLocaleString('pt-BR')}</div>
                </div>
                {!isReadOnly && (
                  <div className="flex flex-col space-y-2">
                    <button 
                      onClick={() => setDeliveryToConfirm(d.id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 px-4 rounded shadow transition-colors"
                    >
                      Entregar Agora
                    </button>
                  </div>
                )}
              </div>
            );
          })}
          {pendingCollection.length === 0 && <p className="text-center text-gray-400 py-10 italic">Ninguém aguardando retirada.</p>}
        </div>
      </div>
    </div>
  );
};

export default AdminSection;
