import React, { useState } from 'react';
import { parseTransactionInput } from '../services/geminiService';
import { Transaction, TransactionType, Category } from '../types';

interface TransactionFormProps {
  onAddTransaction: (t: Transaction) => void;
  onClose: () => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onAddTransaction, onClose }) => {
  const [inputMode, setInputMode] = useState<'manual' | 'ai'>('ai');
  const [aiInput, setAiInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [manualData, setManualData] = useState<Partial<Transaction>>({
    title: '',
    amount: 0,
    type: TransactionType.EXPENSE,
    category: Category.FOOD,
    date: new Date().toISOString().split('T')[0]
  });

  const handleAiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim()) return;

    setIsLoading(true);
    try {
      const parsed = await parseTransactionInput(aiInput);
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        title: parsed.title || 'Despesa',
        amount: parsed.amount || 0,
        type: parsed.type || TransactionType.EXPENSE,
        category: parsed.category || Category.OTHER,
        date: parsed.date || new Date().toISOString(),
      };
      onAddTransaction(newTransaction);
      onClose();
    } catch (err) {
      alert('Erro ao processar com IA. Tente manualmente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      title: manualData.title!,
      amount: Number(manualData.amount),
      type: manualData.type!,
      category: manualData.category!,
      date: manualData.date!,
    };
    onAddTransaction(newTransaction);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all animate-fade-in">
        {/* Header */}
        <div className="bg-indigo-600 p-6 flex justify-between items-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16 pointer-events-none"></div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">Nova Transação</h2>
            <p className="text-indigo-200 text-sm">Adicione gastos ou receitas</p>
          </div>
          <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-full transition-colors z-10">
            <i className="fa-solid fa-times text-xl"></i>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex p-2 bg-slate-50 border-b border-slate-100">
          <button
            className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all ${inputMode === 'ai' ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-100' : 'text-slate-500 hover:text-slate-700'}`}
            onClick={() => setInputMode('ai')}
          >
            <i className="fa-solid fa-wand-magic-sparkles mr-2"></i>
            IA Inteligente
          </button>
          <button
            className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all ${inputMode === 'manual' ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-100' : 'text-slate-500 hover:text-slate-700'}`}
            onClick={() => setInputMode('manual')}
          >
            <i className="fa-solid fa-pen mr-2"></i>
            Manual
          </button>
        </div>

        <div className="p-8">
          {inputMode === 'ai' ? (
            <form onSubmit={handleAiSubmit}>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Descreva em linguagem natural
                </label>
                <div className="relative">
                  <textarea
                    className="w-full p-4 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none bg-slate-50 focus:bg-white transition-all text-slate-700"
                    rows={4}
                    placeholder="Ex: Almoço no restaurante 45 reais hoje"
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                  ></textarea>
                  <div className="absolute bottom-3 right-3 text-slate-400 pointer-events-none">
                    <i className="fa-solid fa-microphone-slash"></i>
                  </div>
                </div>
                <div className="mt-3 flex items-start gap-2 text-xs text-slate-500 bg-blue-50 p-3 rounded-lg border border-blue-100">
                  <i className="fa-solid fa-circle-info text-blue-500 mt-0.5"></i>
                  <span>A IA detectará automaticamente a categoria, data, valor e tipo de transação.</span>
                </div>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-indigo-200 hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <i className="fa-solid fa-circle-notch fa-spin"></i> Processando...
                  </>
                ) : (
                  <>
                    Processar e Adicionar <i className="fa-solid fa-arrow-right"></i>
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleManualSubmit} className="space-y-5">
               <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Título</label>
                <input
                  type="text"
                  required
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                  value={manualData.title}
                  onChange={e => setManualData({...manualData, title: e.target.value})}
                  placeholder="Ex: Conta de Luz"
                />
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                   <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Valor (R$)</label>
                   <input
                    type="number"
                    step="0.01"
                    required
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all font-mono"
                    value={manualData.amount}
                    onChange={e => setManualData({...manualData, amount: Number(e.target.value)})}
                  />
                </div>
                <div>
                   <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Data</label>
                   <input
                    type="date"
                    required
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-slate-600"
                    value={manualData.date ? manualData.date.toString().split('T')[0] : ''}
                    onChange={e => setManualData({...manualData, date: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-5">
                 <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tipo</label>
                    <div className="relative">
                      <select
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none appearance-none"
                        value={manualData.type}
                        onChange={e => setManualData({...manualData, type: e.target.value as TransactionType})}
                      >
                        <option value={TransactionType.EXPENSE}>Despesa</option>
                        <option value={TransactionType.INCOME}>Receita</option>
                      </select>
                      <div className="absolute right-3 top-3.5 pointer-events-none text-slate-500">
                        <i className="fa-solid fa-chevron-down text-xs"></i>
                      </div>
                    </div>
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Categoria</label>
                    <div className="relative">
                      <select
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none appearance-none"
                        value={manualData.category}
                        onChange={e => setManualData({...manualData, category: e.target.value as Category})}
                      >
                        {Object.values(Category).map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                       <div className="absolute right-3 top-3.5 pointer-events-none text-slate-500">
                        <i className="fa-solid fa-chevron-down text-xs"></i>
                      </div>
                    </div>
                 </div>
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-bold mt-2 hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl"
              >
                Salvar Transação
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionForm;