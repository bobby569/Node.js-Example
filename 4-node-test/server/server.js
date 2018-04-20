const express = require('express');

const app = express();

const data = [
	{
		name: 'Bobby',
		age: 21
	},
	{
		name: 'J',
		age: 30
	}
];

app.get('/', (req, res) => res.send('Hello world'));

app.get('/users', (req, res) => res.send(data));

app.listen(3000);

module.exports = { app };
