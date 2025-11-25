import React from 'react';
import { Transaction, TransactionType } from '../types';
import { ExpenseByCategoryChart, BalanceHistoryChart } from './Charts';

interface DashboardProps {
  transactions: Transaction[];
  onAddClick: () => void;
  monthlyIncome: number;
  savingsGoal: number;
}

const Dashboard: React.FC<DashboardProps> = ({ transactions, onAddClick, monthlyIncome, savingsGoal }) => {
  const totalIncome = transactions
    .filter(t => t.type === TransactionType.INCOME)
    .reduce((acc, t) => acc + t.amount, 0);
  
  const totalExpense = transactions
    .filter(t => t.type === TransactionType.EXPENSE)
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = totalIncome - totalExpense;
  const currentSavings = Math.max(0, balance);
  const expensePercentage = monthlyIncome > 0 ? (totalExpense / monthlyIncome) * 100 : 0;
  const goalProgress = savingsGoal > 0 ? Math.min(100, (currentSavings / savingsGoal) * 100) : 0;
  
  const fmt = (n: number) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  // Get greeting based on time
  const hour = new Date().getHours();
  let greeting = 'Bom dia';
  if (hour >= 12) greeting = 'Boa tarde';
  if (hour >= 18) greeting = 'Boa noite';

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{greeting}, Investidor!</h1>
          <p className="text-slate-500 mt-1">Aqui está o panorama da sua saúde financeira hoje.</p>
        </div>
        <button 
          onClick={onAddClick}
          className="group bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl flex items-center shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5"
        >
          <div className="bg-indigo-500 rounded-lg p-1 mr-2 group-hover:bg-indigo-400 transition-colors">
            <i className="fa-solid fa-plus text-xs block"></i>
          </div>
          <span className="font-semibold">Nova Transação</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Saldo */}
        <div className="bg-white p-6 rounded-2xl shadow-soft border border-slate-100 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-emerald-600"></div>
          <div className="flex justify-between items-start mb-4">
             <div>
               <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">Saldo Total</p>
               <h3 className={`text-2xl font-bold mt-1 ${balance >= 0 ? 'text-slate-800' : 'text-red-500'}`}>
                 {fmt(balance)}
               </h3>
             </div>
             <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600 group-hover:scale-110 transition-transform">
               <i className="fa-solid fa-wallet text-xl"></i>
             </div>
          </div>
          <div className="text-xs text-slate-400 flex items-center">
            <i className="fa-solid fa-circle-check text-emerald-500 mr-1.5"></i>
            Atualizado agora
          </div>
        </div>

        {/* Despesas */}
        <div className="bg-white p-6 rounded-2xl shadow-soft border border-slate-100 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-400 to-red-600"></div>
           <div className="flex justify-between items-start mb-4">
             <div>
               <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">Despesas</p>
               <h3 className="text-2xl font-bold mt-1 text-slate-800">{fmt(totalExpense)}</h3>
             </div>
             <div className="p-3 bg-red-50 rounded-xl text-red-500 group-hover:scale-110 transition-transform">
               <i className="fa-solid fa-arrow-trend-down text-xl"></i>
             </div>
           </div>
           <div className="text-xs text-slate-400">
             <span className="font-medium text-red-500">{expensePercentage.toFixed(0)}%</span> da renda mensal
           </div>
        </div>

        {/* Disponível */}
        <div className="bg-white p-6 rounded-2xl shadow-soft border border-slate-100 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-blue-600"></div>
           <div className="flex justify-between items-start mb-4">
             <div>
               <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">Livre para Gastar</p>
               <h3 className="text-2xl font-bold mt-1 text-slate-800">{fmt(Math.max(0, monthlyIncome - totalExpense))}</h3>
             </div>
             <div className="p-3 bg-blue-50 rounded-xl text-blue-500 group-hover:scale-110 transition-transform">
               <i className="fa-solid fa-money-bill-wave text-xl"></i>
             </div>
           </div>
           <div className="text-xs text-slate-400">
             Baseado na renda de {fmt(monthlyIncome)}
           </div>
        </div>

        {/* Meta */}
        <div className="bg-white p-6 rounded-2xl shadow-soft border border-slate-100 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-400 to-purple-600"></div>
           <div className="flex justify-between items-start mb-2">
             <div>
                <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">Meta de Economia</p>
             </div>
             <div className="flex items-center gap-1 text-purple-600 font-bold bg-purple-50 px-2 py-1 rounded-md text-xs">
                {goalProgress.toFixed(0)}%
             </div>
           </div>
           <div>
              <div className="flex justify-between items-baseline mb-2">
                 <h3 className="text-xl font-bold text-slate-800">{fmt(currentSavings)}</h3>
                 <span className="text-xs text-slate-400">de {fmt(savingsGoal)}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full shadow-glow transition-all duration-1000 ease-out" 
                  style={{ width: `${goalProgress}%` }}
                ></div>
              </div>
           </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-soft border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800">Fluxo de Caixa</h3>
            <div className="px-3 py-1 bg-slate-50 rounded-full text-xs font-medium text-slate-500 border border-slate-100">Últimos dias</div>
          </div>
          <BalanceHistoryChart transactions={transactions} />
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-soft border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800">Despesas por Categoria</h3>
            <div className="px-3 py-1 bg-slate-50 rounded-full text-xs font-medium text-slate-500 border border-slate-100">Este mês</div>
          </div>
          <ExpenseByCategoryChart transactions={transactions} />
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="bg-white rounded-2xl shadow-soft border border-slate-100 overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-800">Transações Recentes</h3>
          <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">Ver todas</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/50 text-slate-500 font-semibold uppercase text-xs tracking-wider">
              <tr>
                <th className="px-8 py-4">Data</th>
                <th className="px-8 py-4">Descrição</th>
                <th className="px-8 py-4">Categoria</th>
                <th className="px-8 py-4 text-right">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {transactions.slice().reverse().slice(0, 5).map((t) => (
                <tr key={t.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-8 py-4 whitespace-nowrap text-slate-500">
                    {new Date(t.date).toLocaleDateString('pt-BR', {day: '2-digit', month: 'short'})}
                  </td>
                  <td className="px-8 py-4">
                    <div className="font-semibold text-slate-700 group-hover:text-indigo-600 transition-colors">{t.title}</div>
                  </td>
                  <td className="px-8 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                      {t.category}
                    </span>
                  </td>
                  <td className={`px-8 py-4 text-right font-bold ${t.type === TransactionType.INCOME ? 'text-emerald-600' : 'text-slate-800'}`}>
                    {t.type === TransactionType.INCOME ? '+' : '-'} {fmt(t.amount)}
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-8 py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center">
                      <i className="fa-solid fa-receipt text-3xl mb-3 opacity-30"></i>
                      <p>Nenhuma transação registrada ainda.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;