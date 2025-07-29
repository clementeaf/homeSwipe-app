// Cliente HTTP simple para las peticiones RESTful
// Configurado para consumir AWS Lambda endpoints

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  'https://u00g8tjlrh.execute-api.us-east-1.amazonaws.com/dev';

interface RequestConfig {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
}

class HTTPClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T = any>(url: string, config: RequestConfig = {}): Promise<T> {
    const fullURL = url.startsWith('http') ? url : `${this.baseURL}${url}`;
    
    const response = await fetch(fullURL, {
      method: config.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
      body: config.body ? JSON.stringify(config.body) : undefined,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async get<T = any>(url: string, params?: Record<string, string>): Promise<T> {
    let fullURL = url;
    if (params) {
      const searchParams = new URLSearchParams(params);
      fullURL += `?${searchParams.toString()}`;
    }
    return this.request<T>(fullURL, { method: 'GET' });
  }

  async post<T = any>(url: string, data?: any): Promise<T> {
    return this.request<T>(url, { 
      method: 'POST', 
      body: data 
    });
  }

  async put<T = any>(url: string, data?: any): Promise<T> {
    return this.request<T>(url, { 
      method: 'PUT', 
      body: data 
    });
  }

  async delete<T = any>(url: string): Promise<T> {
    return this.request<T>(url, { method: 'DELETE' });
  }

  async patch<T = any>(url: string, data?: any): Promise<T> {
    return this.request<T>(url, { 
      method: 'PATCH', 
      body: data 
    });
  }
}

// Instancia singleton del cliente HTTP
export const httpClient = new HTTPClient(BASE_URL);

// Re-exportar tipos desde el archivo centralizado
export type {
  APIResponse,
  User,
  UsersResponse,
  StatusResponse,
  HealthResponse,
  DiscoveryResponse
} from './types'; 