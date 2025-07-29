# HomeSwipe DevOps - Sistema de Despliegue Automático

Este directorio contiene toda la configuración de DevOps para HomeSwipe, incluyendo el **Sistema de Descubrimiento Automático de Rutas** que permite que el frontend se adapte dinámicamente a los cambios en el backend.

## 🚀 Sistema de Descubrimiento Automático de Rutas

### ¿Qué hace?

El sistema detecta automáticamente cuando se agregan, modifican o eliminan rutas en el backend y actualiza dinámicamente la información disponible para el frontend.

### Componentes del Sistema

1. **Generador de Rutas** (`generate-routes.js`)
   - Analiza el código del backend
   - Extrae automáticamente todas las rutas definidas
   - Genera descripciones inteligentes
   - Actualiza el handler de Lambda

2. **Monitor de Rutas** (`monitor-routes.js`)
   - Monitorea cambios en el código del backend
   - Detecta nuevas rutas automáticamente
   - Notifica al frontend de los cambios
   - Sugiere despliegues cuando es necesario

3. **API Discovery** (`/api/discovery`)
   - Endpoint que devuelve todas las rutas disponibles
   - Información dinámica sobre el backend
   - Metadatos de despliegue y versión

4. **Frontend Integration**
   - Servicio de descubrimiento en React
   - Componente visual para explorar rutas
   - Cache inteligente con actualización automática

## 📁 Estructura de Archivos

```
devops/
├── infrastructure.yml          # Infraestructura AWS (DynamoDB, S3, CloudFront)
├── backend-serverless.yml      # Configuración del backend en Lambda
├── generate-routes.js          # Generador automático de rutas
├── monitor-routes.js           # Monitor de cambios en rutas
├── handler.js                  # Handler Lambda con rutas dinámicas
├── generated-routes.json       # Rutas generadas automáticamente
├── deploy-infrastructure.sh    # Script de despliegue de infraestructura
├── deploy-backend.sh           # Script de despliegue del backend
├── deploy-frontend.sh          # Script de despliegue del frontend
└── .git/hooks/pre-commit       # Hook Git para generación automática
```

## 🛠️ Comandos Disponibles

### Despliegue

```bash
# Desplegar todo (infraestructura + backend + frontend)
npm run deploy:all

# Desplegar solo el backend con generación automática de rutas
npm run deploy:backend

# Desplegar a producción
npm run deploy:all:prod
```

### Generación y Monitoreo de Rutas

```bash
# Generar rutas manualmente
npm run generate:routes

# Monitorear cambios en rutas (una vez)
npm run monitor:routes

# Monitoreo continuo (cada 30 segundos)
npm run monitor:routes:continuous

# Monitoreo continuo con intervalo personalizado
node monitor-routes.js --continuous --interval=60000  # 60 segundos
```

### Testing y Debugging

```bash
# Probar el backend
npm run test:backend

# Probar el sistema de descubrimiento
npm run test:discovery

# Ver logs del backend
npm run logs:backend
```

## 🔄 Flujo Automático

### 1. Desarrollo
```bash
# El desarrollador agrega una nueva ruta al backend
app.get('/api/properties', (req, res) => {
  // nueva funcionalidad
});
```

### 2. Detección Automática
```bash
# Git pre-commit hook detecta cambios
git add backend/src/index.ts
git commit -m "Add properties endpoint"
# ✅ Rutas regeneradas automáticamente
```

### 3. Despliegue
```bash
# Desplegar con rutas actualizadas
npm run deploy:backend
```

### 4. Frontend Actualizado
- El frontend consulta `/api/discovery`
- Recibe la nueva ruta automáticamente
- Se adapta sin cambios en el código

## 📊 API Discovery Endpoint

### GET `/api/discovery`

```json
{
  "message": "API Discovery",
  "timestamp": "2025-07-29T18:05:09.643Z",
  "version": "1.0.0",
  "baseUrl": "https://u00g8tjlrh.execute-api.us-east-1.amazonaws.com/dev",
  "routes": {
    "root": {
      "path": "/",
      "method": "GET",
      "description": "Endpoint raíz del API",
      "example": "/"
    },
    "status": {
      "path": "/api/status",
      "method": "GET",
      "description": "Estado del backend",
      "example": "/api/status"
    },
    "users": {
      "path": "/api/users",
      "method": "GET",
      "description": "Gestión de usuarios",
      "example": "/api/users"
    }
  },
  "environment": "development",
  "region": "us-east-1",
  "deployment": {
    "timestamp": "2025-07-29T18:05:09.643Z",
    "version": "1.0.0"
  }
}
```

## 🏗️ Infraestructura AWS

### Recursos Desplegados

- **DynamoDB**: Tabla de usuarios
- **S3**: 
  - Bucket para hosting del frontend
  - Bucket para uploads de archivos
- **CloudFront**: Distribución para el frontend
- **Lambda**: Backend con API Gateway
- **IAM**: Roles y políticas necesarias

### Configuración por Ambiente

```bash
# Desarrollo
npm run deploy:all

# Producción
npm run deploy:all:prod
```

## 🔧 Configuración

### Variables de Entorno

```bash
# Backend
DEPLOYMENT_VERSION=1.0.0
NODE_ENV=development
AWS_REGION=us-east-1

# Frontend
VITE_API_BASE_URL=https://u00g8tjlrh.execute-api.us-east-1.amazonaws.com/dev
```

### Personalización

1. **Rutas Personalizadas**: Editar `ROUTE_DESCRIPTIONS` en `generate-routes.js`
2. **Intervalo de Monitoreo**: Modificar `intervalMs` en `monitor-routes.js`
3. **Cache del Frontend**: Ajustar `cacheTimeout` en `discovery.ts`

## 🚨 Troubleshooting

### Problemas Comunes

1. **Rutas no detectadas**
   ```bash
   npm run generate:routes
   npm run deploy:backend
   ```

2. **Frontend no actualiza**
   ```bash
   # Limpiar cache del frontend
   apiDiscovery.clearCache()
   ```

3. **Error en despliegue**
   ```bash
   npm run logs:backend
   ```

### Logs y Debugging

```bash
# Ver logs en tiempo real
npm run logs:backend

# Probar endpoints específicos
curl https://u00g8tjlrh.execute-api.us-east-1.amazonaws.com/dev/api/status
curl https://u00g8tjlrh.execute-api.us-east-1.amazonaws.com/dev/api/discovery
```

## 🎯 Beneficios del Sistema

1. **Desarrollo Ágil**: No más sincronización manual de rutas
2. **Frontend Adaptativo**: Se actualiza automáticamente
3. **Documentación Automática**: Rutas siempre actualizadas
4. **Despliegue Confiable**: Detección automática de cambios
5. **Monitoreo Inteligente**: Notificaciones proactivas

## 🔮 Próximas Mejoras

- [ ] WebSockets para notificaciones en tiempo real
- [ ] Dashboard de monitoreo de rutas
- [ ] Validación automática de rutas
- [ ] Métricas de uso de endpoints
- [ ] Versionado semántico automático

---

**¡El sistema está completamente funcional y listo para producción!** 🎉