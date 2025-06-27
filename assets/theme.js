// js/common/module-loader.js
import { __privateGet, __privateAdd, __privateSet, __privateMethod } from './private-helpers.js';

// Modules available for lazy loading with their dependencies
const lazyLoadModules = {
    dom: {
        loader: () => import('./dom.js'),
        dependencies: []
    },
    menuDisclosure: {
        loader: () => import('./menu-disclosure.js'),
        dependencies: ['customDetails']
    },
    customDetails: {
        loader: () => import('./custom-details.js'),
        dependencies: []
    },
    cartDrawer: {
        loader: () => import('./cart-drawer.js'),
        dependencies: ['vendor', 'drawer', 'dialogElement']
    },
    modal: {
        loader: () => import('./modal.js'),
        dependencies: ['vendor', 'dialogElement']
    },
    drawer: {
        loader: () => import('./drawer.js'),
        dependencies: ['vendor', 'modal']
    },
    dialogElement: {
        loader: () => import('./dialog-element.js'),
        dependencies: ['vendor']
    },
    xHeader: {
        loader: () => import('./header.js'),
        dependencies: ['vendor', 'menuDisclosure', 'dialogElement', 'drawer']
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
    cartDrawer: true,
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
            
            // Make commonly used utility functions available globally
            if (['waitForEvent', 'throttle', 'debounce', 'animate', 'timeline', 'stagger'].includes(exportName)) {
                window[exportName] = exportValue;
            }
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
        
        // Ensure all dependencies are registered in moduleRegistry before loading the module
        if (moduleConfig.dependencies) {
            for (const depName of moduleConfig.dependencies) {
                if (loadedModules.has(depName)) {
                    const depModule = loadedModules.get(depName);
                    registerModuleExports(depName, depModule);
                }
            }
        }
        
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
        
        // Make dom utility functions available globally
        if (loadedModules.has('dom')) {
            const domModule = loadedModules.get('dom');
            if (domModule.throttle) window.throttle = domModule.throttle;
            if (domModule.debounce) window.debounce = domModule.debounce;
            if (domModule.waitForEvent) window.waitForEvent = domModule.waitForEvent;
        }
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

// js/theme.js
(async () => {
  // Ensure vendor module is loaded before accessing its exports
  await loadModule('vendor');
  
  // Wait for themeVariables to be available
  while (!window.themeVariables) {
    await new Promise(resolve => setTimeout(resolve, 10));
  }
  
  // Utility function to extract section ID from a Shopify section element
  window.extractSectionId = function(element) {
    const sectionElement = element.closest('.shopify-section');
    if (sectionElement) {
      return sectionElement.id.replace('shopify-section-', '');
    }
    return null;
  };
  
  // Utility function to fetch cart data
  window.fetchCart = async function() {
    try {
      const response = await fetch('/cart.js');
      return await response.json();
    } catch (error) {
      console.error('Error fetching cart:', error);
      return { item_count: 0, items: [] };
    }
  };
  
  // Utility function to check media queries
  window.matchesMediaQuery = function(query) {
    if (!window.themeVariables?.mediaQueries?.[query]) {
      return window.matchMedia(query).matches;
    }
    return window.matchMedia(window.themeVariables.mediaQueries[query]).matches;
  };
  
  const delegateDocument = new window.moduleRegistry.Delegate(document.documentElement);
  if (window.themeVariables.settings.showPageTransition && window.matchMedia("(prefers-reduced-motion: no-preference)").matches) {
    delegateDocument.on("click", 'a:not([target="_blank"])', async (event, target) => {
      if (event.defaultPrevented || event.ctrlKey || event.metaKey) {
        return;
      }
      if (target.hostname !== window.location.hostname || target.pathname === window.location.pathname) {
        return;
      }
      event.preventDefault();
      await window.moduleRegistry.animate(document.body, { opacity: 0 }, { duration: 0.2 }).finished;
      window.location = target.href;
    });
  }
  delegateDocument.on("click", 'a[href*="#"]', (event, target) => {
    if (event.defaultPrevented || target.matches("[allow-hash-change]") || target.pathname !== window.location.pathname || target.search !== window.location.search) {
      return;
    }
    const url = new URL(target.href);
    if (url.hash === "") {
      return;
    }
    const anchorElement = document.querySelector(url.hash);
    if (anchorElement) {
      event.preventDefault();
      anchorElement.scrollIntoView({ block: "start", behavior: window.matchMedia("(prefers-reduced-motion: no-preference)").matches ? "smooth" : "auto" });
      document.documentElement.dispatchEvent(new CustomEvent("hashchange:simulate", { bubbles: true, detail: { hash: url.hash } }));
    }
  });
  if (navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform)) {
    document.head.querySelector('meta[name="viewport"]').content = "width=device-width, initial-scale=1.0, height=device-height, minimum-scale=1.0, maximum-scale=1.0";
  }
  Array.from(document.querySelectorAll(".prose table")).forEach((table) => {
    table.outerHTML = '<div class="table-scroller">' + table.outerHTML + "</div>";
  });
})();