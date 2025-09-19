import { Budget } from '@/types';
import api from './api';

export const budgetsService = {
  getBudgets: async (params?: {
    month?: number;
    year?: number;
  }): Promise<Budget[]> => {
    const response = await api.get('/budgets', { params });
    return response.data.data;
  },

  getBudget: async (id: string): Promise<Budget> => {
    const response = await api.get(`/budgets/${id}`);
    return response.data.data;
  },

  createBudget: async (budgetData: Omit<Budget, '_id' | 'userId' | 'spent' | 'percentage' | 'status'>): Promise<Budget> => {
    const response = await api.post('/budgets', budgetData);
    return response.data.data;
  },

  updateBudget: async (id: string, budgetData: Partial<Budget>): Promise<Budget> => {
    const response = await api.put(`/budgets/${id}`, budgetData);
    return response.data.data;
  },

  deleteBudget: async (id: string): Promise<void> => {
    await api.delete(`/budgets/${id}`);
  },

  getBudgetAlerts: async (): Promise<any> => {
    const response = await api.get('/budgets/alerts');
    return response.data.data;
  },
};