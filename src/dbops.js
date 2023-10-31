const express = require('express');

function createRouter(db) {
	const router = express.Router();

    router.post('/client/add', (req, res, next) => {
        console.log(req.body)
        if(req.body===null || Object.keys(req.body).length === 0)
		res.status(500).json({status: 'error: data null'});

        db.query(
            'INSERT INTO clients (name, lastname, email) VALUES (?,?,?)',
            [req.body.name, req.body.lastname, req.body.email],
            (error) => {
                if (error) {
                    console.error(error);
                    res.status(500).json({status: 'error'});
                } else {
                    res.status(200).json({status: 'ok'});
                }
            }
    
        );
    
    });

    router.get('/client/get', function (req, res, next) {
        db.query(
            'SELECT id, name, lastname, email FROM clients',
            (error, results) => { // Corregir el nombre de la variable a "results"
                if (error) {
                    console.log(error);
                    res.status(500).json({ status: 'error' });
                } else {
                    res.status(200).json(results);
                }
            }
        );
    });    

    router.get('/client/:id', function (req, res, next) {
        db.query(
            'SELECT id, name, lastname, email FROM clients WHERE id='+ req.params.id,
            (error, results) => {
                if (error) {
                    console.log(error);
                    res.status(500).json({status: 'error'});
                } else {
                    res.status(200).json(results);
                }
            }
        );    
    });

    // Ruta para actualizar un cliente por ID
    router.put('/client/update/:id', function (req, res, next) {
        console.log(req.params.id);
        const namep = req.body.name;
        const lastnamep = req.body.lastname;
        const emailp= req.body.email;
        const idp = req.params.id;
    
        db.query(
            'UPDATE clients SET name=?, lastname=?, email=? WHERE id=?',
            [namep, lastnamep, emailp, idp],
            (error) => {
                if (error) {
                    res.status(500).json({status: 'error'});
                } else {
                    res.status(200).json({status: 'Updated'});
                }
            }
        );
    });
    

    router.delete('/client/delete/:id', function (req, res, next) {
        console.log(req.params.id);
        var pid=req.params.id
        var qry='DELETE FROM clients WHERE id=' + [pid];
        console.log(qry)
    
        db.query(qry,
            (error, result) => {
                if (error) {
                    console.log(error);
                    res.status(500).json({status: 'error'});
                } else {
                    console.log(result)
                    res.status(200).json({status: 'ok'});
                }
            }
        );
    });

	return router;
}

module.exports = createRouter;
