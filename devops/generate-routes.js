#!/usr/bin/env node

/**
 * Generador Automático de Rutas para API Discovery
 * Este script analiza el código del backend y genera automáticamente
 * las definiciones de rutas para el sistema de descubrimiento
 */

const fs = require('fs');
const path = require('path');

// Configuración
const BACKEND_SRC_PATH = '../backend/src';
const ROUTES_OUTPUT_PATH = './generated-routes.json';

// Patrones para detectar rutas
const ROUTE_PATTERNS = [
  /app\.(get|post|put|delete|patch)\s*\(\s*['"`]([^'"`]+)['"`]/g,
  /app\.(get|post|put|delete|patch)\s*\(\s*`([^`]+)`/g,
];

// Descripciones predefinidas para rutas comunes
const ROUTE_DESCRIPTIONS = {
  '/': 'Endpoint raíz del API',
  '/api/status': 'Estado del backend',
  '/api/health': 'Health check del sistema',
  '/api/discovery': 'Descubrimiento de rutas disponibles',
  '/api/users': 'Gestión de usuarios',
  '/api/auth': 'Autenticación',
  '/api/properties': 'Gestión de propiedades',
  '/api/upload': 'Subida de archivos',
};

/**
 * Extrae rutas del código fuente
 */
function extractRoutesFromCode(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const routes = [];
  
  ROUTE_PATTERNS.forEach(pattern => {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const method = match[1].toUpperCase();
      const routePath = match[2];
      
      routes.push({
        method,
        path: routePath,
        file: path.basename(filePath),
        line: content.substring(0, match.index).split('\n').length
      });
    }
  });
  
  return routes;
}

/**
 * Genera descripción automática para una ruta
 */
function generateDescription(route) {
  // Usar descripción predefinida si existe
  if (ROUTE_DESCRIPTIONS[route.path]) {
    return ROUTE_DESCRIPTIONS[route.path];
  }
  
  // Generar descripción basada en el path
  const pathParts = route.path.split('/').filter(Boolean);
  const method = route.method.toLowerCase();
  
  if (pathParts.length === 0) {
    return 'Endpoint raíz del API';
  }
  
  if (pathParts[0] === 'api') {
    const resource = pathParts[1];
    const action = pathParts[2] || 'list';
    
    const resourceNames = {
      'users': 'usuarios',
      'properties': 'propiedades',
      'auth': 'autenticación',
      'upload': 'archivos',
      'status': 'estado',
      'health': 'salud',
      'discovery': 'descubrimiento'
    };
    
    const actionNames = {
      'list': 'listar',
      'get': 'obtener',
      'create': 'crear',
      'update': 'actualizar',
      'delete': 'eliminar',
      'upload': 'subir'
    };
    
    const resourceName = resourceNames[resource] || resource;
    const actionName = actionNames[action] || action;
    
    return `${actionName} ${resourceName}`;
  }
  
  return `${method} ${route.path}`;
}

/**
 * Genera el archivo de rutas
 */
function generateRoutesFile() {
  console.log('🔍 Analizando código del backend...');
  
  const allRoutes = [];
  
  // Buscar archivos TypeScript/JavaScript en el backend
  function scanDirectory(dir) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        scanDirectory(filePath);
      } else if (file.endsWith('.ts') || file.endsWith('.js')) {
        try {
          const routes = extractRoutesFromCode(filePath);
          allRoutes.push(...routes);
        } catch (error) {
          console.warn(`⚠️ Error leyendo ${filePath}:`, error.message);
        }
      }
    });
  }
  
  // Escanear directorio del backend
  if (fs.existsSync(BACKEND_SRC_PATH)) {
    scanDirectory(BACKEND_SRC_PATH);
  } else {
    console.warn(`⚠️ Directorio del backend no encontrado: ${BACKEND_SRC_PATH}`);
  }
  
  // Generar objeto de rutas para API Discovery
  const routesObject = {};
  
  allRoutes.forEach((route, index) => {
    const key = route.path.replace(/[^a-zA-Z0-9]/g, '_') || 'root';
    const uniqueKey = `${key}_${index}`;
    
    routesObject[uniqueKey] = {
      path: route.path,
      method: route.method,
      description: generateDescription(route),
      example: route.path,
      source: {
        file: route.file,
        line: route.line
      }
    };
  });
  
  // Agregar rutas hardcodeadas si no se encontraron
  if (Object.keys(routesObject).length === 0) {
    console.log('📝 No se encontraron rutas, agregando rutas por defecto...');
    
    const defaultRoutes = [
      { path: '/', method: 'GET', description: 'Endpoint raíz del API' },
      { path: '/api/status', method: 'GET', description: 'Estado del backend' },
      { path: '/api/health', method: 'GET', description: 'Health check del sistema' },
      { path: '/api/discovery', method: 'GET', description: 'Descubrimiento de rutas disponibles' }
    ];
    
    defaultRoutes.forEach((route, index) => {
      routesObject[`route_${index}`] = {
        path: route.path,
        method: route.method,
        description: route.description,
        example: route.path
      };
    });
  }
  
  // Generar archivo de salida
  const output = {
    generatedAt: new Date().toISOString(),
    totalRoutes: Object.keys(routesObject).length,
    routes: routesObject
  };
  
  fs.writeFileSync(ROUTES_OUTPUT_PATH, JSON.stringify(output, null, 2));
  
  console.log(`✅ Generadas ${Object.keys(routesObject).length} rutas en ${ROUTES_OUTPUT_PATH}`);
  console.log('📋 Rutas encontradas:');
  
  Object.entries(routesObject).forEach(([key, route]) => {
    console.log(`  ${route.method} ${route.path} - ${route.description}`);
  });
  
  return output;
}

/**
 * Actualiza el handler con las rutas generadas
 */
function updateHandlerWithRoutes() {
  const routesFile = JSON.parse(fs.readFileSync(ROUTES_OUTPUT_PATH, 'utf8'));
  const handlerPath = './handler.js';
  
  if (!fs.existsSync(handlerPath)) {
    console.error('❌ Handler no encontrado');
    return;
  }
  
  let handlerContent = fs.readFileSync(handlerPath, 'utf8');
  
  // Generar objeto de rutas para el handler
  const routesObject = {};
  Object.entries(routesFile.routes).forEach(([key, route]) => {
    routesObject[key] = {
      path: route.path,
      method: route.method,
      description: route.description,
      example: route.example
    };
  });
  
  // Buscar y reemplazar la sección de rutas en el handler
  const routesPattern = /const apiRoutes = \{[\s\S]*?\};/;
  const newRoutesSection = `const apiRoutes = {
  discovery: {
    path: '/api/discovery',
    method: 'GET',
    description: 'Obtiene información sobre todas las rutas disponibles',
    response: {
      message: 'API Discovery',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      baseUrl: \`https://\${event.requestContext.domainName}\${event.requestContext.stage}\`,
      routes: ${JSON.stringify(routesObject, null, 6)},
      environment: process.env.NODE_ENV || 'development',
      region: process.env.AWS_REGION || 'us-east-1',
      deployment: {
        timestamp: new Date().toISOString(),
        version: process.env.DEPLOYMENT_VERSION || '1.0.0'
      }
    }
  }
};`;
  
  if (routesPattern.test(handlerContent)) {
    handlerContent = handlerContent.replace(routesPattern, newRoutesSection);
  } else {
    console.warn('⚠️ No se encontró la sección de rutas en el handler');
  }
  
  fs.writeFileSync(handlerPath, handlerContent);
  console.log('✅ Handler actualizado con las rutas generadas');
}

// Ejecutar si se llama directamente
if (require.main === module) {
  try {
    console.log('🚀 Iniciando generación automática de rutas...');
    
    const routes = generateRoutesFile();
    updateHandlerWithRoutes();
    
    console.log('🎉 Generación completada exitosamente');
  } catch (error) {
    console.error('❌ Error durante la generación:', error);
    process.exit(1);
  }
}

module.exports = {
  generateRoutesFile,
  updateHandlerWithRoutes,
  extractRoutesFromCode
}; 