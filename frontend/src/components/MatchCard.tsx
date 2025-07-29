import React, { useState } from 'react';

interface PropertyImage {
  id: string;
  url: string;
  alt: string;
}

interface MatchCardProps {
  property: {
    id: string;
    title: string;
    location: string;
    matchPercentage: number;
    views: number;
    likes: number;
    images: PropertyImage[];
  };
  onReject: (propertyId: string) => void;
  onAccept: (propertyId: string) => void;
}

const MatchCard: React.FC<MatchCardProps> = ({ property, onReject, onAccept }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };

  const handleReject = () => {
    onReject(property.id);
  };

  const handleAccept = () => {
    onAccept(property.id);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg max-w-md mx-auto">
      {/* Carousel de imágenes */}
      <div className="relative h-64 bg-gray-200 rounded-t-lg overflow-hidden">
        {property.images.length > 0 ? (
          <>
            <img
              src={property.images[currentImageIndex].url}
              alt={property.images[currentImageIndex].alt}
              className="w-full h-full object-cover"
            />
            
            {/* Botones de navegación */}
            {property.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md transition-all duration-200"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md transition-all duration-200"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
            
            {/* Indicadores de imagen */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
              {property.images.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            Sin imágenes
          </div>
        )}
      </div>

      {/* Contenido de la card */}
      <div className="p-4">
        {/* Título y ubicación */}
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {property.title}
          </h3>
          <p className="text-sm text-gray-600 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {property.location}
          </p>
        </div>

        {/* Estadísticas */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {property.views} vistos
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              {property.likes} likes
            </div>
          </div>
          
          {/* Porcentaje de coincidencia */}
          <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
            {property.matchPercentage}% match
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex space-x-3">
          <button
            onClick={handleReject}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <button
            onClick={handleAccept}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MatchCard; 