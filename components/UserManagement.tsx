
import React, { useState } from 'react';
import { User, UserRole } from '../types';

interface Props {
  users: User[];
  onUpdateUsers: (users: User[]) => void;
  currentUser: User;
}

const UserManagement: React.FC<Props> = ({ users, onUpdateUsers, currentUser }) => {
  const [newUserName, setNewUserName] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>(UserRole.PORTARIA);
  const [newUserLogin, setNewUserLogin] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('123456');

  const isReadOnly = currentUser?.role === UserRole.SINDICO;

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (isReadOnly) return;
    if (!newUserName || !newUserLogin) return;
    
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: newUserName,
      role: newUserRole,
      username: newUserLogin,
      password: newUserPassword,
      active: true
    };

    onUpdateUsers([...users, newUser]);
    setNewUserName('');
    setNewUserLogin('');
    setNewUserPassword('123456');
  };

  const toggleStatus = (id: string) => {
    const updated = users.map(u => u.id === id ? { ...u, active: !u.active } : u);
    onUpdateUsers(updated);
  };

  const resetPassword = (username: string) => {
    alert(`Senha do usuário '${username}' resetada para: 123456 (Simulado)`);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-red-100 overflow-hidden">
      <div className="bg-red-700 px-6 py-4">
        <h2 className="text-lg font-bold text-white flex items-center">
          <span className="mr-2">🛡️</span> Painel Master: Controle de Acessos
        </h2>
      </div>
      
      <div className="p-4 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create User Form */}
        {!isReadOnly && (
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <h3 className="font-bold text-gray-700 mb-4 border-b border-gray-200 pb-2">Novo Usuário</h3>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Nome Completo</label>
                <input value={newUserName} onChange={e => setNewUserName(e.target.value)} className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-red-500/10 focus:border-red-500 outline-none transition-all font-medium text-sm" required />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Login (Username)</label>
                <input value={newUserLogin} onChange={e => setNewUserLogin(e.target.value)} className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-red-500/10 focus:border-red-500 outline-none transition-all font-medium text-sm" required />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Senha Inicial</label>
                <input value={newUserPassword} onChange={e => setNewUserPassword(e.target.value)} className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-red-500/10 focus:border-red-500 outline-none transition-all font-medium text-sm" required />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Cargo/Setor</label>
                <select value={newUserRole} onChange={e => setNewUserRole(e.target.value as UserRole)} className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-red-500/10 focus:border-red-500 outline-none transition-all font-medium text-sm">
                  <option value={UserRole.PORTARIA}>Portaria</option>
                  <option value={UserRole.ADMIN}>Administração</option>
                  <option value={UserRole.MASTER}>Master Suporte</option>
                  <option value={UserRole.SINDICO}>Síndico (Leitura)</option>
                </select>
              </div>
              <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-red-600/20 active:scale-95 transition-all">Criar Usuário</button>
            </form>
          </div>
        )}

        {/* User List */}
        <div className="lg:col-span-2 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-bold text-gray-500 uppercase">Usuário</th>
                <th className="px-4 py-2 text-left text-xs font-bold text-gray-500 uppercase">Setor</th>
                <th className="px-4 py-2 text-left text-xs font-bold text-gray-500 uppercase">Status</th>
                <th className="px-4 py-2 text-right text-xs font-bold text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map(u => (
                <tr key={u.id} className={`${!u.active ? 'bg-gray-50 opacity-60' : ''}`}>
                  <td className="px-4 py-3">
                    <div className="text-sm font-bold text-gray-800">{u.name}</div>
                    <div className="text-xs text-gray-500">@{u.username}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[10px] px-2 py-1 rounded bg-gray-200 font-bold uppercase">{u.role}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-bold ${u.active ? 'text-green-600' : 'text-red-600'}`}>
                      {u.active ? 'ATIVO' : 'REVOGADO'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right space-x-3">
                    {!isReadOnly && (
                      <>
                        <button onClick={() => resetPassword(u.username)} className="text-blue-600 text-xs hover:underline">Resetar Senha</button>
                        <button 
                          onClick={() => toggleStatus(u.id)} 
                          className={`${u.active ? 'text-red-600' : 'text-green-600'} text-xs font-bold hover:underline`}
                        >
                          {u.active ? 'Revogar Acesso' : 'Ativar Acesso'}
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
