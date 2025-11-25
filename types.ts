export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE'
}

export enum Category {
  FOOD = 'Alimentação',
  TRANSPORT = 'Transporte',
  HOUSING = 'Moradia',
  HEALTH = 'Saúde',
  LEISURE = 'Lazer',
  EDUCATION = 'Educação',
  INVESTMENT = 'Investimentos',
  SALARY = 'Salário',
  OTHER = 'Outros',
  SHOPPING = 'Compras',
  BILLS = 'Contas'
}

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: Category | string;
  date: string; // ISO Date string
  description?: string;
}

export interface UserProfile {
  name: string;
  monthlyIncome: number;
  savingsGoal: number;
  plan: 'free' | 'premium';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface AnalysisReport {
  summary: string;
  savingsTips: string[];
  alertLevel: 'low' | 'medium' | 'high';
}