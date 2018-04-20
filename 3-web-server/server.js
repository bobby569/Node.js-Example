const express = require('express');
const hbs = require('hbs');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 8000;

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

app.use((req, res, next) => {
	const time = new Date().toString();
	const log = `${time}: ${req.method} ${req.url}\n`;
	fs.appendFile('server.log', log, err => {
		if (err) console.log('err!');
	});
	next();
});

// app.use((req, res, next) => {
// 	res.render('maintain.hbs');
// });

app.use(express.static(__dirname + '/src'));

hbs.registerHelper('getCurrentYear', () => {
	return new Date().getFullYear();
});

hbs.registerHelper('scream', text => {
	return text.toUpperCase();
});

app.get('/', (req, res) => {
	res.send('Main');
});

app.get('/home', (req, res) => {
	res.render('home.hbs', {
		title: 'Home',
		msg: 'Welcome to my website'
	});
});

app.get('/about', (req, res) => {
	res.render('about.hbs', {
		title: 'About page'
	});
});

app.get('/bad', (req, res) => {
	res.send({
		error: 'Unable to handle the request'
	});
});

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
