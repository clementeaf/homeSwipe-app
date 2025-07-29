import React, { useState } from 'react';

interface LookingForFormProps {
  className?: string;
}

interface FormData {
  location: string;
  propertyType: string;
  priceRange: string;
  bedrooms: string;
  bathrooms: string;
}

const LookingForForm: React.FC<LookingForFormProps> = ({ className = '' }) => {
  const [formData, setFormData] = useState<FormData>({
    location: '',
    propertyType: '',
    priceRange: '',
    bedrooms: '',
    bathrooms: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Simular envío a Lambda
      console.log('Enviando datos a Lambda:', formData);
      
      // Aquí iría la llamada real a tu API
      const response = await fetch('/api/search-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        console.log('Formulario enviado exitosamente');
        // Resetear formulario
        setFormData({
          location: '',
          propertyType: '',
          priceRange: '',
          bedrooms: '',
          bathrooms: ''
        });
      }
    } catch (error) {
      console.error('Error al enviar formulario:', error);
    }
  };

  return (
    <div className={`p-6 ${className}`}>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Buscar Propiedad
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
              Ubicación *
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              required
              placeholder="Ciudad, barrio o dirección"
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900"
            />
          </div>

          {/* Property Type */}
          <div>
            <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Propiedad
            </label>
            <select
              id="propertyType"
              name="propertyType"
              value={formData.propertyType}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900"
            >
              <option value="">Seleccionar tipo</option>
              <option value="house">Casa</option>
              <option value="apartment">Apartamento</option>
              <option value="condo">Condominio</option>
              <option value="townhouse">Townhouse</option>
              <option value="land">Terreno</option>
            </select>
          </div>

          {/* Price Range */}
          <div>
            <label htmlFor="priceRange" className="block text-sm font-medium text-gray-700 mb-2">
              Rango de Precio
            </label>
            <select
              id="priceRange"
              name="priceRange"
              value={formData.priceRange}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900"
            >
              <option value="">Seleccionar rango</option>
              <option value="0-100000">$0 - $100,000</option>
              <option value="100000-200000">$100,000 - $200,000</option>
              <option value="200000-300000">$200,000 - $300,000</option>
              <option value="300000-500000">$300,000 - $500,000</option>
              <option value="500000+">$500,000+</option>
            </select>
          </div>

          {/* Bedrooms */}
          <div>
            <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 mb-2">
              Habitaciones
            </label>
            <select
              id="bedrooms"
              name="bedrooms"
              value={formData.bedrooms}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900"
            >
              <option value="">Cualquier cantidad</option>
              <option value="1">1 habitación</option>
              <option value="2">2 habitaciones</option>
              <option value="3">3 habitaciones</option>
              <option value="4">4 habitaciones</option>
              <option value="5+">5+ habitaciones</option>
            </select>
          </div>

          {/* Bathrooms */}
          <div>
            <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700 mb-2">
              Baños
            </label>
            <select
              id="bathrooms"
              name="bathrooms"
              value={formData.bathrooms}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900"
            >
              <option value="">Cualquier cantidad</option>
              <option value="1">1 baño</option>
              <option value="2">2 baños</option>
              <option value="3">3 baños</option>
              <option value="4">4 baños</option>
              <option value="5+">5+ baños</option>
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200"
          >
            Buscar Propiedades
          </button>
        </div>
      </form>
    </div>
  );
};

export default LookingForForm; 