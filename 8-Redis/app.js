const bodyParser = require('body-parser');
const app = require('express')();
const client = require('redis').createClient();
client.on('connect', () => console.log('Redis connected'));

app.engine(
	'handlebars',
	require('express-handlebars')({ defaultLayout: 'main' })
);
app.set('view engine', 'handlebars');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(require('method-override')('_method'));

app.get('/', (req, res) => res.render('searchusers'));

app.get('/user/add', (req, res) => res.render('adduser'));

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

app.listen(3000, () => console.log(`Server up on 3000`));
