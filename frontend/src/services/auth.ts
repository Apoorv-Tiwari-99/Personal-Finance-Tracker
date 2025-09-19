import { User } from '@/types';

export const authService = {
  login: async (email: string, password: string): Promise<{ user: User; token: string }> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    if (!data.success || !data.data) {
      throw new Error('Invalid response from server');
    }

    return {
      user: data.data,
      token: data.token,
    };
  },

  register: async (name: string, email: string, password: string): Promise<{ user: User; token: string }> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }

    if (!data.success || !data.data) {
      throw new Error('Invalid response from server');
    }

    return {
      user: data.data,
      token: data.token,
    };
  },

  getMe: async (token: string): Promise<User> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch user data');
    }

    if (!data.success || !data.data) {
      throw new Error('Invalid response from server');
    }

    return data.data;
  },
};