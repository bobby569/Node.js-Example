require('./config/config');

const _ = require('lodash');
const express = require('express');
const parser = require('body-parser');
const { ObjectID } = require('mongodb');
const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');
const { authenticate } = require('./middleware/authenticate');

const app = express();
app.use(parser.json());

app.post('/todos', (req, res) => {
	const { text } = req.body;
	const todo = new Todo({ text });

	todo
		.save()
		.then(doc => res.send(doc))
		.catch(err => res.status(400).send(err));
});

app.get('/todos', (req, res) => {
	Todo.find()
		.then(todos => res.send({ todos }))
		.catch(err => res.status(400).send(err));
});

app.get('/todos/:id', (req, res) => {
	const { id } = req.params;
	if (!ObjectID.isValid(id)) return res.status(400).send('ID invalid');
	Todo.findById(id)
		.then(todo => {
			if (!todo) return res.status(404).send('Todo not found');
			res.send({ todo });
		})
		.catch(err => res.status(400).send(err));
});

app.delete('/todos/:id', (req, res) => {
	const { id } = req.params;
	if (!ObjectID.isValid(id)) return res.status(400).send('ID invalid');
	Todo.findByIdAndRemove(id)
		.then(todo => {
			if (!todo) return res.status(404).send('Todo not exist');
			res.send({ todo });
		})
		.catch(err => res.status(400).send(err));
});

app.patch('/todos/:id', (req, res) => {
	const { id } = req.params;
	let body = _.pick(req.body, ['text', 'completed']);
	if (!ObjectID.isValid(id)) return res.status(400).send('ID invalid');
	if (_.isBoolean(body.completed) && body.completed) {
		body.completedAt = new Date().getTime();
	} else {
		body.completed = false;
		body.completedAt = null;
	}
	Todo.findByIdAndUpdate(id, { $set: body }, { new: true })
		.then(todo => {
			if (!todo) return res.status(404).send('Todo not exist');
			res.send({ todo });
		})
		.catch(err => res.status(400).send(err));
});

app.get('/users/me', authenticate, (req, res) => {
	res.send(req.user);
});

app.post('/users', (req, res) => {
	const body = _.pick(req.body, ['email', 'password']);
	const user = new User(body);

	user
		.save()
		.then(() => user.generateAuthToken())
		.then(token => res.header('x-auth', token).send(user))
		.catch(err => res.status(400).send(err));
});

app.post('/users/login', (req, res) => {
	const body = _.pick(req.body, ['email', 'password']);

	User.findByCredentials(body.email, body.password)
		.then(user =>
			user
				.generateAuthToken()
				.then(token => res.header('x-auth', token).send(user))
		)
		.catch(err => res.status(400).send());
});

app.delete('/users/me/token', authenticate, (req, res) => {
	req.user
		.removeToken(req.token)
		.then(() => res.status(200).send())
		.catch(err => res.status(400).send());
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serving on http://localhost:${PORT}`));

module.exports = { app };
