'use strict';

// ===== CLASE PRINCIPAL DE LA CAFETERÍA =====
class Cafeteria {
    constructor() {
        this.productos = [];
        this.carrito = [];
        this.total = 0;
        this.categorias = ['todos', 'cafe', 'panaderia', 'postre'];
        this.categoriaActual = 'todos';
        
        this.inicializar();
    }

    // Inicializa la aplicación
    inicializar() {
        this.cargarProductos();
        this.cargarCarrito();
        this.renderizarProductos();
        this.renderizarCarrito();
        this.configurarEventos();
    }

    async cargarProductos() {
        
        if (CONFIG.isLocalFile()) {
            this.productos = [
                { id: 1, nombre: "Espresso", precio: 2000, descripcion: "Café negro concentrado y aromático", categoria: "cafe", imagen: "img/espresso.jpg", fallback: "☕" },
                { id: 2, nombre: "Latte", precio: 2500, descripcion: "Café con leche cremosa y suave", categoria: "cafe", imagen: "img/latte.jpg", fallback: "🥛" },
                { id: 3, nombre: "Cappuccino", precio: 3000, descripcion: "Café con espuma de leche perfecta", categoria: "cafe", imagen: "img/cappuccino.jpg", fallback: "☕" },
                { id: 4, nombre: "Mocha", precio: 3500, descripcion: "Café con chocolate y leche", categoria: "cafe", imagen: "img/mocha.jpg", fallback: "🍫" },
                { id: 5, nombre: "Americano", precio: 2000, descripcion: "Café negro diluido con agua caliente", categoria: "cafe", imagen: "img/americano.jpg", fallback: "☕" },
                { id: 6, nombre: "Croissant", precio: 2700, descripcion: "Panadería francesa tradicional", categoria: "panaderia", imagen: "img/croissant.jpg", fallback: "🥐" },
                { id: 7, nombre: "Torta de Chocolate", precio: 4321, descripcion: "Deliciosa torta casera", categoria: "postre", imagen: "img/torta_de_chocolate.avif", fallback: "🍰" }
            ];
            return;
        }


        try {
            const response = await fetch('./data/productos.json');
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            this.productos = await response.json();
        } catch (error) {

            this.productos = [
                { id: 1, nombre: "Espresso", precio: 2000, descripcion: "Café negro concentrado y aromático", categoria: "cafe", imagen: "img/espresso.jpg", fallback: "☕" },
                { id: 2, nombre: "Latte", precio: 2500, descripcion: "Café con leche cremosa y suave", categoria: "cafe", imagen: "img/latte.jpg", fallback: "🥛" },
                { id: 3, nombre: "Cappuccino", precio: 3000, descripcion: "Café con espuma de leche perfecta", categoria: "cafe", imagen: "img/cappuccino.jpg", fallback: "☕" },
                { id: 4, nombre: "Mocha", precio: 3500, descripcion: "Café con chocolate y leche", categoria: "cafe", imagen: "img/mocha.jpg", fallback: "🍫" },
                { id: 5, nombre: "Americano", precio: 2000, descripcion: "Café negro diluido con agua caliente", categoria: "cafe", imagen: "img/americano.jpg", fallback: "☕" },
                { id: 6, nombre: "Croissant", precio: 2700, descripcion: "Panadería francesa tradicional", categoria: "panaderia", imagen: "img/croissant.jpg", fallback: "🥐" },
                { id: 7, nombre: "Torta de Chocolate", precio: 4321, descripcion: "Deliciosa torta casera", categoria: "postre", imagen: "img/torta_de_chocolate.avif", fallback: "🍰" }
            ];
        }
    }


    cargarCarrito() {
        const carritoGuardado = localStorage.getItem('cafeteriaCarrito');
        if (carritoGuardado) {
            this.carrito = JSON.parse(carritoGuardado);
            this.calcularTotal();
        }
    }


    guardarCarrito() {
        localStorage.setItem('cafeteriaCarrito', JSON.stringify(this.carrito));
    }


    agregarAlCarrito(producto) {
        const itemExistente = this.carrito.find(item => item.id === producto.id);
        
        if (itemExistente) {
            itemExistente.cantidad += 1;
        } else {
            this.carrito.push({
                ...producto,
                cantidad: 1
            });
        }
        
        this.calcularTotal();
        this.guardarCarrito();
        this.renderizarCarrito();
        this.mostrarNotificacion(`${producto.nombre} agregado al carrito`);
    }


    removerDelCarrito(id) {
        this.carrito = this.carrito.filter(item => item.id !== id);
        this.calcularTotal();
        this.guardarCarrito();
        this.renderizarCarrito();
        this.mostrarNotificacion('Producto removido del carrito');
    }


    actualizarCantidad(id, nuevaCantidad) {
        if (nuevaCantidad <= 0) {
            this.removerDelCarrito(id);
            return;
        }
        
        const item = this.carrito.find(item => item.id === id);
        if (item) {
            item.cantidad = nuevaCantidad;
            this.calcularTotal();
            this.guardarCarrito();
            this.renderizarCarrito();
        }
    }


    calcularTotal() {
        this.total = this.carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    }


    limpiarCarrito() {
        this.carrito = [];
        this.total = 0;
        this.guardarCarrito();
        this.renderizarCarrito();
        this.mostrarNotificacion('Carrito limpiado');
    }


    finalizarCompra() {
        if (this.carrito.length === 0) {
            this.mostrarNotificacion('El carrito está vacío', 'error');
            return;
        }

        const historial = JSON.parse(localStorage.getItem('cafeteriaHistorial') || '[]');
        const compra = {
            fecha: new Date().toISOString(),
            items: [...this.carrito],
            total: this.total
        };
        
        historial.push(compra);
        localStorage.setItem('cafeteriaHistorial', JSON.stringify(historial));
        
        this.mostrarResumenCompra(compra);
        this.limpiarCarrito();
    }


    filtrarPorCategoria(categoria) {
        this.categoriaActual = categoria;
        this.renderizarProductos();
    }


    renderizarProductos() {
        const contenedor = document.getElementById('productos-container');
        if (!contenedor) return;

        const productosFiltrados = this.categoriaActual === 'todos' 
            ? this.productos 
            : this.productos.filter(p => p.categoria === this.categoriaActual);

        contenedor.innerHTML = productosFiltrados.map(producto => `
            <div class="producto-card" data-id="${producto.id}">
                <div class="producto-imagen">
                    <img src="${producto.imagen}" 
                        alt="${producto.nombre}" 
                        onerror="this.style.display='none'; this.nextElementSibling.style.display='block';"
                        class="producto-imagen-real">
                    <span class="producto-imagen-fallback" style="display: none; font-size: 3rem;">${producto.fallback}</span>
                </div>
                <div class="producto-info">
                    <h3>${producto.nombre}</h3>
                    <p class="producto-descripcion">${producto.descripcion}</p>
                    <p class="producto-precio">$${producto.precio}</p>
                    <button class="btn-agregar" onclick="cafeteria.agregarAlCarrito(${JSON.stringify(producto).replace(/"/g, '&quot;')})">
                        Agregar al Carrito
                    </button>
                </div>
            </div>
        `).join('');
    }


    renderizarCarrito() {
        const contenedor = document.getElementById('carrito-container');
        const totalElement = document.getElementById('total-carrito');
        const contadorElement = document.getElementById('carrito-contador');
        
        if (!contenedor || !totalElement || !contadorElement) return;


        const totalItems = this.carrito.reduce((sum, item) => sum + item.cantidad, 0);
        contadorElement.textContent = totalItems;

        if (this.carrito.length === 0) {
            contenedor.innerHTML = '<p class="carrito-vacio">Tu carrito está vacío</p>';
        } else {
            contenedor.innerHTML = this.carrito.map(item => `
                <div class="carrito-item" data-id="${item.id}">
                    <div class="carrito-item-info">
                        <span class="carrito-item-nombre">${item.nombre}</span>
                        <span class="carrito-item-precio">$${item.precio}</span>
                    </div>
                    <div class="carrito-item-controles">
                        <button class="btn-cantidad" onclick="cafeteria.actualizarCantidad(${item.id}, ${item.cantidad - 1})">-</button>
                        <span class="cantidad">${item.cantidad}</span>
                        <button class="btn-cantidad" onclick="cafeteria.actualizarCantidad(${item.id}, ${item.cantidad + 1})">+</button>
                        <button class="btn-remover" onclick="cafeteria.removerDelCarrito(${item.id})">🗑️</button>
                    </div>
                </div>
            `).join('');
        }

        totalElement.textContent = `$${this.total.toFixed(2)}`;
    }


    mostrarNotificacion(mensaje, tipo = 'success') {
        const notificacion = document.createElement('div');
        notificacion.className = `notificacion notificacion-${tipo}`;
        notificacion.textContent = mensaje;
        
        document.body.appendChild(notificacion);
        
        setTimeout(() => {
            notificacion.classList.add('mostrar');
        }, 100);
        
        setTimeout(() => {
            notificacion.classList.remove('mostrar');
            setTimeout(() => {
                document.body.removeChild(notificacion);
            }, 300);
        }, 3000);
    }


    mostrarResumenCompra(compra) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-contenido">
                <h2>¡Compra Finalizada! 🎉</h2>
                <div class="resumen-compra">
                    <h3>Resumen de tu pedido:</h3>
                    ${compra.items.map(item => `
                        <div class="resumen-item">
                            <span>${item.nombre} x${item.cantidad}</span>
                            <span>$${(item.precio * item.cantidad).toFixed(2)}</span>
                        </div>
                    `).join('')}
                    <div class="resumen-total">
                        <strong>Total: $${compra.total.toFixed(2)}</strong>
                    </div>
                </div>
                <p>¡Gracias por tu compra! Tu pedido está siendo preparado.</p>
                <button class="btn-cerrar" onclick="this.closest('.modal').remove()">Cerrar</button>
            </div>
        `;
        
        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('mostrar'), 100);
    }


    configurarEventos() {
        document.querySelectorAll('.filtro-categoria').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const categoria = e.target.dataset.categoria;
                
                if (categoria) {
                    this.filtrarPorCategoria(categoria);
                    
                    document.querySelectorAll('.filtro-categoria').forEach(b => b.classList.remove('activo'));
                    e.target.classList.add('activo');
                }
            });
        });


        const btnLimpiar = document.getElementById('btn-limpiar-carrito');
        const btnFinalizar = document.getElementById('btn-finalizar-compra');
        
        if (btnLimpiar) {
            btnLimpiar.addEventListener('click', () => this.limpiarCarrito());
        }
        
        if (btnFinalizar) {
            btnFinalizar.addEventListener('click', () => this.finalizarCompra());
        }
    }
}

// ===== INICIALIZACIÓN DE LA APLICACIÓN =====
let cafeteria;


document.addEventListener('DOMContentLoaded', () => {
    cafeteria = new Cafeteria();
});

// ===== FUNCIONES UTILITARIAS =====
function formatearPrecio(precio) {
    return `$${precio.toFixed(2)}`;
}

function formatearFecha(fecha) {
    return new Date(fecha).toLocaleDateString('es-AR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
} 

//Saludos Gonzalo Rivero