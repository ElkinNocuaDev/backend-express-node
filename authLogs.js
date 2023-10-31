const authLogs = require('./authLogs');

function addLoginLogs(db, params) {
    db.query(
        'INSERT INTO login_logs (userid, action, action_timestamp, action_status) VALUES (?,?,?,?)',
        [params.id, params.action, new Date(), params.action_status],
        (error, results) => {
            if (error) {
                console.error(error);
                // Maneja el error, por ejemplo, lanza una excepción o retorna un código de error.
            } else {
                // El registro se insertó exitosamente.
                console.log('Login log inserted');
                // Realiza cualquier acción adicional si es necesario.
            }
        }
    );
}

module.exports = addLoginLogs;
