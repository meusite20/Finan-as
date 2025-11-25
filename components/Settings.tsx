import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';

interface SettingsProps {
  userProfile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
}

const Settings: React.FC<SettingsProps> = ({ userProfile, onUpdateProfile }) => {
  const [formData, setFormData] = useState<UserProfile>(userProfile);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    setFormData(userProfile);
  }, [userProfile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(formData);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleSubscribe = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Evita conflito com o clique do card
    
    // Exibe o alerta conforme solicitado
    alert('Funcionalidade premium não implementada. Assine para continuar.');
    
    // Simula a atualização do plano para Premium após o alerta
    setFormData({ ...formData, plan: 'premium' });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-10">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Configurações</h1>
        <p className="text-slate-500 mt-1">Gerencie seu perfil, preferências e plano de assinatura.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-soft border border-slate-100 overflow-hidden">
        <form onSubmit={handleSubmit} className="divide-y divide-slate-100">
          
          {/* Profile Section */}
          <div className="p-8">
            <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
              <i className="fa-solid fa-user-circle text-indigo-500 mr-2"></i>
              Perfil Financeiro
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Nome de Exibição
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full p-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-slate-50 focus:bg-white"
                  placeholder="Seu nome completo"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Renda Mensal Declarada
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-slate-400 font-medium">R$</span>
                  <input
                    type="number"
                    value={formData.monthlyIncome}
                    onChange={(e) => setFormData({...formData, monthlyIncome: Number(e.target.value)})}
                    className="w-full pl-10 p-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-slate-50 focus:bg-white"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Meta de Economia Mensal
              </label>
              <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                  <span className="absolute left-4 top-3.5 text-slate-400 font-medium">R$</span>
                  <input
                    type="number"
                    value={formData.savingsGoal}
                    onChange={(e) => setFormData({...formData, savingsGoal: Number(e.target.value)})}
                    className="w-full pl-10 p-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-slate-50 focus:bg-white"
                    placeholder="0.00"
                  />
                </div>
                <div className="text-sm text-slate-500 flex-1 hidden md:block border-l border-slate-200 pl-4">
                   <p>Defina quanto deseja poupar. O FinAI usará este valor para monitorar seu progresso.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Plan Section */}
          <div className="p-8 bg-slate-50/50">
            <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
              <i className="fa-solid fa-credit-card text-indigo-500 mr-2"></i>
              Seu Plano
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Free Plan */}
              <div 
                onClick={() => setFormData({...formData, plan: 'free'})}
                className={`relative group cursor-pointer rounded-2xl p-6 border-2 transition-all duration-300 flex flex-col h-full ${
                  formData.plan === 'free' 
                    ? 'border-indigo-600 bg-white shadow-lg ring-1 ring-indigo-600' 
                    : 'border-slate-200 bg-white hover:border-indigo-300 hover:shadow-md'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                   <div className="bg-slate-100 p-2 rounded-lg">
                      <i className="fa-solid fa-leaf text-slate-600 text-xl"></i>
                   </div>
                   {formData.plan === 'free' && (
                     <div className="text-indigo-600">
                       <i className="fa-solid fa-circle-check text-2xl"></i>
                     </div>
                   )}
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-1">Starter Free</h3>
                <div className="text-3xl font-bold text-slate-800 mb-4">R$ 0<span className="text-sm font-medium text-slate-400">/mês</span></div>
                <ul className="space-y-3 mb-6 flex-1">
                  <li className="flex items-center text-sm text-slate-600">
                    <i className="fa-solid fa-check text-green-500 mr-2"></i> Controle básico
                  </li>
                  <li className="flex items-center text-sm text-slate-600">
                    <i className="fa-solid fa-check text-green-500 mr-2"></i> Relatórios simples
                  </li>
                  <li className="flex items-center text-sm text-slate-600">
                    <i className="fa-solid fa-check text-green-500 mr-2"></i> IA Limitada
                  </li>
                </ul>
              </div>
              
              {/* Premium Plan */}
              <div 
                onClick={() => setFormData({...formData, plan: 'premium'})}
                className={`relative group cursor-pointer rounded-2xl p-6 border-2 transition-all duration-300 flex flex-col h-full overflow-hidden ${
                  formData.plan === 'premium' 
                    ? 'border-amber-500 bg-white shadow-xl ring-1 ring-amber-500' 
                    : 'border-slate-200 bg-white hover:border-amber-300 hover:shadow-md'
                }`}
              >
                {formData.plan === 'premium' && (
                  <div className="absolute top-0 right-0 bg-amber-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                    Selecionado
                  </div>
                )}
                <div className="flex justify-between items-start mb-4">
                   <div className="bg-amber-50 p-2 rounded-lg">
                      <i className="fa-solid fa-crown text-amber-500 text-xl"></i>
                   </div>
                   {formData.plan !== 'premium' && <span className="text-xs font-bold text-amber-600 bg-amber-100 px-2 py-1 rounded-md">Recomendado</span>}
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-1">FinAI Pro</h3>
                <div className="text-3xl font-bold text-slate-800 mb-4">R$ 29,90<span className="text-sm font-medium text-slate-400">/mês</span></div>
                <ul className="space-y-3 mb-6 flex-1">
                  <li className="flex items-center text-sm text-slate-600">
                    <i className="fa-solid fa-check text-amber-500 mr-2"></i> Análise IA Ilimitada
                  </li>
                  <li className="flex items-center text-sm text-slate-600">
                    <i className="fa-solid fa-check text-amber-500 mr-2"></i> Consultor Pessoal 24/7
                  </li>
                  <li className="flex items-center text-sm text-slate-600">
                    <i className="fa-solid fa-check text-amber-500 mr-2"></i> Metas Inteligentes
                  </li>
                   <li className="flex items-center text-sm text-slate-600">
                    <i className="fa-solid fa-check text-amber-500 mr-2"></i> Relatórios Detalhados
                  </li>
                </ul>
                <button
                  onClick={handleSubscribe}
                  className="w-full mt-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-amber-200 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                >
                  <i className="fa-solid fa-star"></i> Assinar Agora
                </button>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="p-8 flex items-center justify-end bg-slate-50 gap-4">
             {showSuccess && (
              <span className="text-emerald-600 font-medium flex items-center animate-fade-in bg-emerald-50 px-4 py-2 rounded-lg border border-emerald-100">
                <i className="fa-solid fa-check-circle mr-2"></i>
                Alterações salvas com sucesso!
              </span>
            )}
            <button
              type="submit"
              className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 hover:shadow-xl hover:-translate-y-0.5"
            >
              Salvar Configurações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;