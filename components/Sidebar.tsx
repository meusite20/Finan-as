import React from 'react';
import { UserProfile } from '../types';

interface SidebarProps {
  currentView: string;
  setView: (view: string) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  userProfile: UserProfile;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, isMobileOpen, setIsMobileOpen, userProfile }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Visão Geral', icon: 'fa-chart-pie' },
    { id: 'transactions', label: 'Transações', icon: 'fa-list-ul' },
    { id: 'analysis', label: 'Análise IA', icon: 'fa-wand-magic-sparkles' },
    { id: 'advisor', label: 'Consultor FinAI', icon: 'fa-comments-dollar' },
    { id: 'goals', label: 'Metas', icon: 'fa-bullseye' },
    { id: 'settings', label: 'Configurações', icon: 'fa-sliders' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-20 md:hidden transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-72 bg-white border-r border-slate-100 shadow-2xl md:shadow-none transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-0 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}>
        
        {/* Logo Area */}
        <div className="h-24 flex items-center px-8 border-b border-slate-50">
          <div className="flex items-center gap-3 text-primary">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <i className="fa-solid fa-chart-simple text-white text-xl"></i>
            </div>
            <div>
              <span className="text-2xl font-extrabold tracking-tight text-slate-800">FinAI</span>
              <span className="text-[10px] block font-medium text-slate-400 tracking-wider uppercase -mt-1">Financeiro</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-8 space-y-1 overflow-y-auto">
          <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Menu Principal</p>
          {menuItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setView(item.id);
                  setIsMobileOpen(false);
                }}
                className={`relative flex items-center w-full px-4 py-3.5 text-sm font-medium rounded-xl transition-all duration-200 group ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-600 rounded-r-full"></div>
                )}
                <i className={`fa-solid ${item.icon} w-6 text-center mr-3 transition-colors ${isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}`}></i>
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* User Profile Footer */}
        <div className="p-4 border-t border-slate-50">
          <div className={`flex items-center gap-3 p-3 rounded-2xl transition-all border ${
            userProfile.plan === 'premium' 
              ? 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-100' 
              : 'bg-slate-50 border-slate-100'
          }`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-sm border-2 ${
              userProfile.plan === 'premium'
                ? 'bg-white border-amber-200 text-amber-500' 
                : 'bg-white border-indigo-100 text-indigo-600'
            }`}>
              {userProfile.plan === 'premium' ? <i className="fa-solid fa-crown text-sm"></i> : 'US'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-700 truncate">{userProfile.name || 'Usuário'}</p>
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${userProfile.plan === 'premium' ? 'bg-amber-500' : 'bg-slate-400'}`}></span>
                <p className={`text-xs font-medium truncate ${userProfile.plan === 'premium' ? 'text-amber-600' : 'text-slate-500'}`}>
                  {userProfile.plan === 'premium' ? 'Premium Member' : 'Plano Gratuito'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;