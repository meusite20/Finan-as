import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import TransactionForm from './components/TransactionForm';
import Advisor from './components/Advisor';
import Analysis from './components/Analysis';
import Settings from './components/Settings';
import Goals from './components/Goals';
import Login from './components/Login';
import { Transaction, UserProfile, TransactionType, Category } from './types';

// Initial Mock Data (Only transactions, profile is empty initially)
const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: '1', title: 'Salário', amount: 5000, type: TransactionType.INCOME, category: Category.SALARY, date: new Date(new Date().setDate(1)).toISOString() },
  { id: '2', title: 'Aluguel', amount: 1800, type: TransactionType.EXPENSE, category: Category.HOUSING, date: new Date(new Date().setDate(5)).toISOString() },
  { id: '3', title: 'Supermercado Semanal', amount: 450.50, type: TransactionType.EXPENSE, category: Category.FOOD, date: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString() },
  { id: '4', title: 'Uber - Trabalho', amount: 24.90, type: TransactionType.EXPENSE, category: Category.TRANSPORT, date: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString() },
  { id: '5', title: 'Cinema e Pipoca', amount: 85.00, type: TransactionType.EXPENSE, category: Category.LEISURE, date: new Date().toISOString() },
];

const App: React.FC = () => {
  // Auth State
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [currentView, setCurrentView] = useState('dashboard');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  
  // Profile initialized empty/default, populated by Login
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: '',
    monthlyIncome: 0,
    savingsGoal: 0,
    plan: 'free'
  });

  const handleLogin = (profile: UserProfile) => {
    setUserProfile(profile);
    setIsLoggedIn(true);
  };

  const addTransaction = (t: Transaction) => {
    setTransactions(prev => [...prev, t]);
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard 
          transactions={transactions} 
          onAddClick={() => setShowAddModal(true)} 
          monthlyIncome={userProfile.monthlyIncome}
          savingsGoal={userProfile.savingsGoal}
        />;
      case 'advisor':
        return <Advisor transactions={transactions} userProfile={userProfile} />;
      case 'analysis':
        return <Analysis transactions={transactions} />;
      case 'transactions':
        return <Dashboard 
          transactions={transactions} 
          onAddClick={() => setShowAddModal(true)} 
          monthlyIncome={userProfile.monthlyIncome} 
          savingsGoal={userProfile.savingsGoal}
        />;
      case 'goals':
        return <Goals 
          transactions={transactions} 
          userProfile={userProfile} 
          onUpdateProfile={setUserProfile} 
        />;
      case 'settings':
        return <Settings userProfile={userProfile} onUpdateProfile={setUserProfile} />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full text-slate-400">
            <i className="fa-solid fa-tools text-4xl mb-4"></i>
            <p>Em desenvolvimento...</p>
          </div>
        );
    }
  };

  // If not logged in, show Login Screen
  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden text-slate-800 font-sans">
      <Sidebar 
        currentView={currentView} 
        setView={setCurrentView} 
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        userProfile={userProfile}
      />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-slate-100 shadow-sm z-10">
          <button onClick={() => setIsMobileOpen(true)} className="text-slate-600">
            <i className="fa-solid fa-bars text-xl"></i>
          </button>
          <div className="flex items-center gap-2 text-indigo-600">
             <i className="fa-solid fa-chart-simple"></i>
             <span className="font-extrabold text-lg tracking-tight">FinAI</span>
          </div>
          <div className="w-8"></div> {/* Spacer */}
        </div>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto h-full">
            {renderView()}
          </div>
        </main>
      </div>

      {showAddModal && (
        <TransactionForm 
          onAddTransaction={addTransaction} 
          onClose={() => setShowAddModal(false)} 
        />
      )}
    </div>
  );
};

export default App;