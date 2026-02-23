
import React from 'react';
import { DashboardStats } from '../types';

interface Props {
  stats: DashboardStats;
}

const DashboardCards: React.FC<Props> = ({ stats }) => {
  const cards = [
    { label: 'Recebidas na Semana', value: stats.receivedWeek, color: 'text-blue-600', icon: '📅' },
    { label: 'Recebidas Hoje', value: stats.receivedToday, color: 'text-green-600', icon: '📦' },
    { label: 'Retidas na Administração', value: stats.retainedAdmin, color: 'text-amber-600', icon: '🏢' },
    { label: 'Entregues Hoje', value: stats.deliveredToday, color: 'text-indigo-600', icon: '✅' },
    { label: 'Entregues na Semana', value: stats.deliveredWeek, color: 'text-emerald-600', icon: '🌟' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {cards.map((card, i) => (
        <div key={i} className="bg-white rounded-xl shadow-sm border border-blue-100 p-5 transform transition-all hover:-translate-y-1 hover:shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">{card.icon}</span>
            <span className={`text-3xl font-bold ${card.color}`}>{card.value}</span>
          </div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-tight">{card.label}</p>
        </div>
      ))}
    </div>
  );
};

export default DashboardCards;
