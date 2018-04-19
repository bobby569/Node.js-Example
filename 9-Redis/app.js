const path = require('path');
const redis = require('redis');
const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

const client = redis.createClient({ password: 'bobby' });
client.on('connect', () => console.log('connected to redis'));
const port = 3000;
const app = express();

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(methodOverride('_method'));

app.get('/', (req, res) => {
	res.render('searchusers');
});

app.post('/user/search', (req, res) => {
	const { id } = req.body;

	client.hgetall(id, (err, user) => {
		if (err || !user) {
			res.render('searchusers', {
				error: 'User not exist'
			});
		} else {
			user.id = id;
			res.render('details', { user });
		}
	});
});

app.get('/user/add', (req, res) => {
	res.render('adduser');
});

app.post('/user/add', (req, res) => {
	const { id, first_name, last_name, email, phone } = req.body;
	client.hmset(
		id,
		[
			'first_name',
			first_name,
			'last_name',
			last_name,
			'email',
			email,
			'phone',
			phone
		],
		(err, reply) => {
			if (err) console.log(err);
			res.redirect('/');
		}
	);
});

app.delete('/user/delete/:id', (req, res) => {
	client.del(req.params.id);
	res.redirect('/');
});

app.listen(port, () => console.log(`Server up on ${port}`));
