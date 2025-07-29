import React, { useState } from 'react';

interface LookingForFormProps {
  className?: string;
}

interface FormData {
  region: string;
  comuna: string;
  propertyType: string;
  priceRange: string;
  bedrooms: string;
  bathrooms: string;
}

// Datos de regiones y comunas de Chile
const regionesChile = [
  { id: 'arica', nombre: 'Arica y Parinacota', comunas: ['Arica', 'Camarones', 'Putre', 'General Lagos'] },
  { id: 'tarapaca', nombre: 'Tarapacá', comunas: ['Iquique', 'Alto Hospicio', 'Pozo Almonte', 'Camiña', 'Colchane', 'Huara', 'Pica'] },
  { id: 'antofagasta', nombre: 'Antofagasta', comunas: ['Antofagasta', 'Mejillones', 'Sierra Gorda', 'Taltal', 'Calama', 'Ollagüe', 'San Pedro de Atacama', 'Tocopilla', 'María Elena'] },
  { id: 'atacama', nombre: 'Atacama', comunas: ['Copiapó', 'Caldera', 'Tierra Amarilla', 'Chañaral', 'Diego de Almagro', 'Vallenar', 'Alto del Carmen', 'Freirina', 'Huasco'] },
  { id: 'coquimbo', nombre: 'Coquimbo', comunas: ['La Serena', 'Coquimbo', 'Andacollo', 'La Higuera', 'Paiguano', 'Vicuña', 'Illapel', 'Canela', 'Los Vilos', 'Salamanca', 'Ovalle', 'Combarbalá', 'Monte Patria', 'Punitaqui', 'Río Hurtado'] },
  { id: 'valparaiso', nombre: 'Valparaíso', comunas: ['Valparaíso', 'Casablanca', 'Concón', 'Juan Fernández', 'Puchuncaví', 'Quintero', 'Viña del Mar', 'Isla de Pascua', 'Los Andes', 'Calle Larga', 'Rinconada', 'San Esteban', 'La Ligua', 'Cabildo', 'Papudo', 'Petorca', 'Zapallar', 'Quillota', 'Calera', 'Hijuelas', 'La Cruz', 'Nogales', 'San Antonio', 'Algarrobo', 'Cartagena', 'El Quisco', 'El Tabo', 'Santo Domingo', 'San Felipe', 'Catemu', 'Llaillay', 'Panquehue', 'Putaendo', 'Santa María', 'Quilpué', 'Limache', 'Olmué', 'Villa Alemana'] },
  { id: 'ohiggins', nombre: 'O\'Higgins', comunas: ['Rancagua', 'Codegua', 'Coinco', 'Coltauco', 'Doñihue', 'Graneros', 'Las Cabras', 'Machalí', 'Malloa', 'Mostazal', 'Olivar', 'Peumo', 'Pichidegua', 'Quinta de Tilcoco', 'Rengo', 'Requínoa', 'San Vicente', 'Pichilemu', 'La Estrella', 'Litueche', 'Marchihue', 'Navidad', 'Paredones', 'San Fernando', 'Chépica', 'Chimbarongo', 'Lolol', 'Nancagua', 'Palmilla', 'Peralillo', 'Placilla', 'Pumanque', 'Santa Cruz'] },
  { id: 'maule', nombre: 'Maule', comunas: ['Talca', 'Constitución', 'Curepto', 'Empedrado', 'Maule', 'Pelarco', 'Pencahue', 'Río Claro', 'San Clemente', 'San Rafael', 'Cauquenes', 'Chanco', 'Pelluhue', 'Curicó', 'Hualañé', 'Licantén', 'Molina', 'Rauco', 'Romeral', 'Sagrada Familia', 'Teno', 'Vichuquén', 'Linares', 'Colbún', 'Longaví', 'Parral', 'Retiro', 'San Javier', 'Villa Alegre', 'Yerbas Buenas'] },
  { id: 'biobio', nombre: 'Biobío', comunas: ['Concepción', 'Coronel', 'Chiguayante', 'Florida', 'Hualqui', 'Lota', 'Penco', 'San Pedro de la Paz', 'Santa Juana', 'Talcahuano', 'Tomé', 'Hualpén', 'Lebu', 'Arauco', 'Cañete', 'Contulmo', 'Curanilahue', 'Los Álamos', 'Tirúa', 'Los Ángeles', 'Antuco', 'Cabrero', 'Laja', 'Mulchén', 'Nacimiento', 'Negrete', 'Quilaco', 'Quilleco', 'San Rosendo', 'Santa Bárbara', 'Tucapel', 'Yumbel', 'Alto Biobío'] },
  { id: 'araucania', nombre: 'La Araucanía', comunas: ['Temuco', 'Carahue', 'Cunco', 'Curarrehue', 'Freire', 'Galvarino', 'Gorbea', 'Lautaro', 'Loncoche', 'Melipeuco', 'Nueva Imperial', 'Padre Las Casas', 'Perquenco', 'Pitrufquén', 'Pucón', 'Saavedra', 'Teodoro Schmidt', 'Toltén', 'Vilcún', 'Villarrica', 'Cholchol', 'Angol', 'Collipulli', 'Curacautín', 'Ercilla', 'Lonquimay', 'Los Sauces', 'Lumaco', 'Purén', 'Renaico', 'Traiguén', 'Victoria'] },
  { id: 'losrios', nombre: 'Los Ríos', comunas: ['Valdivia', 'Corral', 'Lanco', 'Los Lagos', 'Máfil', 'Mariquina', 'Paillaco', 'Panguipulli', 'La Unión', 'Futrono', 'Lago Ranco', 'Río Bueno'] },
  { id: 'loslagos', nombre: 'Los Lagos', comunas: ['Puerto Montt', 'Calbuco', 'Cochamó', 'Fresia', 'Frutillar', 'Los Muermos', 'Llanquihue', 'Maullín', 'Puerto Varas', 'Castro', 'Ancud', 'Chonchi', 'Curaco de Vélez', 'Dalcahue', 'Puqueldón', 'Queilén', 'Quellón', 'Quemchi', 'Quinchao', 'Osorno', 'Puerto Octay', 'Purranque', 'Puyehue', 'Río Negro', 'San Juan de la Costa', 'San Pablo', 'Chaitén', 'Futaleufú', 'Hualaihué', 'Palena'] },
  { id: 'aysen', nombre: 'Aysén', comunas: ['Coyhaique', 'Lago Verde', 'Aysén', 'Cisnes', 'Guaitecas', 'Cochrane', 'O\'Higgins', 'Tortel', 'Chile Chico', 'Río Ibáñez'] },
  { id: 'magallanes', nombre: 'Magallanes', comunas: ['Punta Arenas', 'Laguna Blanca', 'Río Verde', 'San Gregorio', 'Cabo de Hornos', 'Antártica', 'Porvenir', 'Primavera', 'Timaukel', 'Natales', 'Torres del Paine'] },
  { id: 'metropolitana', nombre: 'Metropolitana de Santiago', comunas: ['Santiago', 'Cerrillos', 'Cerro Navia', 'Conchalí', 'El Bosque', 'Estación Central', 'Huechuraba', 'Independencia', 'La Cisterna', 'La Florida', 'La Granja', 'La Pintana', 'La Reina', 'Las Condes', 'Lo Barnechea', 'Lo Espejo', 'Lo Prado', 'Macul', 'Maipú', 'Ñuñoa', 'Pedro Aguirre Cerda', 'Peñalolén', 'Providencia', 'Pudahuel', 'Quilicura', 'Quinta Normal', 'Recoleta', 'Renca', 'San Joaquín', 'San Miguel', 'San Ramón', 'Vitacura', 'Puente Alto', 'Pirque', 'San José de Maipo', 'Colina', 'Lampa', 'Tiltil', 'San Bernardo', 'Buin', 'Calera de Tango', 'Paine', 'Melipilla', 'Alhué', 'Curacaví', 'María Pinto', 'San Pedro', 'Talagante', 'El Monte', 'Isla de Maipo', 'Padre Hurtado', 'Peñaflor'] }
];

const LookingForForm: React.FC<LookingForFormProps> = ({ className = '' }) => {
  const [formData, setFormData] = useState<FormData>({
    region: '',
    comuna: '',
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
          region: '',
          comuna: '',
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

  // Obtener comunas de la región seleccionada
  const comunasDisponibles = formData.region 
    ? regionesChile.find(r => r.id === formData.region)?.comunas || []
    : [];

  return (
    <div className={`p-6 ${className}`}>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Buscar Propiedad
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Región */}
          <div>
            <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-2">
              Región *
            </label>
            <select
              id="region"
              name="region"
              value={formData.region}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900"
            >
              <option value="">Seleccionar región</option>
              {regionesChile.map(region => (
                <option key={region.id} value={region.id}>
                  {region.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Comuna */}
          <div>
            <label htmlFor="comuna" className="block text-sm font-medium text-gray-700 mb-2">
              Comuna *
            </label>
            <select
              id="comuna"
              name="comuna"
              value={formData.comuna}
              onChange={handleInputChange}
              required
              disabled={!formData.region}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 disabled:bg-gray-100 disabled:text-gray-500"
            >
              <option value="">Seleccionar comuna</option>
              {comunasDisponibles.map(comuna => (
                <option key={comuna} value={comuna}>
                  {comuna}
                </option>
              ))}
            </select>
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