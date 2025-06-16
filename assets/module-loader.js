// js/module-loader.js
class ModuleLoader {
  constructor() {
    this.loadedModules = new Set();
    this.loadingPromises = new Map();
  }
  async loadModule(modulePath) {
    // Avoid duplicate loading
    if (this.loadedModules.has(modulePath)) {
      return;
    }
    // If it is already loading, return the existing promise
    if (this.loadingPromises.has(modulePath)) {
      return this.loadingPromises.get(modulePath);
    }
    // Create new load promise
    const loadingPromise = this.importModule(modulePath);
    this.loadingPromises.set(modulePath, loadingPromise);
    try {
      const module = await loadingPromise;
      this.loadedModules.add(modulePath);
      this.loadingPromises.delete(modulePath);
      return module;
    } catch (error) {
      this.loadingPromises.delete(modulePath);
      console.error(`Error loading module ${modulePath}:`, error);
      throw error;
    }
  }
  async importModule(modulePath) {
    return import(modulePath);
  }
  // Preload modules based on priority
  async preloadModules(moduleList, priority = 'low') {
    const loadPromises = moduleList.map(modulePath => {
      return this.loadModule(modulePath);
    });
    if (priority === 'high') {
      return Promise.all(loadPromises);
    } else {
      // Loading with low priority using requestIdleCallback
      return new Promise(resolve => {
        if ('requestIdleCallback' in window) {
          requestIdleCallback(() => {
            Promise.all(loadPromises).then(resolve);
          });
        } else {
          setTimeout(() => {
            Promise.all(loadPromises).then(resolve);
          }, 100);
        }
      });
    }
  }
}
window.moduleLoader = new ModuleLoader();

export { ModuleLoader };

