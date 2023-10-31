const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');
const dbops = require('./src/dbops');
const dbroutes = require('./dbRoutes');
const Port = 5000;

const connection = mysql.createConnection({
	host	 : 'localhost',
	user	 : 'root',
	password : 'Vale0511',
	database : 'lincep_db'
});

connection.connect();

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(dbops(connection));
app.use(dbroutes(connection));

app.listen(Port, function() {
	console.log('server running on localhost: ' + Port)
});

app.get('/', function(req, res) {
	res.send('hello server 5000 is working ');
})

app.post('/', function(req, res) {

	res.status(200).send({
		'message enroll': 'data received'
	})
})


