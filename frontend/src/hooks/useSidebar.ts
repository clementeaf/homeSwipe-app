import { useState, useCallback } from 'react';
import type { SidebarItem } from '../types';

interface UseSidebarReturn {
  isOpen: boolean;
  isCollapsed: boolean;
  activeItem: string | null;
  toggleSidebar: () => void;
  toggleCollapse: () => void;
  setActiveItem: (itemId: string) => void;
  closeSidebar: () => void;
  openSidebar: () => void;
}

/**
 * Hook personalizado para manejar el estado del sidebar
 */
export const useSidebar = (initialOpen = true, initialCollapsed = false): UseSidebarReturn => {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [isCollapsed, setIsCollapsed] = useState(initialCollapsed);
  const [activeItem, setActiveItemState] = useState<string | null>(null);

  const toggleSidebar = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const toggleCollapse = useCallback(() => {
    setIsCollapsed(prev => !prev);
  }, []);

  const setActiveItem = useCallback((itemId: string) => {
    setActiveItemState(itemId);
  }, []);

  const closeSidebar = useCallback(() => {
    setIsOpen(false);
  }, []);

  const openSidebar = useCallback(() => {
    setIsOpen(true);
  }, []);

  return {
    isOpen,
    isCollapsed,
    activeItem,
    toggleSidebar,
    toggleCollapse,
    setActiveItem,
    closeSidebar,
    openSidebar,
  };
};

/**
 * Hook para manejar items del sidebar con estado
 */
export const useSidebarItems = () => {
  const [items, setItems] = useState<SidebarItem[]>([]);

  const addItem = useCallback((item: SidebarItem) => {
    setItems(prev => [...prev, item]);
  }, []);

  const removeItem = useCallback((itemId: string) => {
    setItems(prev => prev.filter(item => item.id !== itemId));
  }, []);

  const updateItem = useCallback((itemId: string, updates: Partial<SidebarItem>) => {
    setItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, ...updates } : item
    ));
  }, []);

  const setItemsList = useCallback((newItems: SidebarItem[]) => {
    setItems(newItems);
  }, []);

  const getItemById = useCallback((itemId: string) => {
    return items.find(item => item.id === itemId);
  }, [items]);

  const setActiveItem = useCallback((itemId: string) => {
    setItems(prev => prev.map(item => ({
      ...item,
      isActive: item.id === itemId,
    })));
  }, []);

  return {
    items,
    addItem,
    removeItem,
    updateItem,
    setItemsList,
    getItemById,
    setActiveItem,
  };
};

/**
 * Hook para crear items del sidebar con iconos
 */
export const useSidebarItemFactory = () => {
  const createSearchItem = useCallback((label: string = 'Lo que busco'): SidebarItem => ({
    id: 'search',
    label,
    icon: '🔍',
    onClick: () => console.log('Búsqueda clickeada'),
  }), []);

  const createHomeItem = useCallback((): SidebarItem => ({
    id: 'home',
    label: 'Inicio',
    icon: '🏠',
    onClick: () => console.log('Inicio clickeado'),
  }), []);

  const createPropertiesItem = useCallback((): SidebarItem => ({
    id: 'properties',
    label: 'Propiedades',
    icon: '🏢',
    children: [
      {
        id: 'properties-list',
        label: 'Lista de propiedades',
        onClick: () => console.log('Lista de propiedades'),
      },
      {
        id: 'properties-map',
        label: 'Ver en mapa',
        onClick: () => console.log('Ver en mapa'),
      },
    ],
  }), []);

  const createFavoritesItem = useCallback((): SidebarItem => ({
    id: 'favorites',
    label: 'Favoritos',
    icon: '❤️',
    badge: {
      text: '3',
      variant: 'success' as const,
    },
    onClick: () => console.log('Favoritos clickeado'),
  }), []);

  return {
    createSearchItem,
    createHomeItem,
    createPropertiesItem,
    createFavoritesItem,
  };
}; 