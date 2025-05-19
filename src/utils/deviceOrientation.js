import FULLTILT from './third-party/fulltilt.js';

let controls = null;


/**
 * Inizializza i sensori e l'orientamento del dispositivo
 */
async function initDeviceSensors() {
    try {
        // Richiedi permessi e inizializza
        const orientation = await FULLTILT.getDeviceOrientation({ type: "world" });
        controls = orientation;

    } catch (error) {
        console.error('Errore sensori:', error);
        alert(`Errore: ${error.message}`);
    }
}


/**
 * Calcola l'angolo di rotazione in gradi dalla matrice di rotazione
 * @returns {number} L'angolo di rotazione in gradi
 */
function getDeviceYaw() {
    if (!controls) return 0;
    const matrix = controls.getScreenAdjustedMatrix();
    const elem = matrix.elements[6];
    const rollRad = Math.asin(-elem);
    var rollDeg = rollRad * 180 / Math.PI * -1;
    return rollDeg;
}


export { initDeviceSensors, getDeviceYaw };