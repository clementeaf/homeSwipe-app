import './App.css';
import { useStatusQuery } from './api/status-query';
import ErrorBoundary from './components/ErrorBoundary';
import ErrorDisplay from './components/ErrorDisplay';
import { useErrorHandler } from './hooks/useErrorHandler';

function AppContent() {
  const { data: statusData, isLoading, error } = useStatusQuery();
  const { errorState, handleError, clearError } = useErrorHandler();

  // Manejar errores de la query
  if (error && !errorState.hasError) {
    handleError(error);
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'white',
        margin: 0,
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>HomeSwipe</h1>
      
      {/* Estado del Backend */}
      <div style={{ textAlign: 'center' }}>
        {isLoading && (
          <div style={{ color: '#666' }}>
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
            Conectando con backend...
          </div>
        )}
        
        {error && (
          <ErrorDisplay
            error={error}
            variant="compact"
            onRetry={() => {
              clearError();
              // Forzar refetch de la query
              window.location.reload();
            }}
          />
        )}
        
        {statusData && (
          <div style={{ color: '#059669' }}>
            ✅ {statusData.status}
          </div>
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        console.error('🚨 Error capturado por ErrorBoundary:', error, errorInfo);
      }}
    >
      <AppContent />
    </ErrorBoundary>
  );
}

export default App;
