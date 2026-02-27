
import React, { useState, useEffect, useMemo } from 'react';
import { User, UserRole, Delivery, DeliveryStatus, Apartment, Tower, Section } from './types';
import { 
  fetchDBFromFirestore, 
  subscribeToDeliveries, 
  saveDeliveryToFirestore, 
  saveUserToFirestore, 
  saveApartmentToFirestore, 
  getDashboardStats, 
  initializeFirestore,
  DB 
} from './store';
import { TOWERS, generateApartments, INITIAL_USERS } from './mockData';
import Sidebar from './components/Sidebar';
import DashboardCards from './components/DashboardCards';
import PortariaSection from './components/PortariaSection';
import AdminSection from './components/AdminSection';
import UserManagement from './components/UserManagement';
import ResidentManagement from './components/ResidentManagement';
import DeliveryList from './components/DeliveryList';

import { Menu, X, Calendar } from 'lucide-react';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [db, setDb] = useState<DB | null>(null);
  const [loginError, setLoginError] = useState('');
  const [activeSection, setActiveSection] = useState<Section>(Section.DASHBOARD);
  const [loading, setLoading] = useState(true);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    // Auto-refresh a cada 1 hora
    const refreshInterval = setInterval(() => {
      console.log('Executando refresh automático de 1 hora...');
      window.location.reload();
    }, 60 * 60 * 1000);

    const loadInitialData = async () => {
      try {
        setConnectionError(null);
        // Inicializa com dados padrão se o Firestore estiver vazio
        await initializeFirestore({
          users: INITIAL_USERS,
          deliveries: [],
          towers: TOWERS,
          apartments: generateApartments()
        });

        const data = await fetchDBFromFirestore();
        setDb(data);
        
        // Inscrição para atualizações em tempo real das encomendas
        const unsubscribe = subscribeToDeliveries((deliveries) => {
          setDb(prev => prev ? { ...prev, deliveries } : null);
        });

        const savedUser = localStorage.getItem('entregas_app_user');
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          // Verifica se o usuário ainda existe e está ativo no DB carregado
          const validUser = data.users.find(u => u.id === parsedUser.id && u.active);
          if (validUser) setCurrentUser(validUser);
        }

        return () => {
          unsubscribe();
          clearInterval(refreshInterval);
        };
      } catch (error: any) {
        console.error('Error loading Firestore:', error);
        setConnectionError(error.message || 'Erro ao conectar ao Firebase. Verifique sua configuração e conexão.');
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
  }, []);

  const stats = useMemo(() => db ? getDashboardStats(db.deliveries) : null, [db?.deliveries]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;
    
    if (!db) return;

    const user = db.users.find(u => u.username === username && u.active);
    
    if (user && (user.password === password || !user.password)) {
      setCurrentUser(user);
      localStorage.setItem('entregas_app_user', JSON.stringify(user));
      setLoginError('');
      setActiveSection(Section.DASHBOARD);
    } else if (user) {
      setLoginError('Senha incorreta.');
    } else {
      setLoginError('Usuário não encontrado ou inativo.');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('entregas_app_user');
  };

  const updateDeliveries = async (newDeliveries: Delivery[]) => {
    if (!db) return;
    try {
      // No Firestore, salvamos o item alterado
      // Como os componentes passam o array todo, pegamos o último ou o que mudou
      // Para simplificar, salvamos todos os que estão no array (o Firestore lida com a idempotência)
      for (const d of newDeliveries) {
        await saveDeliveryToFirestore(d);
      }
    } catch (error) {
      alert('Erro ao salvar no Firebase.');
    }
  };

  const updateUsers = async (newUsers: User[]) => {
    if (!db) return;
    try {
      for (const u of newUsers) {
        await saveUserToFirestore(u);
      }
      setDb({ ...db, users: newUsers });
    } catch (error) {
      alert('Erro ao salvar usuário no Firebase.');
    }
  };

  const updateApartments = async (newApts: Apartment[]) => {
    if (!db) return;
    try {
      for (const a of newApts) {
        await saveApartmentToFirestore(a);
      }
      setDb({ ...db, apartments: newApts });
    } catch (error) {
      alert('Erro ao salvar morador no Firebase.');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0e2a47] p-6 text-center">
        <div className="text-white text-xl font-bold animate-pulse mb-4">Conectando ao Firebase...</div>
        {connectionError && (
          <div className="bg-red-500/20 border border-red-500 text-red-100 p-4 rounded-xl max-w-md">
            <p className="font-bold mb-2">Erro de Conexão:</p>
            <p className="text-sm opacity-90">{connectionError}</p>
            <p className="text-[10px] mt-4 uppercase tracking-widest font-bold opacity-50">Verifique o Console do Navegador para mais detalhes</p>
          </div>
        )}
      </div>
    );
  }

  if (!currentUser || !db) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-[#0e2a47]">
        <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-10 w-full max-w-md transform transition-all duration-300 hover:scale-[1.02] border-t-8 border-blue-600">
          <div className="text-center mb-8 md:mb-10">
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

  const handleSectionChange = (section: Section) => {
    setActiveSection(section);
    setIsSidebarOpen(false); // Fecha o menu ao trocar de seção no mobile
  };

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
    <div className="flex min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Overlay para fechar menu mobile ao clicar fora */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <Sidebar 
        user={currentUser} 
        activeSection={activeSection} 
        onSectionChange={handleSectionChange}
        onLogout={handleLogout}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      
      <main className="flex-1 min-w-0 overflow-y-auto">
        <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setIsSidebarOpen(true)}
                  className="lg:hidden p-2 bg-white rounded-xl shadow-sm border border-gray-200 text-gray-600 hover:bg-gray-50 active:scale-95 transition-all"
                >
                  <Menu className="w-6 h-6" />
                </button>
                <div>
                  <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
                    {activeSection.charAt(0) + activeSection.slice(1).toLowerCase()}
                  </h2>
                  <p className="text-gray-500 font-medium text-sm md:text-base">Bem-vindo de volta, {currentUser.name.split(' ')[0]}</p>
                </div>
              </div>
            </div>
            
            <div className="text-left md:text-right flex items-center md:block gap-2 bg-white md:bg-transparent p-3 md:p-0 rounded-2xl border md:border-0 border-gray-100 shadow-sm md:shadow-none">
              <div className="md:hidden bg-blue-50 p-2 rounded-lg">
                <Calendar className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hidden md:block">Data de Hoje</p>
                <p className="text-xs md:text-sm font-bold text-gray-700">
                  {new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>
          </div>

          <div className="w-full">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
