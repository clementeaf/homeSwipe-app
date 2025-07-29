import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useStatusQuery } from './api/status-query';
import ErrorBoundary from './components/ErrorBoundary';
import DisplayLayout from './components/DisplayLayout';
import { LookingForView, MatchView } from './views';
import { useErrorHandler } from './hooks/useErrorHandler';
import { useSidebarItemFactory } from './hooks/useSidebar';
import type { SidebarItem } from './types';

function AppContent() {
  const { error } = useStatusQuery();
  const { errorState, handleError } = useErrorHandler();
  const { createSearchItem, createMatchItem } = useSidebarItemFactory();

  // Manejar errores de la query
  if (error && !errorState.hasError) {
    handleError(error);
  }

  // Crear items del sidebar
  const sidebarItems: SidebarItem[] = [
    createSearchItem('Lo que busco'),
    createMatchItem(),
  ];

  const handleSidebarItemClick = (item: SidebarItem) => {
    console.log('Item clickeado:', item.label);
    // Aquí puedes agregar la lógica de navegación
  };

  return (
    <Router>
      <DisplayLayout
        sidebarItems={sidebarItems}
        onSidebarItemClick={handleSidebarItemClick}
      >
        <Routes>
          <Route path="/looking-for" element={<LookingForView />} />
          <Route path="/match" element={<MatchView />} />
          <Route path="/" element={<Navigate to="/looking-for" replace />} />
        </Routes>
      </DisplayLayout>
    </Router>
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
