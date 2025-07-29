// Tipos compartidos para la API
// Centraliza todos los tipos para evitar conflictos de importación

export interface APIRoute {
  path: string;
  method: string;
  description: string;
  example: string;
}

export interface APIResponse<T = any> {
  message?: string;
  timestamp?: string;
  data?: T;
  error?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface UsersResponse extends APIResponse {
  users: User[];
  total: number;
}

export interface StatusResponse extends APIResponse {
  status: string;
}

export interface HealthResponse extends APIResponse {
  status: string;
}

export interface DiscoveryResponse extends APIResponse {
  version: string;
  baseUrl: string;
  routes: Record<string, {
    path: string;
    method: string;
    description: string;
    example: string;
  }>;
  environment: string;
  region: string;
  deployment: {
    timestamp: string;
    version: string;
  };
} 