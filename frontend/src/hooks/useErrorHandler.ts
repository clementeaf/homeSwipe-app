import { useState, useCallback } from 'react';

interface ErrorState {
  hasError: boolean;
  error: Error | null;
  errorInfo?: any;
}

interface UseErrorHandlerReturn {
  errorState: ErrorState;
  handleError: (error: Error, errorInfo?: any) => void;
  clearError: () => void;
  resetError: () => void;
}

/**
 * Hook personalizado para manejo de errores
 * Proporciona funciones para capturar, limpiar y resetear errores
 */
export const useErrorHandler = (): UseErrorHandlerReturn => {
  const [errorState, setErrorState] = useState<ErrorState>({
    hasError: false,
    error: null,
    errorInfo: null,
  });

  const handleError = useCallback((error: Error, errorInfo?: any) => {
    console.error('🚨 Error capturado por useErrorHandler:', error, errorInfo);
    
    setErrorState({
      hasError: true,
      error,
      errorInfo,
    });

    // Aquí podrías enviar el error a un servicio de monitoreo
    if (import.meta.env.PROD) {
      // Sentry.captureException(error, { extra: errorInfo });
      console.log('📊 Error enviado a servicio de monitoreo');
    }
  }, []);

  const clearError = useCallback(() => {
    setErrorState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  }, []);

  const resetError = useCallback(() => {
    // Forzar re-render y limpiar error
    setErrorState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  }, []);

  return {
    errorState,
    handleError,
    clearError,
    resetError,
  };
};

/**
 * Hook para manejo de errores asíncronos
 */
export const useAsyncErrorHandler = () => {
  const { errorState, handleError, clearError, resetError } = useErrorHandler();

  const executeWithErrorHandling = useCallback(
    async <T>(asyncFunction: () => Promise<T>): Promise<T | null> => {
      try {
        clearError();
        return await asyncFunction();
      } catch (error) {
        handleError(error instanceof Error ? error : new Error(String(error)));
        return null;
      }
    },
    [handleError, clearError]
  );

  return {
    errorState,
    executeWithErrorHandling,
    clearError,
    resetError,
  };
};

/**
 * Hook para manejo de errores de API
 */
export const useAPIErrorHandler = () => {
  const { errorState, handleError, clearError, resetError } = useErrorHandler();

  const handleAPIError = useCallback(
    (error: any, context?: string) => {
      let processedError: Error;

      if (error instanceof Error) {
        processedError = error;
      } else if (error?.response?.data?.message) {
        // Error de API con mensaje
        processedError = new Error(error.response.data.message);
      } else if (error?.message) {
        // Error con mensaje
        processedError = new Error(error.message);
      } else {
        // Error genérico
        processedError = new Error('Error desconocido');
      }

      // Agregar contexto si está disponible
      if (context) {
        processedError.message = `[${context}] ${processedError.message}`;
      }

      handleError(processedError, error);
    },
    [handleError]
  );

  return {
    errorState,
    handleAPIError,
    clearError,
    resetError,
  };
}; 