
import React, { useState, useEffect, useMemo } from 'react';
import { User, UserRole, Delivery, DeliveryStatus, Apartment, Tower, Section } from './types';
import { getDB, saveDB, getDashboardStats } from './store';
import Sidebar from './components/Sidebar';
import DashboardCards from './components/DashboardCards';
import PortariaSection from './components/PortariaSection';
import AdminSection from './components/AdminSection';
import UserManagement from './components/UserManagement';
import ResidentManagement from './components/ResidentManagement';
import DeliveryList from './components/DeliveryList';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [db, setDb] = useState(getDB());
  const [loginError, setLoginError] = useState('');
  const [activeSection, setActiveSection] = useState<Section>(Section.DASHBOARD);

  useEffect(() => {
    // Basic auto-login for demo if needed
  }, []);

  const stats = useMemo(() => getDashboardStats(db.deliveries), [db.deliveries]);

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;
    const user = db.users.find(u => u.username === username && u.active);
    
    if (user && (user.password === password || !user.password)) {
      setCurrentUser(user);
      setLoginError('');
      setActiveSection(Section.DASHBOARD);
    } else if (user) {
      setLoginError('Senha incorreta.');
    } else {
      setLoginError('Usuário não encontrado ou inativo.');
    }
  };

  const handleLogout = () => setCurrentUser(null);

  const updateDeliveries = (newDeliveries: Delivery[]) => {
    const updatedDb = { ...db, deliveries: newDeliveries };
    setDb(updatedDb);
    saveDB(updatedDb);
  };

  const updateUsers = (newUsers: User[]) => {
    const updatedDb = { ...db, users: newUsers };
    setDb(updatedDb);
    saveDB(updatedDb);
  };

  const updateApartments = (newApts: Apartment[]) => {
    const updatedDb = { ...db, apartments: newApts };
    setDb(updatedDb);
    saveDB(updatedDb);
  };

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-[#0e2a47]">
        <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md transform transition-all duration-300 hover:scale-[1.02] border-t-8 border-blue-600">
          <div className="text-center mb-10">
            <div className="inline-block bg-blue-600 p-4 rounded-2xl shadow-lg mb-4">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h1 className="text-3xl font-black text-blue-900 tracking-tight">Entregas App</h1>
            <p className="text-blue-500 font-bold uppercase tracking-widest text-xs mt-1">Gestão de Condomínios</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Usuário de Acesso</label>
              <input 
                name="username"
                type="text" 
                required 
                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium"
                placeholder="Ex: master, admin, portaria"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Senha</label>
              <input 
                name="password"
                type="password" 
                required 
                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium"
                placeholder="••••••"
              />
            </div>
            {loginError && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold flex items-center border border-red-100">
                <span className="mr-2">⚠️</span> {loginError}
              </div>
            )}
            <button 
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-600/20 hover:shadow-blue-600/40 transition-all duration-300 active:scale-95 text-lg"
            >
              Entrar no Sistema
            </button>
          </form>
          <div className="mt-10 text-[10px] text-center text-gray-400 font-bold uppercase tracking-widest">
            Acesso Restrito • Versão 2.0
          </div>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeSection) {
      case Section.DASHBOARD:
        return <DashboardCards stats={stats} />;
      case Section.PORTARIA:
        return (
          <PortariaSection 
            db={db} 
            user={currentUser} 
            onUpdateDeliveries={updateDeliveries} 
          />
        );
      case Section.ADMINISTRACAO:
        return (
          <AdminSection 
            db={db} 
            user={currentUser} 
            onUpdateDeliveries={updateDeliveries} 
          />
        );
      case Section.ENCOMENDAS:
        return (
          <DeliveryList 
            deliveries={db.deliveries}
            towers={db.towers}
            apartments={db.apartments}
          />
        );
      case Section.MORADORES:
        return (
          <ResidentManagement 
            towers={db.towers}
            apartments={db.apartments}
            onUpdateApartments={updateApartments}
            currentUser={currentUser}
          />
        );
      case Section.USUARIOS:
        return (
          <UserManagement 
            users={db.users} 
            onUpdateUsers={updateUsers} 
            currentUser={currentUser}
          />
        );
      default:
        return <DashboardCards stats={stats} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar 
        user={currentUser} 
        activeSection={activeSection} 
        onSectionChange={setActiveSection}
        onLogout={handleLogout}
      />
      
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-black text-gray-900 tracking-tight">
                {activeSection.charAt(0) + activeSection.slice(1).toLowerCase()}
              </h2>
              <p className="text-gray-500 font-medium">Bem-vindo de volta, {currentUser.name.split(' ')[0]}</p>
            </div>
            <div className="text-right hidden md:block">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Data de Hoje</p>
              <p className="text-sm font-bold text-gray-700">{new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>

          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
