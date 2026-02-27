
import React, { useState } from 'react';
import { Apartment, Tower, UserRole } from '../types';
import { Search, Edit2, Phone } from 'lucide-react';

interface Props {
  towers: Tower[];
  apartments: Apartment[];
  onUpdateApartments: (apts: Apartment[]) => void;
  currentUser: any;
}

const ResidentManagement: React.FC<Props> = ({ towers, apartments, onUpdateApartments, currentUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTower, setSelectedTower] = useState('');
  const [editingApt, setEditingApt] = useState<Apartment | null>(null);

  const isReadOnly = currentUser?.role === 'SINDICO';

  const filteredApts = apartments.filter(apt => {
    const matchesSearch = apt.residentName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         apt.number.includes(searchTerm);
    const matchesTower = selectedTower ? apt.towerId === selectedTower : true;
    return matchesSearch && matchesTower;
  });

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingApt) return;

    const updated = apartments.map(a => a.id === editingApt.id ? editingApt : a);
    onUpdateApartments(updated);
    setEditingApt(null);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h2 className="text-xl font-bold text-gray-800">Gestão de Moradores</h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text"
                placeholder="Buscar morador ou apt..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none w-full sm:w-64 transition-all text-sm"
              />
            </div>
            <select 
              value={selectedTower}
              onChange={(e) => setSelectedTower(e.target.value)}
              className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none bg-white transition-all text-sm"
            >
              <option value="">Todas as Torres</option>
              {towers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-gray-100">
                <th className="pb-4 font-bold text-xs text-gray-400 uppercase tracking-wider">Torre / Apt</th>
                <th className="pb-4 font-bold text-xs text-gray-400 uppercase tracking-wider">Morador Responsável</th>
                <th className="pb-4 font-bold text-xs text-gray-400 uppercase tracking-wider">Contato</th>
                <th className="pb-4 font-bold text-xs text-gray-400 uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredApts.slice(0, 50).map(apt => {
                const tower = towers.find(t => t.id === apt.towerId);
                return (
                  <tr key={apt.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="py-4">
                      <div className="font-bold text-gray-800">{tower?.name.split(' - ')[0]}</div>
                      <div className="text-sm text-gray-500">Apt {apt.number}</div>
                    </td>
                    <td className="py-4">
                      <div className="font-medium text-gray-700">{apt.residentName}</div>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <Phone className="w-3 h-3 mr-2" />
                        {apt.residentPhone}
                      </div>
                    </td>
                    <td className="py-4 text-right">
                      {!isReadOnly && (
                        <button 
                          onClick={() => setEditingApt(apt)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredApts.length === 0 && (
            <div className="py-12 text-center text-gray-400 italic">Nenhum morador encontrado.</div>
          )}
          {filteredApts.length > 50 && (
            <div className="py-4 text-center text-xs text-gray-400">Mostrando os primeiros 50 resultados...</div>
          )}
        </div>
      </div>

      {editingApt && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md transform transition-all animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Editar Morador</h3>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nome do Responsável</label>
                <input 
                  value={editingApt.residentName}
                  onChange={e => setEditingApt({...editingApt, residentName: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Telefone (WhatsApp)</label>
                <input 
                  value={editingApt.residentPhone}
                  onChange={e => setEditingApt({...editingApt, residentPhone: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>
              <div className="flex gap-3 mt-8">
                <button 
                  type="button"
                  onClick={() => setEditingApt(null)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 font-bold text-gray-600 transition-all"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-600/20 transition-all"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResidentManagement;
