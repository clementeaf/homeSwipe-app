import React from 'react';

interface ErrorDisplayProps {
  error: Error | null;
  errorInfo?: any;
  onRetry?: () => void;
  onReset?: () => void;
  variant?: 'default' | 'compact' | 'inline';
  showDetails?: boolean;
  className?: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  errorInfo,
  onRetry,
  onReset,
  variant = 'default',
  showDetails = import.meta.env.DEV,
  className = '',
}) => {
  if (!error) return null;

  const isCompact = variant === 'compact';
  const isInline = variant === 'inline';

  if (isInline) {
    return (
      <div className={`text-red-600 text-sm ${className}`}>
        <span className="font-medium">Error:</span> {error.message}
        {onRetry && (
          <button
            onClick={onRetry}
            className="ml-2 text-blue-600 hover:text-blue-800 underline"
          >
            Reintentar
          </button>
        )}
      </div>
    );
  }

  if (isCompact) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-md p-3 ${className}`}>
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-medium text-red-800">
              {error.name || 'Error'}
            </h3>
            <p className="text-sm text-red-700 mt-1">{error.message}</p>
            {showDetails && errorInfo && (
              <details className="mt-2">
                <summary className="text-xs text-red-600 cursor-pointer">
                  Ver detalles
                </summary>
                <pre className="text-xs text-red-600 mt-1 whitespace-pre-wrap">
                  {errorInfo.componentStack || errorInfo}
                </pre>
              </details>
            )}
            {(onRetry || onReset) && (
              <div className="mt-2 flex space-x-2">
                {onRetry && (
                  <button
                    onClick={onRetry}
                    className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200"
                  >
                    Reintentar
                  </button>
                )}
                {onReset && (
                  <button
                    onClick={onReset}
                    className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200"
                  >
                    Reiniciar
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Variant default - Full error display
  return (
    <div className={`bg-red-50 border border-red-200 rounded-lg p-6 ${className}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg
            className="h-6 w-6 text-red-400"
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
        <div className="ml-3 flex-1">
          <h3 className="text-lg font-medium text-red-800">
            {error.name || 'Error inesperado'}
          </h3>
          <p className="text-sm text-red-700 mt-2">{error.message}</p>
          
          {showDetails && errorInfo && (
            <details className="mt-4">
              <summary className="text-sm font-medium text-red-600 cursor-pointer">
                Detalles técnicos
              </summary>
              <div className="mt-2 bg-red-100 p-3 rounded">
                <pre className="text-xs text-red-800 whitespace-pre-wrap overflow-auto max-h-32">
                  {errorInfo.componentStack || JSON.stringify(errorInfo, null, 2)}
                </pre>
              </div>
            </details>
          )}
          
          {(onRetry || onReset) && (
            <div className="mt-4 flex space-x-3">
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Reintentar
                </button>
              )}
              {onReset && (
                <button
                  onClick={onReset}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Reiniciar
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorDisplay; 