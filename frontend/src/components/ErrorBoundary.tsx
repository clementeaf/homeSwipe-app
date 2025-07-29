import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetKey?: string | number;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Actualiza el estado para que el siguiente render muestre la UI de fallback
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log del error
    console.error('🚨 ErrorBoundary capturó un error:', error, errorInfo);
    
    // Actualizar estado con información del error
    this.setState({
      error,
      errorInfo,
    });

    // Callback personalizado para manejo externo
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Aquí podrías enviar el error a un servicio de monitoreo
    // como Sentry, LogRocket, etc.
    this.logErrorToService();
  }

  private logErrorToService() {
    // Implementación para enviar errores a servicios externos
    try {
      // Ejemplo: enviar a servicio de monitoreo
      if (import.meta.env.PROD) {
        // Sentry.captureException(error, { extra: errorInfo });
        console.log('📊 Error enviado a servicio de monitoreo');
      }
    } catch (loggingError) {
      console.error('Error enviando error a servicio:', loggingError);
    }
  }

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  private handleRetry = () => {
    // Forzar re-render del componente hijo
    this.forceUpdate();
    this.handleReset();
  };

  render() {
    if (this.state.hasError) {
      // UI de fallback personalizada
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // UI de fallback por defecto
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
            <div className="text-center">
              {/* Icono de error */}
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>

              {/* Título */}
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Algo salió mal
              </h3>

              {/* Descripción */}
              <p className="text-sm text-gray-500 mb-6">
                Ha ocurrido un error inesperado. Nuestro equipo ha sido notificado.
              </p>

              {/* Información del error (solo en desarrollo) */}
              {import.meta.env.DEV && this.state.error && (
                <details className="mb-4 text-left">
                  <summary className="text-sm font-medium text-gray-700 cursor-pointer mb-2">
                    Detalles del error (solo desarrollo)
                  </summary>
                  <div className="bg-gray-100 p-3 rounded text-xs font-mono text-gray-800 overflow-auto max-h-32">
                    <div className="mb-2">
                      <strong>Error:</strong> {this.state.error.message}
                    </div>
                    {this.state.errorInfo && (
                      <div>
                        <strong>Stack:</strong>
                        <pre className="whitespace-pre-wrap mt-1">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                  </div>
                </details>
              )}

              {/* Botones de acción */}
              <div className="flex space-x-3">
                <button
                  onClick={this.handleRetry}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Reintentar
                </button>
                <button
                  onClick={this.handleReset}
                  className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Reiniciar
                </button>
              </div>

              {/* Información adicional */}
              <div className="mt-4 text-xs text-gray-400">
                <p>Si el problema persiste, contacta soporte técnico.</p>
                <p className="mt-1">
                  Error ID: {this.state.error?.name}-{Date.now()}
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 