import React, { useState } from 'react';
import { Transaction, UserProfile, TransactionType } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from 'recharts';

interface GoalsProps {
  transactions: Transaction[];
  userProfile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
}

const Goals: React.FC<GoalsProps> = ({ transactions, userProfile, onUpdateProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempGoal, setTempGoal] = useState(userProfile.savingsGoal);

  // Calculate stats
  const totalIncome = transactions
    .filter(t => t.type === TransactionType.INCOME)
    .reduce((acc, t) => acc + t.amount, 0);
  
  const totalExpense = transactions
    .filter(t => t.type === TransactionType.EXPENSE)
    .reduce((acc, t) => acc + t.amount, 0);

  const currentSavings = Math.max(0, totalIncome - totalExpense);
  const progress = Math.min(100, (currentSavings / userProfile.savingsGoal) * 100);
  const remaining = Math.max(0, userProfile.savingsGoal - currentSavings);

  const data = [
    { name: 'Economizado', value: currentSavings },
    { name: 'Restante', value: remaining > 0 ? remaining : 0 }
  ];

  // If savings exceed goal, full circle is green, otherwise remaining is gray
  const chartData = remaining === 0 && currentSavings > 0 
    ? [{ name: 'Economizado', value: 1 }] 
    : [
        { name: 'Economizado', value: currentSavings },
        { name: 'Faltam', value: remaining }
      ];

  const COLORS = ['#10b981', '#e2e8f0'];

  const handleSave = () => {
    onUpdateProfile({ ...userProfile, savingsGoal: tempGoal });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Metas Financeiras</h1>
          <p className="text-slate-500">Acompanhe seu progresso e realize seus sonhos.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Main Goal Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-lg font-bold text-slate-800 flex items-center">
                <i className="fa-solid fa-piggy-bank text-indigo-500 mr-2"></i>
                Economia Mensal
              </h2>
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
              >
                {isEditing ? 'Cancelar' : 'Alterar Meta'}
              </button>
            </div>

            {isEditing ? (
              <div className="mb-6 bg-slate-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Definir nova meta (R$)
                </label>
                <div className="flex gap-2">
                  <input 
                    type="number" 
                    value={tempGoal}
                    onChange={(e) => setTempGoal(Number(e.target.value))}
                    className="flex-1 p-2 border border-slate-300 rounded focus:border-indigo-500 outline-none"
                  />
                  <button 
                    onClick={handleSave}
                    className="bg-indigo-600 text-white px-4 py-2 rounded font-medium hover:bg-indigo-700"
                  >
                    Salvar
                  </button>
                </div>
              </div>
            ) : (
              <div className="mb-2">
                 <p className="text-3xl font-bold text-slate-800">
                    R$ {userProfile.savingsGoal.toLocaleString('pt-BR')}
                 </p>
                 <p className="text-sm text-slate-500">Objetivo para este mês</p>
              </div>
            )}
          </div>

          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium text-slate-700">Progresso</span>
              <span className="font-bold text-indigo-600">{progress.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ${progress >= 100 ? 'bg-emerald-500' : 'bg-indigo-500'}`} 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              {remaining > 0 
                ? `Faltam R$ ${remaining.toLocaleString('pt-BR')} para atingir sua meta.`
                : 'Parabéns! Você atingiu sua meta mensal! 🎉'
              }
            </p>
          </div>
        </div>

        {/* Visual Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center justify-center">
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    startAngle={90}
                    endAngle={-270}
                    dataKey="value"
                    stroke="none"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                    <Label 
                      value={`${progress.toFixed(0)}%`} 
                      position="center" 
                      className="text-2xl font-bold fill-slate-700"
                    />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <p className="text-center text-sm font-medium text-slate-600 mt-[-10px]">
              Economizado: <span className="text-emerald-600 font-bold">R$ {currentSavings.toLocaleString('pt-BR')}</span>
            </p>
        </div>
      </div>
    </div>
  );
};

export default Goals;