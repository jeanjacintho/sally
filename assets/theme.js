import { __privateGet, __privateAdd, __privateSet, __privateMethod } from './private-helpers.js';

// Modules available for lazy loading
const lazyLoadModules = {
    // Modules here are defined with their respective import paths
};
// Control of loaded modules
const loadedModules = new Set();
// Function to load modules on demand
window.loadModule = async function (moduleName) {
    if (loadedModules.has(moduleName)) { return; }
    if (!lazyLoadModules[moduleName]) {
        console.warn(`Module ${moduleName} not found`);
        return;
    }
    try {
        const module = await lazyLoadModules[moduleName]();
        loadedModules.add(moduleName);
        return module;
    } catch (error) {
        console.error(`Error loading module ${moduleName}:`, error);
    }
};
// Intersection Observer for Optimized Loading
const moduleObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const moduleName = entry.target.dataset.module;
            if (moduleName) {
                loadModule(moduleName);
            }
            moduleObserver.unobserve(entry.target);
        }
    });
}, { rootMargin: '100px' });
// Loading based on elements present in the DOM
document.addEventListener('DOMContentLoaded', function () {
    // For elements with data-module, use observer to load when visible
    const lazyElements = document.querySelectorAll('[data-module]');
    if (lazyElements.length > 0) {
        lazyElements.forEach(e => moduleObserver.observe(e));
    }
});