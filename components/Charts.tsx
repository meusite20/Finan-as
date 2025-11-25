import React from 'react';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area
} from 'recharts';
import { Transaction, TransactionType, Category } from '../types';

interface ChartProps {
  transactions: Transaction[];
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

export const ExpenseByCategoryChart: React.FC<ChartProps> = ({ transactions }) => {
  const data = Object.values(Category).map(cat => {
    const total = transactions
      .filter(t => t.type === TransactionType.EXPENSE && t.category === cat)
      .reduce((sum, t) => sum + t.amount, 0);
    return { name: cat, value: total };
  }).filter(item => item.value > 0);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={5}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value: number) => `R$ ${value.toFixed(2)}`} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export const BalanceHistoryChart: React.FC<ChartProps> = ({ transactions }) => {
  // Simple logic to group by date (last 7 days active)
  const sortedTx = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  // Aggregate by day
  const dailyData: Record<string, { income: number; expense: number }> = {};
  sortedTx.forEach(t => {
    const dateStr = new Date(t.date).toLocaleDateString('pt-BR');
    if (!dailyData[dateStr]) dailyData[dateStr] = { income: 0, expense: 0 };
    if (t.type === TransactionType.INCOME) dailyData[dateStr].income += t.amount;
    else dailyData[dateStr].expense += t.amount;
  });

  const chartData = Object.keys(dailyData).map(date => ({
    date,
    Entradas: dailyData[date].income,
    Saídas: dailyData[date].expense
  })).slice(-10); // Last 10 days with activity

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
        <XAxis dataKey="date" tick={{fontSize: 12}} />
        <YAxis tick={{fontSize: 12}} />
        <Tooltip formatter={(value: number) => `R$ ${value.toFixed(2)}`} />
        <Legend />
        <Bar dataKey="Entradas" fill="#10b981" radius={[4, 4, 0, 0]} />
        <Bar dataKey="Saídas" fill="#ef4444" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};
