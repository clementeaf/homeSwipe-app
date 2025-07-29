// API Services Index
// Exporta todos los servicios de API para facilitar las importaciones

// Discovery Service
export { apiDiscovery, useAPIDiscovery } from './discovery';
export type { APIDiscovery } from './discovery';

// HTTP Client
export { httpClient } from './http-client';

// Types (centralizados)
export type {
  APIRoute,
  APIResponse,
  User,
  UsersResponse,
  StatusResponse,
  HealthResponse,
  DiscoveryResponse
} from './types';

// RESTful Manager
export {
  restManager,
  useStatus,
  useHealth,
  useUsers,
  useDiscovery,
  useRoute
} from './rest-manager';

// Status Query Hooks (useQuery)
export {
  useStatusQuery,
  useStatusQueryWithOptions,
  useStatusQueryRealtime
} from './status-query'; 