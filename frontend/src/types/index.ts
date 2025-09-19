export interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
  }
  
  export interface Expense {
    _id?: string;
    amount: number;
    category: string;
    date: string;
    paymentMethod: string;
    notes?: string;
    userId?: string;
    createdAt?: string;
    updatedAt?: string;
  }
  
  export interface Budget {
    _id?: string;
    category: string;
    monthlyLimit: number;
    month: number;
    year: number;
    userId?: string;
    spent?: number;
    percentage?: number;
    status?: 'under' | 'warning' | 'over';
  }
  
  export interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    loading: boolean;
  }
  
  export interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    data?: T;
  }
  
  export interface MonthlyReport {
    _id: string;
    month: number; // 1–12
    year: number;
    totalSpent: number;
    topCategory?: {
      category: string;
      amount: number;
    };
    overbudgetCategories?: {
      category: string;
      spent: number;
      budgeted: number;
    }[];
    createdAt?: string;
  }
  