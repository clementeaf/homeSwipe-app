import { useQuery } from '@tanstack/react-query';
import { httpClient } from './http-client';
import type { StatusResponse } from '../types';

// Función para obtener el status del backend
const fetchStatus = async (): Promise<StatusResponse> => {
  return httpClient.get<StatusResponse>('/api/status');
};

// Hook personalizado usando useQuery
export const useStatusQuery = () => {
  return useQuery({
    queryKey: ['status'],
    queryFn: fetchStatus,
    staleTime: 30000, // 30 segundos
    gcTime: 5 * 60 * 1000, // 5 minutos
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Hook para obtener el status con opciones personalizadas
export const useStatusQueryWithOptions = (options?: {
  enabled?: boolean;
  refetchInterval?: number;
  refetchOnWindowFocus?: boolean;
}) => {
  return useQuery({
    queryKey: ['status'],
    queryFn: fetchStatus,
    staleTime: 30000,
    gcTime: 5 * 60 * 1000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    ...options,
  });
};

// Hook para obtener el status en tiempo real (refetch cada 10 segundos)
export const useStatusQueryRealtime = () => {
  return useStatusQueryWithOptions({
    refetchInterval: 10000, // 10 segundos
    refetchOnWindowFocus: true,
  });
}; 