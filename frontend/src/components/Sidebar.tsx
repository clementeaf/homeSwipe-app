import React from 'react';
import type { SidebarProps, SidebarItemProps } from '../types';

// Componente interno para renderizar items del sidebar
const SidebarItemComponent: React.FC<SidebarItemProps> = ({
  item,
  isActive = false,
  onClick,
  className = '',
  level = 0,
}) => {
  const handleClick = () => {
    if (item.isDisabled) return;
    
    if (onClick) {
      onClick(item);
    }
    
    if (item.onClick) {
      item.onClick();
    }
  };

  return (
    <div className={`${className}`}>
      {/* Item principal */}
      <div
        className={`
          flex items-center justify-center px-10 py-6 cursor-pointer 
          ${isActive ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100 text-gray-700'}
          ${item.isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${level > 0 ? 'ml-4' : ''}
        `}
        onClick={handleClick}
      >
        {/* Icono */}
        {item.icon && (
          <div className="flex-shrink-0">
            {typeof item.icon === 'string' ? (
              <span className="text-lg">{item.icon}</span>
            ) : (
              item.icon
            )}
          </div>
        )}
        
        {/* Label */}
        <span className="ml-3 text-sm font-medium truncate">
          {item.label}
        </span>

        {/* Badge */}
        {item.badge && (
          <span className="ml-auto inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500 text-white">
            {item.badge.text}
          </span>
        )}
      </div>
    </div>
  );
};

const Sidebar: React.FC<SidebarProps> = ({
  isOpen = true,
  onToggle,
  items,
  className = '',
  variant = 'default',
  position = 'left',
  width = 'w-72',
  showHeader = true,
  headerTitle = 'HomeSwipe',
  headerSubtitle = 'Real Estate Platform',
  onItemClick,
}) => {
  const handleItemClick = (item: any) => {
    if (onItemClick) {
      onItemClick(item);
    }
  };

  if (variant === 'overlay' && !isOpen) {
    return null;
  }

  return (
    <>
      {/* Overlay */}
      {variant === 'overlay' && isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40"
          onClick={onToggle}
        />
      )}

      {/* Sidebar estático */}
      <div
        className={`
          bg-gray-100 flex flex-col rounded-lg
          ${variant === 'overlay' ? 'fixed inset-y-0 z-50' : ''}
          ${position === 'right' ? 'right-0' : 'left-0'}
          ${width}
          ${className}
        `}
      >
        {/* Header */}
        {showHeader && (
          <div className="flex items-center justify-center p-4">
            <div className="text-center">
              <h2 className="text-lg font-semibold text-gray-900 truncate">
                {headerTitle}
              </h2>
              {headerSubtitle && (
                <p className="text-sm text-gray-500 truncate">
                  {headerSubtitle}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Contenido del sidebar */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {items.map((item) => (
            <SidebarItemComponent
              key={item.id}
              item={item}
              isActive={item.isActive}
              onClick={handleItemClick}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="p-4">
          <div className="text-xs text-gray-500 text-center">
            HomeSwipe v1.0.0
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar; 