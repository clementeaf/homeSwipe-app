#!/usr/bin/env node

/**
 * Monitor de Rutas para API Discovery
 * Este script monitorea cambios en las rutas del backend y notifica al frontend
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuración
const ROUTES_FILE = './generated-routes.json';
const LAST_CHECK_FILE = './.last-routes-check';
const BACKEND_SRC_PATH = '../backend/src';

class RoutesMonitor {
  constructor() {
    this.lastRoutes = null;
    this.lastCheck = null;
  }

  /**
   * Carga las rutas actuales
   */
  loadCurrentRoutes() {
    if (fs.existsSync(ROUTES_FILE)) {
      return JSON.parse(fs.readFileSync(ROUTES_FILE, 'utf8'));
    }
    return null;
  }

  /**
   * Carga la última verificación
   */
  loadLastCheck() {
    if (fs.existsSync(LAST_CHECK_FILE)) {
      return JSON.parse(fs.readFileSync(LAST_CHECK_FILE, 'utf8'));
    }
    return null;
  }

  /**
   * Guarda la última verificación
   */
  saveLastCheck(data) {
    fs.writeFileSync(LAST_CHECK_FILE, JSON.stringify(data, null, 2));
  }

  /**
   * Verifica si hay cambios en el código del backend
   */
  checkBackendChanges() {
    if (!fs.existsSync(BACKEND_SRC_PATH)) {
      return false;
    }

    const lastCheck = this.loadLastCheck();
    if (!lastCheck) {
      return true; // Primera ejecución
    }

    // Verificar cambios en archivos del backend
    try {
      const gitStatus = execSync('git status --porcelain', { cwd: BACKEND_SRC_PATH }).toString();
      return gitStatus.includes('backend/') || gitStatus.includes('src/');
    } catch (error) {
      console.warn('⚠️ No se pudo verificar cambios en Git:', error.message);
      return true; // Asumir que hay cambios si no se puede verificar
    }
  }

  /**
   * Regenera las rutas si es necesario
   */
  regenerateRoutesIfNeeded() {
    if (this.checkBackendChanges()) {
      console.log('🔄 Cambios detectados en el backend. Regenerando rutas...');
      
      try {
        execSync('node generate-routes.js', { stdio: 'inherit' });
        return true;
      } catch (error) {
        console.error('❌ Error regenerando rutas:', error.message);
        return false;
      }
    }
    return false;
  }

  /**
   * Compara rutas actuales con las anteriores
   */
  compareRoutes() {
    const currentRoutes = this.loadCurrentRoutes();
    const lastCheck = this.loadLastCheck();

    if (!currentRoutes) {
      console.error('❌ No se pudieron cargar las rutas actuales');
      return { hasChanges: false, changes: [] };
    }

    if (!lastCheck || !lastCheck.routes) {
      console.log('📝 Primera verificación de rutas');
      this.saveLastCheck({
        timestamp: new Date().toISOString(),
        routes: currentRoutes.routes,
        totalRoutes: currentRoutes.totalRoutes
      });
      return { hasChanges: false, changes: [] };
    }

    const changes = [];
    const currentRouteKeys = Object.keys(currentRoutes.routes);
    const lastRouteKeys = Object.keys(lastCheck.routes);

    // Buscar rutas nuevas
    currentRouteKeys.forEach(key => {
      if (!lastRouteKeys.includes(key)) {
        changes.push({
          type: 'added',
          route: currentRoutes.routes[key]
        });
      }
    });

    // Buscar rutas eliminadas
    lastRouteKeys.forEach(key => {
      if (!currentRouteKeys.includes(key)) {
        changes.push({
          type: 'removed',
          route: lastCheck.routes[key]
        });
      }
    });

    // Buscar rutas modificadas
    currentRouteKeys.forEach(key => {
      if (lastRouteKeys.includes(key)) {
        const currentRoute = currentRoutes.routes[key];
        const lastRoute = lastCheck.routes[key];
        
        if (JSON.stringify(currentRoute) !== JSON.stringify(lastRoute)) {
          changes.push({
            type: 'modified',
            oldRoute: lastRoute,
            newRoute: currentRoute
          });
        }
      }
    });

    // Actualizar última verificación
    this.saveLastCheck({
      timestamp: new Date().toISOString(),
      routes: currentRoutes.routes,
      totalRoutes: currentRoutes.totalRoutes
    });

    return {
      hasChanges: changes.length > 0,
      changes
    };
  }

  /**
   * Notifica cambios al frontend (simulado)
   */
  notifyFrontend(changes) {
    console.log('📢 Notificando cambios al frontend...');
    
    changes.forEach(change => {
      switch (change.type) {
        case 'added':
          console.log(`➕ Nueva ruta: ${change.route.method} ${change.route.path}`);
          break;
        case 'removed':
          console.log(`➖ Ruta eliminada: ${change.route.method} ${change.route.path}`);
          break;
        case 'modified':
          console.log(`✏️ Ruta modificada: ${change.newRoute.method} ${change.newRoute.path}`);
          break;
      }
    });

    // Aquí se podría implementar una notificación real al frontend
    // Por ejemplo, mediante WebSockets, Server-Sent Events, o polling
    console.log('📡 Frontend notificado de los cambios');
  }

  /**
   * Ejecuta el monitoreo completo
   */
  run() {
    console.log('🔍 Iniciando monitoreo de rutas...');
    
    // Regenerar rutas si es necesario
    const wasRegenerated = this.regenerateRoutesIfNeeded();
    
    // Comparar rutas
    const comparison = this.compareRoutes();
    
    if (comparison.hasChanges) {
      console.log(`📊 Se detectaron ${comparison.changes.length} cambios en las rutas`);
      this.notifyFrontend(comparison.changes);
      
      // Si se regeneraron las rutas, sugerir despliegue
      if (wasRegenerated) {
        console.log('🚀 Sugerencia: Ejecuta ./deploy-backend.sh para desplegar los cambios');
      }
    } else {
      console.log('✅ No se detectaron cambios en las rutas');
    }
    
    return comparison;
  }

  /**
   * Inicia el monitoreo continuo
   */
  startContinuousMonitoring(intervalMs = 30000) { // 30 segundos por defecto
    console.log(`🔄 Iniciando monitoreo continuo (intervalo: ${intervalMs}ms)`);
    
    const monitor = () => {
      this.run();
      setTimeout(monitor, intervalMs);
    };
    
    monitor();
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  const monitor = new RoutesMonitor();
  
  const args = process.argv.slice(2);
  
  if (args.includes('--continuous') || args.includes('-c')) {
    const interval = args.find(arg => arg.startsWith('--interval='))?.split('=')[1];
    const intervalMs = interval ? parseInt(interval) : 30000;
    monitor.startContinuousMonitoring(intervalMs);
  } else {
    monitor.run();
  }
}

module.exports = RoutesMonitor; 