// API Discovery Service
// Este servicio obtiene dinámicamente las rutas disponibles del backend

import type { APIRoute } from './types';

export interface APIDiscovery {
  message: string;
  timestamp: string;
  version: string;
  baseUrl: string;
  routes: {
    [key: string]: APIRoute;
  };
  environment: string;
  region: string;
  deployment: {
    timestamp: string;
    version: string;
  };
}

class APIDiscoveryService {
  private baseUrl: string;
  private discoveryCache: APIDiscovery | null = null;
  private lastFetch: number = 0;
  private cacheTimeout: number = 5 * 60 * 1000; // 5 minutos

  constructor() {
    // En desarrollo, usar la URL de AWS Lambda
    this.baseUrl = import.meta.env.VITE_API_BASE_URL || 
      'https://u00g8tjlrh.execute-api.us-east-1.amazonaws.com/dev';
  }

  /**
   * Obtiene la información de descubrimiento de la API
   */
  async getDiscovery(): Promise<APIDiscovery> {
    const now = Date.now();
    
    // Usar cache si está disponible y no ha expirado
    if (this.discoveryCache && (now - this.lastFetch) < this.cacheTimeout) {
      return this.discoveryCache;
    }

    try {
      const response = await fetch(`${this.baseUrl}/api/discovery`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const discovery = await response.json();
      
      // Actualizar cache
      this.discoveryCache = discovery;
      this.lastFetch = now;
      
      console.log('🔍 API Discovery actualizado:', discovery);
      
      return discovery;
    } catch (error) {
      console.error('❌ Error obteniendo API Discovery:', error);
      
      // Si hay cache disponible, usarlo aunque haya expirado
      if (this.discoveryCache) {
        console.warn('⚠️ Usando cache expirado de API Discovery');
        return this.discoveryCache;
      }
      
      throw error;
    }
  }

  /**
   * Obtiene una ruta específica por nombre
   */
  async getRoute(routeName: string): Promise<APIRoute | null> {
    const discovery = await this.getDiscovery();
    return discovery.routes[routeName] || null;
  }

  /**
   * Construye una URL completa para una ruta
   */
  async buildUrl(routeName: string, params?: Record<string, string>): Promise<string> {
    const route = await this.getRoute(routeName);
    if (!route) {
      throw new Error(`Ruta '${routeName}' no encontrada`);
    }

    let url = `${this.baseUrl}${route.path}`;
    
    // Agregar parámetros de query si existen
    if (params) {
      const searchParams = new URLSearchParams(params);
      url += `?${searchParams.toString()}`;
    }
    
    return url;
  }

  /**
   * Realiza una petición a una ruta específica
   */
  async request<T = any>(
    routeName: string, 
    options?: RequestInit,
    params?: Record<string, string>
  ): Promise<T> {
    const url = await this.buildUrl(routeName, params);
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Limpia el cache
   */
  clearCache(): void {
    this.discoveryCache = null;
    this.lastFetch = 0;
  }

  /**
   * Verifica si el backend está disponible
   */
  async isBackendAvailable(): Promise<boolean> {
    try {
      await this.getDiscovery();
      return true;
    } catch (error) {
      console.error('Backend no disponible:', error);
      return false;
    }
  }
}

// Instancia singleton
export const apiDiscovery = new APIDiscoveryService();

// Hooks para React (si se usa React Query)
export const useAPIDiscovery = () => {
  return {
    getDiscovery: () => apiDiscovery.getDiscovery(),
    getRoute: (routeName: string) => apiDiscovery.getRoute(routeName),
    buildUrl: (routeName: string, params?: Record<string, string>) => 
      apiDiscovery.buildUrl(routeName, params),
    request: <T = any>(
      routeName: string, 
      options?: RequestInit,
      params?: Record<string, string>
    ) => apiDiscovery.request<T>(routeName, options, params),
    isBackendAvailable: () => apiDiscovery.isBackendAvailable(),
    clearCache: () => apiDiscovery.clearCache(),
  };
}; 