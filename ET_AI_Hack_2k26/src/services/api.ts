// ============================================================
// ISIP — API Client
// Centralized HTTP client for backend communication
// ============================================================

const API_BASE = 'http://localhost:5000/api';

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  summary?: any;
  timestamp: string;
}

class ApiClient {
  private getToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  private getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  private setTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  clearTokens() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  private async refreshAccessToken(): Promise<boolean> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) return false;

    try {
      const res = await fetch(`${API_BASE}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });
      if (!res.ok) return false;
      const json: ApiResponse = await res.json();
      if (json.success && json.data?.accessToken) {
        this.setTokens(json.data.accessToken, json.data.refreshToken);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  async request<T = any>(path: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    let res = await fetch(`${API_BASE}${path}`, { ...options, headers });

    // Try token refresh on 401
    if (res.status === 401 && token) {
      const refreshed = await this.refreshAccessToken();
      if (refreshed) {
        headers['Authorization'] = `Bearer ${this.getToken()}`;
        res = await fetch(`${API_BASE}${path}`, { ...options, headers });
      } else {
        this.clearTokens();
        window.location.reload();
        throw new Error('Session expired');
      }
    }

    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.message || `Request failed: ${res.status}`);
    }
    return json;
  }

  get<T = any>(path: string) {
    return this.request<T>(path, { method: 'GET' });
  }

  post<T = any>(path: string, body?: any) {
    return this.request<T>(path, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  put<T = any>(path: string, body?: any) {
    return this.request<T>(path, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  patch<T = any>(path: string, body?: any) {
    return this.request<T>(path, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  del<T = any>(path: string) {
    return this.request<T>(path, { method: 'DELETE' });
  }
}

export const api = new ApiClient();

// ── Auth API ─────────────────────────────────────────────
export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (data: { name: string; email: string; username: string; password: string }) =>
    api.post('/auth/register', data),
  me: () => api.get('/auth/me'),
  refresh: (refreshToken: string) =>
    api.post('/auth/refresh', { refreshToken }),
  logout: () => api.post('/auth/logout'),
};

// ── Dashboard API ────────────────────────────────────────
export const dashboardApi = {
  getKPIs: () => api.get('/dashboard'),
  getOverview: () => api.get('/dashboard/overview'),
  getStatistics: () => api.get('/dashboard/statistics'),
  getCharts: () => api.get('/dashboard/charts'),
};

// ── Sensors API ──────────────────────────────────────────
export const sensorsApi = {
  getAll: (params?: string) => api.get(`/sensors${params ? `?${params}` : ''}`),
  getById: (id: string) => api.get(`/sensors/${id}`),
  getHealth: (id: string) => api.get(`/sensors/${id}/health`),
};

// ── Workers API ──────────────────────────────────────────
export const workersApi = {
  getAll: (params?: string) => api.get(`/workers${params ? `?${params}` : ''}`),
  getById: (id: string) => api.get(`/workers/${id}`),
  getMovements: (id: string) => api.get(`/workers/${id}/movements`),
};

// ── Permits API ──────────────────────────────────────────
export const permitsApi = {
  getAll: (params?: string) => api.get(`/permits${params ? `?${params}` : ''}`),
  getById: (id: string) => api.get(`/permits/${id}`),
  approve: (id: string) => api.post(`/permits/${id}/approve`),
  reject: (id: string) => api.post(`/permits/${id}/reject`),
  suspend: (id: string) => api.post(`/permits/${id}/suspend`),
  getHistory: (params?: string) => api.get(`/permits/history${params ? `?${params}` : ''}`),
};

// ── Alerts API ───────────────────────────────────────────
export const alertsApi = {
  getAll: (params?: string) => api.get(`/alerts${params ? `?${params}` : ''}`),
  getById: (id: string) => api.get(`/alerts/${id}`),
  acknowledge: (id: string) => api.post(`/alerts/${id}/acknowledge`),
  resolve: (id: string) => api.post(`/alerts/${id}/resolve`),
  getHistory: (params?: string) => api.get(`/alerts/history${params ? `?${params}` : ''}`),
};

// ── Timeline API ─────────────────────────────────────────
export const timelineApi = {
  getAll: (params?: string) => api.get(`/timeline${params ? `?${params}` : ''}`),
  getById: (id: string) => api.get(`/timeline/${id}`),
};

// ── Zones API ────────────────────────────────────────────
export const zonesApi = {
  getAll: (params?: string) => api.get(`/zones${params ? `?${params}` : ''}`),
  getById: (id: string) => api.get(`/zones/${id}`),
};

// ── Equipment API ────────────────────────────────────────
export const equipmentApi = {
  getAll: (params?: string) => api.get(`/equipment${params ? `?${params}` : ''}`),
  getById: (id: string) => api.get(`/equipment/${id}`),
};

export default api;
