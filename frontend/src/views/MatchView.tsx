import React, { useState } from 'react';
import MatchCard from '../components/MatchCard';

// Datos de ejemplo para testing
const sampleProperties = [
  {
    id: '1',
    title: 'Casa moderna en Las Condes',
    location: 'Las Condes, Santiago',
    matchPercentage: 95,
    views: 1247,
    likes: 89,
    images: [
      {
        id: '1-1',
        url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500&h=300&fit=crop',
        alt: 'Fachada de la casa'
      },
      {
        id: '1-2',
        url: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=500&h=300&fit=crop',
        alt: 'Sala de estar'
      },
      {
        id: '1-3',
        url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=300&fit=crop',
        alt: 'Cocina moderna'
      }
    ]
  },
  {
    id: '2',
    title: 'Apartamento en Providencia',
    location: 'Providencia, Santiago',
    matchPercentage: 87,
    views: 892,
    likes: 67,
    images: [
      {
        id: '2-1',
        url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500&h=300&fit=crop',
        alt: 'Vista del apartamento'
      },
      {
        id: '2-2',
        url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500&h=300&fit=crop',
        alt: 'Balcón con vista'
      }
    ]
  }
];

const MatchView: React.FC = () => {
  const [currentPropertyIndex, setCurrentPropertyIndex] = useState(0);
  const [properties, setProperties] = useState(sampleProperties);

  const handleReject = (propertyId: string) => {
    console.log('Propiedad rechazada:', propertyId);
    // Aquí puedes agregar la lógica para rechazar la propiedad
    // Por ahora solo avanzamos al siguiente
    if (currentPropertyIndex < properties.length - 1) {
      setCurrentPropertyIndex(currentPropertyIndex + 1);
    }
  };

  const handleAccept = (propertyId: string) => {
    console.log('Propiedad aceptada:', propertyId);
    // Aquí puedes agregar la lógica para aceptar la propiedad
    // Por ahora solo avanzamos al siguiente
    if (currentPropertyIndex < properties.length - 1) {
      setCurrentPropertyIndex(currentPropertyIndex + 1);
    }
  };

  const currentProperty = properties[currentPropertyIndex];

  return (
    <div className="w-full h-full flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Match
        </h1>
        <p className="text-gray-600 mb-6">
          Encuentra la propiedad perfecta que coincida con tus criterios de búsqueda.
        </p>
        
        {/* Contador de propiedades */}
        <div className="text-sm text-gray-500 mb-6">
          Propiedad {currentPropertyIndex + 1} de {properties.length}
        </div>

        {/* Card de la propiedad */}
        {currentProperty ? (
          <MatchCard
            property={currentProperty}
            onReject={handleReject}
            onAccept={handleAccept}
          />
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay más propiedades disponibles
            </h3>
            <p className="text-gray-600">
              Has revisado todas las propiedades que coinciden con tus criterios.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchView; 