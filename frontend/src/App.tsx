import './App.css';
import { useStatusQuery } from './api/status-query';
import ErrorBoundary from './components/ErrorBoundary';
import DisplayLayout from './components/DisplayLayout';
import { LookingForForm } from './components/LookingFor';
import { useErrorHandler } from './hooks/useErrorHandler';
import { useSidebarItemFactory } from './hooks/useSidebar';
import type { SidebarItem } from './types';

function AppContent() {
  const { error } = useStatusQuery();
  const { errorState, handleError } = useErrorHandler();
  const { createSearchItem } = useSidebarItemFactory();

  // Manejar errores de la query
  if (error && !errorState.hasError) {
    handleError(error);
  }

  // Crear items del sidebar
  const sidebarItems: SidebarItem[] = [
    createSearchItem('Lo que busco'),
  ];

  const handleSidebarItemClick = (item: SidebarItem) => {
    console.log('Item clickeado:', item.label);
    // Aquí puedes agregar la lógica de navegación
  };

  return (
    <DisplayLayout
      sidebarItems={sidebarItems}
      onSidebarItemClick={handleSidebarItemClick}
    >
      {/* Contenido principal */}
      <div className="w-full h-full flex flex-col">
        <LookingForForm />
      </div>
    </DisplayLayout>
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
