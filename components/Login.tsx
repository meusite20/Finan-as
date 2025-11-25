import React, { useState } from 'react';
import { UserProfile } from '../types';

interface LoginProps {
  onLogin: (profile: UserProfile) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    monthlyIncome: '',
    savingsGoal: ''
  });
  const [step, setStep] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create profile object
    const profile: UserProfile = {
      name: formData.name || 'Usuário',
      monthlyIncome: Number(formData.monthlyIncome) || 0,
      savingsGoal: Number(formData.savingsGoal) || 0,
      plan: 'free' // Default start plan
    };

    onLogin(profile);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-indigo-200/30 rounded-full blur-3xl"></div>
        <div className="absolute top-[40%] -right-[10%] w-[40%] h-[60%] bg-purple-200/30 rounded-full blur-3xl"></div>
      </div>

      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl flex overflow-hidden z-10 relative border border-slate-100 min-h-[600px]">
        
        {/* Left Side - Brand/Visual */}
        <div className="hidden md:flex w-1/2 bg-indigo-600 relative flex-col justify-between p-12 text-white">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-700 opacity-90"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
                <i className="fa-solid fa-chart-simple text-white text-xl"></i>
              </div>
              <span className="text-2xl font-extrabold tracking-tight">FinAI</span>
            </div>
            <h1 className="text-4xl font-bold leading-tight mb-4">
              Domine suas finanças com Inteligência Artificial.
            </h1>
            <p className="text-indigo-100 text-lg opacity-90">
              Categorização automática, insights personalizados e planejamento financeiro em um só lugar.
            </p>
          </div>

          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-4 text-sm font-medium bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
              <i className="fa-solid fa-wand-magic-sparkles text-amber-300 text-xl"></i>
              <div>
                <p className="text-white">Organização Automática</p>
                <p className="text-indigo-200 text-xs font-normal">Adeus planilhas manuais.</p>
              </div>
            </div>
             <div className="flex items-center gap-4 text-sm font-medium bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
              <i className="fa-solid fa-robot text-emerald-300 text-xl"></i>
              <div>
                <p className="text-white">Consultor Pessoal</p>
                <p className="text-indigo-200 text-xs font-normal">Dicas baseadas no seu perfil.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white">
          <div className="max-w-sm mx-auto w-full">
            <div className="mb-10">
              <h2 className="text-3xl font-bold text-slate-800 mb-2">Vamos começar</h2>
              <p className="text-slate-500">Configure seu perfil para receber análises personalizadas.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Como devemos te chamar?</label>
                  <div className="relative">
                    <span className="absolute left-4 top-3.5 text-slate-400"><i className="fa-solid fa-user"></i></span>
                    <input
                      type="text"
                      required
                      className="w-full pl-10 p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
                      placeholder="Seu nome"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Qual sua renda mensal aproximada?</label>
                  <div className="relative">
                    <span className="absolute left-4 top-3.5 text-slate-400 font-bold">R$</span>
                    <input
                      type="number"
                      required
                      min="0"
                      className="w-full pl-10 p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
                      placeholder="0.00"
                      value={formData.monthlyIncome}
                      onChange={(e) => setFormData({...formData, monthlyIncome: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Qual sua meta de economia mensal?</label>
                  <div className="relative">
                    <span className="absolute left-4 top-3.5 text-slate-400 font-bold">R$</span>
                    <input
                      type="number"
                      required
                      min="0"
                      className="w-full pl-10 p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
                      placeholder="0.00"
                      value={formData.savingsGoal}
                      onChange={(e) => setFormData({...formData, savingsGoal: e.target.value})}
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-2">Isso ajuda o FinAI a criar um plano para você.</p>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-200 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 mt-4"
              >
                Acessar Plataforma <i className="fa-solid fa-arrow-right"></i>
              </button>

            </form>

            <div className="mt-8 text-center">
              <p className="text-xs text-slate-400">
                Ao continuar, você concorda com nossa Política de Privacidade.
                <br/>Seus dados são processados localmente ou via API segura.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;