import './App.css';
import { useStatusQuery } from './api/status-query';

function App() {
  const { data: statusData, isLoading, error } = useStatusQuery();

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
          <div style={{ color: '#dc2626' }}>
            ❌ Error de conexión: {error.message}
          </div>
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

export default App;
