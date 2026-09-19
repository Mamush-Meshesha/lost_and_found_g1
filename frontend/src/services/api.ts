import { IItem, IMatchResult, IUser } from '../types';

const API_BASE = 'http://localhost:5000/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const api = {
  // Auth
  async login(email: string, password: string) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return res.json();
  },

  async register(userName: string, email: string, password: string) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userName, email, password }),
    });
    return res.json();
  },

  async getDemoUsers(): Promise<{ success: boolean; users: IUser[] }> {
    const res = await fetch(`${API_BASE}/auth/users`);
    return res.json();
  },

  // Items
  async getItems(params: {
    q?: string;
    category?: string;
    type?: string;
    location?: string;
    sort?: string;
  }): Promise<{ success: boolean; count: number; items: IItem[] }> {
    const query = new URLSearchParams();
    if (params.q) query.append('q', params.q);
    if (params.category && params.category !== 'ALL') query.append('category', params.category);
    if (params.type && params.type !== 'ALL') query.append('type', params.type);
    if (params.location) query.append('location', params.location);
    if (params.sort) query.append('sort', params.sort);

    const res = await fetch(`${API_BASE}/items?${query.toString()}`);
    return res.json();
  },

  async getItemById(id: string): Promise<{ success: boolean; item: IItem }> {
    const res = await fetch(`${API_BASE}/items/${id}`);
    return res.json();
  },

  async getItemMatches(id: string): Promise<{ success: boolean; count: number; matches: IMatchResult[] }> {
    const res = await fetch(`${API_BASE}/items/${id}/matches`);
    return res.json();
  },

  async createItem(itemData: Partial<IItem>): Promise<{ success: boolean; message: string; item: IItem }> {
    const res = await fetch(`${API_BASE}/items`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(itemData),
    });
    return res.json();
  },

  async updateItem(id: string, itemData: Partial<IItem>): Promise<{ success: boolean; message: string; item: IItem }> {
    const res = await fetch(`${API_BASE}/items/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(itemData),
    });
    return res.json();
  },

  async deleteItem(id: string): Promise<{ success: boolean; message: string; id: string }> {
    const res = await fetch(`${API_BASE}/items/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return res.json();
  },
  async getCategories(): Promise<{ success: boolean; categories: string[] }> {
    const res = await fetch(`${API_BASE}/categories`);
    return res.json();
  }
};
