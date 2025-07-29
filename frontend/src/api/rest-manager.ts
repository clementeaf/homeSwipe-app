import { httpClient } from './http-client';
import { apiDiscovery } from './discovery';
import type { 
  APIRoute,
  UsersResponse, 
  StatusResponse, 
  HealthResponse, 
  DiscoveryResponse,
  User 
} from '../types';

/**
 * Gestor de Rutas RESTful
 * Se integra con el sistema de descubrimiento automático
 */
class RESTfulManager {
  private routeCache: Map<string, APIRoute> = new Map();
  private lastDiscoveryUpdate: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

  /**
   * Obtiene una ruta del cache o del discovery
   */
  private async getRoute(routeName: string): Promise<APIRoute | null> {
    const now = Date.now();
    
    // Verificar si necesitamos actualizar el cache
    if (now - this.lastDiscoveryUpdate > this.CACHE_DURATION) {
      try {
        const discovery = await apiDiscovery.getDiscovery();
        this.routeCache.clear();
        
        // Actualizar cache con las rutas del discovery
        Object.entries(discovery.routes).forEach(([key, route]) => {
          this.routeCache.set(key, route);
        });
        
        this.lastDiscoveryUpdate = now;
        console.log('🔄 Cache de rutas actualizado');
      } catch (error) {
        console.warn('⚠️ No se pudo actualizar el cache de rutas:', error);
      }
    }
    
    return this.routeCache.get(routeName) || null;
  }

  /**
   * Construye una URL completa para una ruta
   */
  private async buildUrl(routeName: string, params?: Record<string, string>): Promise<string> {
    const route = await this.getRoute(routeName);
    if (!route) {
      throw new Error(`Ruta '${routeName}' no encontrada en el discovery`);
    }

    let url = route.path;
    
    // Agregar parámetros de query si existen
    if (params) {
      const searchParams = new URLSearchParams(params);
      url += `?${searchParams.toString()}`;
    }
    
    return url;
  }

  /**
   * Realiza una petición GET
   */
  async get<T = any>(routeName: string, params?: Record<string, string>): Promise<T> {
    const url = await this.buildUrl(routeName, params);
    return httpClient.get<T>(url);
  }

  /**
   * Realiza una petición POST
   */
  async post<T = any>(routeName: string, data?: any, params?: Record<string, string>): Promise<T> {
    const url = await this.buildUrl(routeName, params);
    return httpClient.post<T>(url, data);
  }

  /**
   * Realiza una petición PUT
   */
  async put<T = any>(routeName: string, data?: any, params?: Record<string, string>): Promise<T> {
    const url = await this.buildUrl(routeName, params);
    return httpClient.put<T>(url, data);
  }

  /**
   * Realiza una petición DELETE
   */
  async delete<T = any>(routeName: string, params?: Record<string, string>): Promise<T> {
    const url = await this.buildUrl(routeName, params);
    return httpClient.delete<T>(url);
  }

  /**
   * Realiza una petición PATCH
   */
  async patch<T = any>(routeName: string, data?: any, params?: Record<string, string>): Promise<T> {
    const url = await this.buildUrl(routeName, params);
    return httpClient.patch<T>(url, data);
  }

  /**
   * Limpia el cache
   */
  clearCache(): void {
    this.routeCache.clear();
    this.lastDiscoveryUpdate = 0;
  }

  /**
   * Obtiene todas las rutas disponibles
   */
  async getAvailableRoutes(): Promise<APIRoute[]> {
    const discovery = await apiDiscovery.getDiscovery();
    return Object.values(discovery.routes);
  }

  /**
   * Verifica si una ruta está disponible
   */
  async isRouteAvailable(routeName: string): Promise<boolean> {
    const route = await this.getRoute(routeName);
    return route !== null;
  }
}

// Instancia singleton
export const restManager = new RESTfulManager();

// Hooks específicos para rutas comunes
export const useStatus = () => ({
  get: () => restManager.get<StatusResponse>('_api_status_1'),
  post: (data: any) => restManager.post<StatusResponse>('_api_status_1', data),
});

export const useHealth = () => ({
  get: () => restManager.get<HealthResponse>('_api_health_2'),
  post: (data: any) => restManager.post<HealthResponse>('_api_health_2', data),
});

export const useUsers = () => ({
  get: () => restManager.get<UsersResponse>('_api_users_3'),
  post: (data: User) => restManager.post<UsersResponse>('_api_users_4', data),
  create: (user: User) => restManager.post<UsersResponse>('_api_users_4', user),
});

export const useDiscovery = () => ({
  get: () => restManager.get<DiscoveryResponse>('discovery'),
});

export const useRoute = (routeName: string) => ({
  get: <T = any>(params?: Record<string, string>) => restManager.get<T>(routeName, params),
  post: <T = any>(data?: any, params?: Record<string, string>) => restManager.post<T>(routeName, data, params),
  put: <T = any>(data?: any, params?: Record<string, string>) => restManager.put<T>(routeName, data, params),
  delete: <T = any>(params?: Record<string, string>) => restManager.delete<T>(routeName, params),
  patch: <T = any>(data?: any, params?: Record<string, string>) => restManager.patch<T>(routeName, data, params),
}); 