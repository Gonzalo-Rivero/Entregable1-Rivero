'use strict';

// — Variables y estructuras de datos
const menu = ['Espresso', 'Latte', 'Cappuccino'];
const precios = [50, 70, 80];
let total = 0;

/**Muestra el menú en la consola con índice y precio.*/
function mostrarMenu() {
    console.clear();
    console.log('🍽️  Menú de la cafetería:');
    menu.forEach((nombre, i) => {
        console.log(`${i + 1}. ${nombre} — $${precios[i].toFixed(2)}`);
    });
}

/**
    Pide al usuario que elija un café por número,
    Mostrando junto a cada opción su precio,
    Valida la entrada y suma el precio al total.
*/
function pedirCafe() {
    const listaConPrecios = menu
        .map((nombre, i) => `${i + 1}. ${nombre} — $${precios[i].toFixed(2)}`)
        .join('\n');

    const eleccion = prompt(
        'Ingresa el número del café que quieres pedir:\n' + listaConPrecios
    );
    const idx = parseInt(eleccion, 10) - 1;

    if (isNaN(idx) || idx < 0 || idx >= menu.length) {
        alert('❌ Selección inválida. Por favor ingresa un número válido.');
        return;
    }

    total += precios[idx];
    console.log(`✔️  Agregaste: ${menu[idx]} — $${precios[idx].toFixed(2)}`);
    console.log(`💵  Subtotal: $${total.toFixed(2)}`);
}

/**
Muestra el total final y agradece al cliente.
*/
function mostrarTotal() {
    alert(`🧾 Tu cuenta total es: $${total.toFixed(2)}\n\n¡Gracias por tu compra!`);
    console.log('🎉 Compra finalizada.');
}

/**
    Bucle principal: muestra menú, pide cafés y pregunta si sigue pidiendo.
**/
function iniciarSimulador() {
    console.log('--- Bienvenido al simulador de cafetería ---');
    let seguirPidiendo;

    do {
        mostrarMenu();
        pedirCafe();
        seguirPidiendo = confirm('¿Deseas pedir otro café?');
    } while (seguirPidiendo);

    mostrarTotal();
}

// Arranca el simulador al cargar el script
iniciarSimulador();

//***Saludos al que lea esto.
//!Atte: Gonzalo Rivero */ */