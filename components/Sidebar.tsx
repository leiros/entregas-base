
import React from 'react';
import { User, UserRole, Section } from '../types';
import { 
  LayoutDashboard, 
  ShieldAlert, 
  Building2, 
  Package, 
  Users, 
  UserCog,
  LogOut,
  X
} from 'lucide-react';

interface SidebarProps {
  user: User;
  activeSection: Section;
  onSectionChange: (section: Section) => void;
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ user, activeSection, onSectionChange, onLogout, isOpen, onClose }) => {
  const menuItems = [
    { id: Section.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard, roles: [UserRole.MASTER, UserRole.ADMIN, UserRole.PORTARIA, UserRole.SINDICO] },
    { id: Section.PORTARIA, label: 'Portaria', icon: ShieldAlert, roles: [UserRole.MASTER, UserRole.PORTARIA, UserRole.SINDICO] },
    { id: Section.ADMINISTRACAO, label: 'Administração', icon: Building2, roles: [UserRole.MASTER, UserRole.ADMIN, UserRole.SINDICO] },
    { id: Section.ENCOMENDAS, label: 'Encomendas', icon: Package, roles: [UserRole.MASTER, UserRole.ADMIN, UserRole.PORTARIA, UserRole.SINDICO] },
    { id: Section.MORADORES, label: 'Moradores', icon: Users, roles: [UserRole.MASTER, UserRole.ADMIN, UserRole.SINDICO] },
    { id: Section.USUARIOS, label: 'Usuários', icon: UserCog, roles: [UserRole.MASTER, UserRole.SINDICO] },
  ];

  const filteredItems = menuItems.filter(item => item.roles.includes(user.role));

  return (
    <aside className={`
      fixed lg:sticky top-0 left-0 z-50
      w-64 h-screen
      bg-gradient-to-b from-[#0e2a47] to-[#00d2ff] text-white 
      flex flex-col shadow-2xl border-r border-blue-900/50
      transition-transform duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
    `}>
      <div className="p-6 border-b border-blue-900/50 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 p-2 rounded-lg shadow-lg">
            <Package className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight tracking-tight">Entregas App</h1>
            <p className="text-blue-400 text-[10px] uppercase font-bold tracking-widest">Condomínios</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-blue-200" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                  : 'text-blue-200 hover:bg-blue-800/50 hover:text-white'
              }`}
            >
              <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
              <span className="font-medium text-sm">{item.label}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-blue-900/50">
        <div className="bg-blue-900/30 rounded-2xl p-4 mb-4 border border-blue-800/30">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-sm shadow-inner">
              {user.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate">{user.name}</p>
              <p className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">{user.role}</p>
            </div>
          </div>
        </div>
        
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200 font-bold text-sm border border-transparent hover:border-red-500/20"
        >
          <LogOut className="w-4 h-4" />
          <span>Sair do Sistema</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
