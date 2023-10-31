const express = require('express');
const generateUniqueID = require('./uniqueID');


const authLogs = require('./authLogs');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");

const saltRounds = 10
require('dotenv').config();

function createRouter(db) {
	const router = express.Router();

	// Register User
	router.post('/user/register', async (req, res, next) => {
		if (req.body === null || Object.keys(req.body).length === 0) {
			res.status(500).json({ status: 'error: data null' });
		}

		//var uid = UniqueID();
		var uid = generateUniqueID(); // Llama a la función para generar un ID único
		var new_uid = uid.slice(14) + "-" + Date.now().toString(36);
		const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
		console.log(hashedPassword);

		db.query(
			'INSERT INTO users (id, name, email, mobile, password, last_modified, isactive, islocked) VALUES (?,?,?,?,?,?,?,?)',
			[new_uid, req.body.name, req.body.email, req.body.mobile, hashedPassword, new Date(), 1, 0],
			(error) => {
				if (error) {
					if (error.code === 'ER_DUP_ENTRY') {
						res.status(500).json({ status: 'error', message: 'email or number incorrect' });
					} else {
						res.status(500).json({ status: 'error', message: '' });
					}
				} else {
					res.status(200).json({ status: 'ok', message: '' });
				}
			}
		);
	});

    // Login User
	router.post('/user/login', async (req, res, next) => {

		if(req.body===null || Object.keys(req.body).length === 0)
		res.status(500).json();

		if(!req.body.mobile || !req.body.password)
		res.status(500).json();

        let queryString='SELECT id, mobile, password FROM users WHERE mobile=' + req.body.mobile;

        db.query(queryString, async(error, results) => {
			if(error) res.status(500).json();

			if(! results[0].id) res.status(200).json();

			//const isCorrectPass = await bcrypt.compare(req.body.password, result[0].password);
			const isCorrectPass = await bcrypt.compare(req.body.password, results[0].password);

            if(isCorrectPass)
				{
					authLogs(db, {id:results[0].id, action:'login', action_status:1});
					const jwt_secret = process.env.JWT_SECRET;
					const user_token = jwt.sign({ user: results[0].mobile}, jwt_secret);
					res.status(200).json({token: user_token});
				}
			else
				{
					authLogs(db, {id:results[0].id, action:'login', action_status:0});
					res.status(200).json();
				}


		});

	
	});

    //Verify Token
    router.post('/api/verify', async (req, res, next) => {

	    var token = req.headers['authorization']
	    if(!token) res.status(200).json(false);

	    const jwt_secret = process.env.JWT_SECRET;

	    try {
		    var decoded = jwt.verify(token, jwt_secret);
		    res.status(200).json(true);
	    }

	    catch(err) {
		    res.status(200).json(false);
	    }
    });


//return router;
return router;
}

module.exports = createRouter; // exportar el router