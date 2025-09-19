import { Expense } from '@/types';
import api from './api';

export const expensesService = {
  getExpenses: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    paymentMethod?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
  }): Promise<Expense[]> => {
    const response = await api.get('/expenses', { params });
    return response.data.data;
  },

  getExpense: async (id: string): Promise<Expense> => {
    const response = await api.get(`/expenses/${id}`);
    return response.data.data;
  },

  createExpense: async (expenseData: Omit<Expense, '_id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<Expense> => {
    const response = await api.post('/expenses', expenseData);
    return response.data.data;
  },

  updateExpense: async (id: string, expenseData: Partial<Expense>): Promise<Expense> => {
    const response = await api.put(`/expenses/${id}`, expenseData);
    return response.data.data;
  },

  deleteExpense: async (id: string): Promise<void> => {
    await api.delete(`/expenses/${id}`);
  },

  getExpenseSummary: async (): Promise<any> => {
    const response = await api.get('/expenses/stats/summary');
    return response.data.data;
  },
};