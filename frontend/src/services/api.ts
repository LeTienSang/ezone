export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export class ApiError extends Error {
  status: number;
  data: any;
  constructor(message: string, status: number, data: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  const isJson = response.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    // If 401 Unauthorized, automatically clear session and reload/redirect
    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    const message = (data && typeof data === 'object' && (data.message || data.error)) || response.statusText || 'Có lỗi xảy ra';
    throw new ApiError(message, response.status, data);
  }

  return data as T;
}

export const api = {
  getHeaders(isMultipart = false) {
    const headers: HeadersInit = {};
    if (!isMultipart) {
      headers['Content-Type'] = 'application/json';
    }
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  },

  async get<T>(path: string, options?: RequestInit): Promise<ApiResponse<T>> {
    const res = await fetch(path, {
      ...options,
      method: 'GET',
      headers: {
        ...this.getHeaders(),
        ...options?.headers,
      },
    });
    return handleResponse<ApiResponse<T>>(res);
  },

  async post<T>(path: string, body?: any, options?: RequestInit): Promise<ApiResponse<T>> {
    const res = await fetch(path, {
      ...options,
      method: 'POST',
      headers: {
        ...this.getHeaders(),
        ...options?.headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    return handleResponse<ApiResponse<T>>(res);
  },

  async put<T>(path: string, body?: any, options?: RequestInit): Promise<ApiResponse<T>> {
    const res = await fetch(path, {
      ...options,
      method: 'PUT',
      headers: {
        ...this.getHeaders(),
        ...options?.headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    return handleResponse<ApiResponse<T>>(res);
  },

  async patch<T>(path: string, body?: any, options?: RequestInit): Promise<ApiResponse<T>> {
    const res = await fetch(path, {
      ...options,
      method: 'PATCH',
      headers: {
        ...this.getHeaders(),
        ...options?.headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    return handleResponse<ApiResponse<T>>(res);
  },

  async delete<T>(path: string, options?: RequestInit): Promise<ApiResponse<T>> {
    const res = await fetch(path, {
      ...options,
      method: 'DELETE',
      headers: {
        ...this.getHeaders(),
        ...options?.headers,
      },
    });
    return handleResponse<ApiResponse<T>>(res);
  },

  async postForm<T>(path: string, formData: FormData, options?: RequestInit): Promise<ApiResponse<T>> {
    const res = await fetch(path, {
      ...options,
      method: 'POST',
      headers: {
        ...this.getHeaders(true),
        ...options?.headers,
      },
      body: formData,
    });
    return handleResponse<ApiResponse<T>>(res);
  },
};
