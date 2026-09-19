import {
  IAiMatchResult,
  ICategory,
  IItem,
  IProof,
  ISearchResponse,
  IUser,
} from "../types";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

const getHeaders = (json = true): HeadersInit => {
  const token = localStorage.getItem("token");
  const headers: Record<string, string> = {};
  if (json) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
};

async function parseJson<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message =
      (data as { message?: string }).message ||
      `Request failed (${res.status})`;
    throw new Error(message);
  }
  return data as T;
}

export const api = {
  async register(userName: string, email: string, password: string) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ userName, email, password }),
    });
    return parseJson<{ success: boolean; message: string }>(res);
  },

  async login(email: string, password: string) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ email, password }),
    });
    const data = await parseJson<{
      success: boolean;
      message: string;
      token: string;
      user: IUser;
    }>(res);
    if (data.token) localStorage.setItem("token", data.token);
    if (data.user) localStorage.setItem("user", JSON.stringify(data.user));
    return data;
  },

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getStoredUser(): IUser | null {
    try {
      const raw = localStorage.getItem("user");
      return raw ? (JSON.parse(raw) as IUser) : null;
    } catch {
      return null;
    }
  },

  async getCategories(): Promise<ICategory[]> {
    const res = await fetch(`${API_BASE}/categories`, {
      headers: getHeaders(false),
    });
    return parseJson<ICategory[]>(res);
  },

  async getItems(): Promise<IItem[]> {
    const res = await this.searchItems({});
    return res.data || [];
  },

  async getItemById(id: string): Promise<IItem> {
    const res = await fetch(`${API_BASE}/items/${id}`, {
      headers: getHeaders(false),
    });
    return parseJson<IItem>(res);
  },

  async createItem(form: FormData): Promise<IItem> {
    const res = await fetch(`${API_BASE}/items`, {
      method: "POST",
      headers: getHeaders(false),
      body: form,
    });
    return parseJson<IItem>(res);
  },

  async updateItem(id: string, form: FormData): Promise<IItem> {
    const res = await fetch(`${API_BASE}/items/${id}`, {
      method: "PATCH",
      headers: getHeaders(false),
      body: form,
    });
    return parseJson<IItem>(res);
  },

  async deleteItem(id: string): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/items/${id}`, {
      method: "DELETE",
      headers: getHeaders(false),
    });
    return parseJson<{ message: string }>(res);
  },

  async searchItems(params: {
    q?: string;
    categoryId?: string;
    status?: string;
    location?: string;
    sort?: string;
    ai?: boolean;
  }): Promise<ISearchResponse> {
    const query = new URLSearchParams();
    if (params.q) query.set("q", params.q);
    if (params.categoryId) query.set("categoryId", params.categoryId);
    if (params.status) query.set("status", params.status);
    if (params.location) query.set("location", params.location);
    if (params.sort) query.set("sort", params.sort);
    if (params.ai) query.set("ai", "true");

    const res = await fetch(`${API_BASE}/items?${query.toString()}`, {
      headers: getHeaders(false),
    });
    return parseJson<ISearchResponse>(res);
  },

  async submitProof(itemId: string, answer: string): Promise<IProof> {
    const res = await fetch(`${API_BASE}/items/${itemId}/proof`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ answer }),
    });
    const data = await parseJson<{ success: boolean; data: IProof }>(res);
    return data.data;
  },

  async getItemProofs(itemId: string): Promise<IProof[]> {
    const res = await fetch(`${API_BASE}/items/${itemId}/proof`, {
      headers: getHeaders(false),
    });
    const data = await parseJson<{
      success: boolean;
      count: number;
      data: IProof[];
    }>(res);
    return data.data;
  },

  async reviewProof(
    itemId: string,
    proofId: string,
    status: "accepted" | "rejected"
  ): Promise<IProof> {
    const res = await fetch(`${API_BASE}/items/${itemId}/proof/${proofId}`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify({ status }),
    });
    const data = await parseJson<{
      success: boolean;
      data: IProof;
      itemStatus?: string;
    }>(res);
    return data.data;
  },
};

export type { IAiMatchResult };
