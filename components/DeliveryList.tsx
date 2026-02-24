
import React, { useState } from 'react';
import { Delivery, DeliveryStatus, Tower, Apartment } from '../types';
import { Search, Filter, Package, CheckCircle2, Clock, Truck } from 'lucide-react';

interface Props {
  deliveries: Delivery[];
  towers: Tower[];
  apartments: Apartment[];
}

const DeliveryList: React.FC<Props> = ({ deliveries, towers, apartments }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<DeliveryStatus | ''>('');

  const filteredDeliveries = deliveries.filter(d => {
    const apt = apartments.find(a => a.id === d.apartmentId);
    const matchesSearch = d.trackingCode.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         apt?.residentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         apt?.number.includes(searchTerm);
    const matchesStatus = statusFilter ? d.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: DeliveryStatus) => {
    switch (status) {
      case DeliveryStatus.PORTARIA:
        return <span className="flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-wider"><Truck className="w-3 h-3 mr-1" /> Portaria</span>;
      case DeliveryStatus.ADMINISTRACAO_ESPERA:
        return <span className="flex items-center px-2 py-1 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-wider"><Clock className="w-3 h-3 mr-1" /> Aguardando ADM</span>;
      case DeliveryStatus.PENDENTE_RECOLHIMENTO:
        return <span className="flex items-center px-2 py-1 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold uppercase tracking-wider"><Package className="w-3 h-3 mr-1" /> Para Retirada</span>;
      case DeliveryStatus.ENTREGUE:
        return <span className="flex items-center px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider"><CheckCircle2 className="w-3 h-3 mr-1" /> Entregue</span>;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-gray-800">Histórico de Encomendas</h2>
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text"
                placeholder="Buscar por rastreio, morador ou apt..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none w-full md:w-80 transition-all"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as DeliveryStatus | '')}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white transition-all appearance-none min-w-[180px]"
              >
                <option value="">Todos os Status</option>
                <option value={DeliveryStatus.PORTARIA}>Na Portaria</option>
                <option value={DeliveryStatus.ADMINISTRACAO_ESPERA}>Na Administração</option>
                <option value={DeliveryStatus.PENDENTE_RECOLHIMENTO}>Pendente Retirada</option>
                <option value={DeliveryStatus.ENTREGUE}>Entregues</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left bg-gray-50/50">
              <th className="px-6 py-4 font-bold text-xs text-gray-400 uppercase tracking-wider">Encomenda</th>
              <th className="px-6 py-4 font-bold text-xs text-gray-400 uppercase tracking-wider">Destinatário</th>
              <th className="px-6 py-4 font-bold text-xs text-gray-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 font-bold text-xs text-gray-400 uppercase tracking-wider">Datas</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredDeliveries.map(d => {
              const tower = towers.find(t => t.id === d.towerId);
              const apt = apartments.find(a => a.id === d.apartmentId);
              return (
                <tr key={d.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-mono font-bold text-blue-900">{d.trackingCode}</div>
                    <div className="text-[10px] text-gray-400 uppercase font-bold mt-1">ID: {d.id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-800">{apt?.residentName}</div>
                    <div className="text-xs text-gray-500">{tower?.name} - Apt {apt?.number}</div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(d.status)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="text-[10px] flex items-center text-gray-500">
                        <span className="w-16 font-bold uppercase">Recebido:</span>
                        {new Date(d.receivedAtPortaria).toLocaleString('pt-BR')}
                      </div>
                      {d.deliveredAt && (
                        <>
                          <div className="text-[10px] flex items-center text-emerald-600">
                            <span className="w-16 font-bold uppercase">Entregue:</span>
                            {new Date(d.deliveredAt).toLocaleString('pt-BR')}
                          </div>
                          {d.deliveredToName && (
                            <div className="text-[10px] flex items-center text-emerald-700 font-bold">
                              <span className="w-16 font-bold uppercase">Retirado:</span>
                              {d.deliveredToName}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
            {filteredDeliveries.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-gray-400 italic">Nenhuma encomenda encontrada com os filtros aplicados.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DeliveryList;
