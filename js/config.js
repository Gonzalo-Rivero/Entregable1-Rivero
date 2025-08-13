// Configuración automática del entorno
const CONFIG = {
    // Detecta si estamos en un servidor web o archivo local
    isLocalFile: () => {
        return window.location.protocol === 'file:';
    },
    
    // URL base para los recursos
    getBaseUrl: () => {
        return CONFIG.isLocalFile() ? '' : window.location.origin;
    },
    
    // Ruta para productos
    getProductosPath: () => {
        return CONFIG.isLocalFile() ? null : './data/productos.json';
    },
    
    // Modo de funcionamiento
    getMode: () => {
        return CONFIG.isLocalFile() ? 'offline' : 'online';
    }
};
