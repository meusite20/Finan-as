import React, { useState } from 'react';
import { Transaction } from '../types';
import { generateMonthlyReport } from '../services/geminiService';

interface AnalysisProps {
  transactions: Transaction[];
}

const Analysis: React.FC<AnalysisProps> = ({ transactions }) => {
  const [report, setReport] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateReport = async () => {
    setIsLoading(true);
    const result = await generateMonthlyReport(transactions);
    setReport(result);
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Análise Inteligente</h1>
          <p className="text-slate-500">Detecte padrões e encontre oportunidades de economia.</p>
        </div>
      </div>

      {!report && !isLoading && (
         <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-8 text-center text-white shadow-xl">
            <i className="fa-solid fa-wand-magic-sparkles text-5xl mb-4 opacity-80"></i>
            <h2 className="text-2xl font-bold mb-2">Gerar Relatório Completo</h2>
            <p className="mb-6 opacity-90 max-w-lg mx-auto">
               A IA analisará todas as suas transações recentes para identificar gargalos, categorias com gastos excessivos e criará um plano de ação.
            </p>
            <button 
               onClick={handleGenerateReport}
               className="bg-white text-indigo-600 px-6 py-3 rounded-full font-bold hover:bg-opacity-90 transition shadow-lg"
            >
               Iniciar Análise Agora
            </button>
         </div>
      )}

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-slate-100">
           <i className="fa-solid fa-circle-notch fa-spin text-4xl text-indigo-600 mb-4"></i>
           <p className="text-slate-600 font-medium">Analisando dados financeiros...</p>
           <p className="text-slate-400 text-sm">Isso pode levar alguns segundos.</p>
        </div>
      )}

      {report && (
         <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8 animate-fade-in">
            <div className="flex justify-between items-center mb-6 pb-6 border-b border-slate-100">
               <h3 className="text-xl font-bold text-slate-800">Relatório Mensal</h3>
               <button onClick={() => setReport(null)} className="text-slate-400 hover:text-slate-600">
                  <i className="fa-solid fa-redo mr-2"></i> Nova Análise
               </button>
            </div>
            
            <div className="prose prose-slate max-w-none">
               {/* Simple renderer for markdown-like structure */}
               {report.split('\n').map((line, idx) => {
                  if (line.startsWith('###')) return <h3 key={idx} className="text-lg font-bold text-indigo-700 mt-4 mb-2">{line.replace('###', '')}</h3>;
                  if (line.startsWith('##')) return <h2 key={idx} className="text-xl font-bold text-slate-800 mt-6 mb-3 border-l-4 border-indigo-500 pl-3">{line.replace('##', '')}</h2>;
                  if (line.startsWith('**')) return <p key={idx} className="font-bold my-2">{line.replace(/\*\*/g, '')}</p>;
                  if (line.startsWith('- ')) return <li key={idx} className="ml-4 text-slate-600 my-1">{line.replace('- ', '')}</li>;
                  return <p key={idx} className="text-slate-600 my-2 leading-relaxed">{line}</p>;
               })}
            </div>
         </div>
      )}
    </div>
  );
};

export default Analysis;