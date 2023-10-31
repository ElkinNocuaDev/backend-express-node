// Importa los módulos necesarios si es necesario
// const crypto = require('crypto');

function generateUniqueID() {
    // Genera un ID único utilizando una combinación de timestamp y un valor hash
    const timestamp = Date.now().toString(36);
    const randomValue = Math.random().toString(36).substr(2, 5); // Valor aleatorio de 5 caracteres
    // Puedes usar otro método para generar un valor hash si lo prefieres
    // const randomValue = crypto.randomBytes(5).toString('hex');

    const uniqueID = timestamp + '-' + randomValue;
    return uniqueID;
}

module.exports = generateUniqueID; // No necesitas exportar como module.exports