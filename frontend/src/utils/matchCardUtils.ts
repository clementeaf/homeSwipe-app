import React from 'react';
import type { ActionButton } from '../types';

// Función para crear los botones de acción
export const createActionButtons = (
  onPrevious: () => void,
  onReject: () => void,
  onLike: () => void,
  onView: () => void,
  onAccept: () => void,
  onNext: () => void
): ActionButton[] => [
  {
    id: 'previous',
    onClick: onPrevious,
    icon: (
      <svg className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
    ),
    label: 'Anterior'
  },
  {
    id: 'reject',
    onClick: onReject,
    icon: (
      <svg className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    label: 'Rechazar'
  },
  {
    id: 'like',
    onClick: onLike,
    icon: (
      <svg className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    label: 'Like'
  },
  {
    id: 'view',
    onClick: onView,
    icon: (
      <svg className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
    label: 'Ver'
  },
  {
    id: 'accept',
    onClick: onAccept,
    icon: (
      <svg className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    label: 'Aceptar'
  },
  {
    id: 'next',
    onClick: onNext,
    icon: (
      <svg className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    ),
    label: 'Siguiente'
  }
];

// Función para manejar la navegación de imágenes
export const handleImageNavigation = (
  currentIndex: number,
  totalImages: number,
  direction: 'next' | 'prev',
  setCurrentImageIndex: (index: number) => void
) => {
  if (direction === 'next') {
    setCurrentImageIndex(currentIndex === totalImages - 1 ? 0 : currentIndex + 1);
  } else {
    setCurrentImageIndex(currentIndex === 0 ? totalImages - 1 : currentIndex - 1);
  }
}; 