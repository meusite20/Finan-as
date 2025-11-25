import { GoogleGenAI, Type } from "@google/genai";
import { Transaction, Category, TransactionType } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const MODEL_FAST = 'gemini-2.5-flash';

// --- Automatic Transaction Classification ---
export const parseTransactionInput = async (input: string): Promise<Partial<Transaction>> => {
  if (!apiKey) {
    console.warn("API Key missing, returning default");
    return { title: input, amount: 0, category: Category.OTHER, type: TransactionType.EXPENSE, date: new Date().toISOString() };
  }

  try {
    const response = await ai.models.generateContent({
      model: MODEL_FAST,
      contents: `Analise o seguinte texto de entrada financeira e extraia os dados em JSON.
      Entrada: "${input}"
      Hoje é: ${new Date().toLocaleDateString('pt-BR')}
      
      Regras:
      1. Identifique se é RECEITA (INCOME) ou DESPESA (EXPENSE).
      2. Categorize usando uma destas: Alimentação, Transporte, Moradia, Saúde, Lazer, Educação, Investimentos, Salário, Compras, Contas, Outros.
      3. Extraia o valor numérico. Se não houver, tente estimar ou coloque 0.
      4. Extraia uma data ISO. Se for 'ontem', calcule. Se não mencionar, use hoje.
      5. Crie um título curto e claro.
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            amount: { type: Type.NUMBER },
            type: { type: Type.STRING, enum: ['INCOME', 'EXPENSE'] },
            category: { type: Type.STRING },
            date: { type: Type.STRING },
          },
          required: ["title", "amount", "type", "category", "date"]
        }
      }
    });

    const data = JSON.parse(response.text || '{}');
    // Map string type back to Enum
    const mappedType = data.type === 'INCOME' ? TransactionType.INCOME : TransactionType.EXPENSE;
    
    return {
      title: data.title,
      amount: data.amount,
      type: mappedType,
      category: data.category,
      date: data.date
    };

  } catch (error) {
    console.error("Error parsing transaction with Gemini:", error);
    // Fallback
    return {
      title: input,
      amount: 0,
      type: TransactionType.EXPENSE,
      category: Category.OTHER,
      date: new Date().toISOString()
    };
  }
};

// --- Financial Advisor Chat ---
export const getFinancialAdvice = async (
  history: Transaction[], 
  userProfile: any, 
  userMessage: string
): Promise<string> => {
  if (!apiKey) return "Por favor, configure sua chave de API para receber conselhos.";

  // Summarize data for context (to save tokens)
  const totalIncome = history.filter(t => t.type === TransactionType.INCOME).reduce((acc, t) => acc + t.amount, 0);
  const totalExpense = history.filter(t => t.type === TransactionType.EXPENSE).reduce((acc, t) => acc + t.amount, 0);
  const recentTransactions = history.slice(0, 10).map(t => `${t.date}: ${t.title} (${t.amount})`).join('\n');

  const context = `
    Você é o FinAI, um assistente financeiro pessoal empático, inteligente e organizado.
    Dados do Usuário:
    - Renda Mensal Declarada: R$ ${userProfile.monthlyIncome}
    - Meta de Economia: R$ ${userProfile.savingsGoal}
    - Receitas Totais (Histórico): R$ ${totalIncome}
    - Despesas Totais (Histórico): R$ ${totalExpense}
    - Saldo Atual: R$ ${totalIncome - totalExpense}
    
    Transações Recentes:
    ${recentTransactions}

    Responda à pergunta do usuário de forma clara, prática e amigável. Use formatação Markdown (negrito, listas) para facilitar a leitura.
    Se o usuário perguntar sobre cortes, analise os gastos. Se perguntar conceitos, explique de forma simples.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_FAST,
      contents: [
        { role: 'user', parts: [{ text: context + "\n\nPergunta do usuário: " + userMessage }] }
      ],
      config: {
        systemInstruction: "Seja um consultor financeiro brasileiro. Use Reais (R$). Seja motivador mas realista.",
      }
    });

    return response.text || "Desculpe, não consegui processar sua solicitação no momento.";
  } catch (error) {
    console.error("Error in advice:", error);
    return "Ocorreu um erro ao consultar o assistente inteligente.";
  }
};

// --- Deep Analysis Report ---
export const generateMonthlyReport = async (transactions: Transaction[]): Promise<string> => {
  if (!apiKey) return "API Key necessária para gerar relatórios.";

  const txData = JSON.stringify(transactions);

  try {
    const response = await ai.models.generateContent({
      model: MODEL_FAST,
      contents: `Gere um relatório financeiro detalhado em Markdown com base nestas transações JSON: ${txData}.
      
      O relatório deve conter:
      1. **Resumo do Período**: Total gasto vs ganho.
      2. **Análise de Categorias**: Onde o usuário gastou mais.
      3. **Padrões Identificados**: Gastos recorrentes ou supérfluos.
      4. **Dicas de Otimização**: 3 sugestões concretas para economizar.
      5. **Conclusão**: Uma frase motivadora sobre a saúde financeira.
      
      Use ícones/emojis para deixar visualmente agradável.`,
    });
    return response.text || "Sem dados suficientes para análise.";
  } catch (error) {
    console.error(error);
    return "Erro ao gerar análise.";
  }
};
