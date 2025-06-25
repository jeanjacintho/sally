// js/common/module-loader.js
import { GestureArea } from './gesture-area.js';
import { __privateGet, __privateAdd, __privateSet, __privateMethod } from './private-helpers.js';

// Modules available for lazy loading with their dependencies
const lazyLoadModules = {
    dom: {
        loader: () => import('./dom.js'),
        dependencies: []
    },
    carouselNavigation: {
        loader: () => import('./carousel-navigation.js'),
        dependencies: []
    },
    vendor: {
        loader: () => import('./vendor.js'),
        dependencies: []
    },
    gestureArea: {
        loader: () => import('./gesture-area.js'),
        dependencies: []
    },
    player: {
        loader: () => import('./player.js'),
        dependencies: []
    },
    heightObserver: {
        loader: () => import('./height-observer.js'),
        dependencies: ['dom']
    },
    effectCarousel: {
        loader: () => import('./effect-carousel.js'),
        dependencies: ['vendor', 'gestureArea', 'player']
    },
    announcementBarCarousel: {
        loader: () => import('./announcement-bar-carousel.js'),
        dependencies: ['effectCarousel', 'vendor']
    }
};

// Critical modules that should always be loaded
const criticalModules = {
    dom: true,
    vendor: true,
}

// Control of loaded modules - stores the actual module objects
const loadedModules = new Map();

// Global registry to store all exported functions from all modules
window.moduleRegistry = new Proxy({}, {
    get(target, prop) {
        if (target[prop]) {
            return target[prop];
        }
        
        for (const [moduleName, moduleObj] of loadedModules) {
            if (moduleObj[prop]) {
                return moduleObj[prop];
            }
        }
        
        return undefined;
    }
});

// Function to register all exports from a module into the global registry
function registerModuleExports(moduleName, moduleObj) {
    Object.keys(moduleObj).forEach(exportName => {
        const exportValue = moduleObj[exportName];
        
        if (typeof exportValue === 'function') {
            window.moduleRegistry[exportName] = exportValue;
            
            if (!window.moduleRegistry[moduleName]) {
                window.moduleRegistry[moduleName] = {};
            }
            window.moduleRegistry[moduleName][exportName] = exportValue;
        } else {
            window.moduleRegistry[exportName] = exportValue;
            
            if (!window.moduleRegistry[moduleName]) {
                window.moduleRegistry[moduleName] = {};
            }
            window.moduleRegistry[moduleName][exportName] = exportValue;
        }
    });
}

// Function to load dependencies recursively
async function loadDependencies(moduleName) {
    const moduleConfig = lazyLoadModules[moduleName];
    if (!moduleConfig || !moduleConfig.dependencies) return;
    
    const dependencyPromises = moduleConfig.dependencies.map(async (depName) => {
        if (!loadedModules.has(depName)) {
            await loadModule(depName);
        }
    });
    
    await Promise.all(dependencyPromises);
}

// Function to load modules on demand
window.loadModule = async function (moduleName) {
    if (loadedModules.has(moduleName)) {
        return loadedModules.get(moduleName);
    }
    
    const moduleConfig = lazyLoadModules[moduleName];
    if (!moduleConfig) {
        console.warn(`Module ${moduleName} not found`);
        return null;
    }
    
    try {
        // Load dependencies first
        await loadDependencies(moduleName);
        
        // Load the module
        const module = await moduleConfig.loader();
        loadedModules.set(moduleName, module);
        
        // Register all exports globally
        registerModuleExports(moduleName, module);
    
        return module;
    } catch (error) {
        console.error(`Error loading module ${moduleName}:`, error);
        return null;
    }
};

// Enhanced function to get any export from any module (with auto-loading)
window.getModuleExport = async function(exportName, moduleName = null) {
    if (window.moduleRegistry[exportName]) {
        return window.moduleRegistry[exportName];
    }
    
    if (moduleName) {
        const module = await loadModule(moduleName);
        return module ? module[exportName] : null;
    }
    
    for (const availableModule of Object.keys(lazyLoadModules)) {
        if (!loadedModules.has(availableModule)) {
            await loadModule(availableModule);
            if (window.moduleRegistry[exportName]) {
                return window.moduleRegistry[exportName];
            }
        }
    }
    
    console.error(`Export ${exportName} not found in any available module`);
    return null;
};

// Load critical modules immediately
async function loadCriticalModules() {
    const criticalModuleNames = Object.keys(criticalModules).filter(name => criticalModules[name]);
    
    if (criticalModuleNames.length === 0) { return }
    
    const loadPromises = criticalModuleNames.map(moduleName => loadModule(moduleName));
    
    try {
        await Promise.all(loadPromises);
    } catch (error) {
        console.error('Error loading critical modules:', error);
    }
}

// Intersection Observer for Optimized Loading
const moduleObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const moduleName = entry.target.dataset.module;
            if (moduleName && !criticalModules[moduleName]) {
                loadModule(moduleName);
            }
            moduleObserver.unobserve(entry.target);
        }
    });
}, { rootMargin: '100px' });

// Loading based on elements present in the DOM
document.addEventListener('DOMContentLoaded', async function () {
    await loadCriticalModules();
    
    const lazyElements = document.querySelectorAll('[data-module]');
    if (lazyElements.length > 0) {
        lazyElements.forEach(e => {
            const moduleName = e.dataset.module;
            if (!criticalModules[moduleName]) {
                moduleObserver.observe(e);
            }
        });
    }
});

// Function to set a module as critical dynamically
window.setCriticalModule = function(moduleName, isCritical = true) {
    if (!lazyLoadModules[moduleName]) {
        console.warn(`Module ${moduleName} not found in lazyLoadModules`);
        return false;
    }
    
    criticalModules[moduleName] = isCritical;
    
    if (isCritical && !loadedModules.has(moduleName)) {
        loadModule(moduleName);
    }
    return true;
};

// Function to get the status of loaded modules
window.getModuleStatus = function() {
    return {
        available: Object.keys(lazyLoadModules),
        loaded: Array.from(loadedModules.keys()),
        critical: Object.keys(criticalModules).filter(name => criticalModules[name]),
        registeredFunctions: Object.keys(window.moduleRegistry).filter(key => typeof window.moduleRegistry[key] === 'function'),
        registeredModules: Object.keys(window.moduleRegistry).filter(key => typeof window.moduleRegistry[key] === 'object'),
    }
};

// Utility function to check if a function is available
window.isFunctionAvailable = function(functionName) {
    return typeof window.moduleRegistry[functionName] === 'function';
};

// Auto-loading wrapper - creates a proxy that automatically loads modules when functions are accessed
window.autoLoad = new Proxy({}, {
    get(target, prop) {
        return async function(...args) {
            const fn = await getModuleExport(prop);
            if (typeof fn === 'function') {
                return fn.apply(this, args);
            }
            throw new Error(`Function ${prop} not found in any module`);
        };
    }
});