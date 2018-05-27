const request = require('supertest');
const { ObjectID } = require('mongodb');
const { app } = require('../server');
const { Todo } = require('../models/todo');
const { User } = require('../models/user');
const { todos, users, populateTodos, populateUsers } = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
	test('should create a new todo', done => {
		const text = 'Test todo text';
		request(app)
			.post('/todos')
			.send({ text })
			.then(res => {
				expect(res.statusCode).toBe(200);
				expect(res.body.text).toBe(text);
				Todo.find({ text })
					.then(todos => {
						expect(todos.length).toBe(1);
						expect(todos[0].text).toBe(text);
						done();
					})
					.catch(err => done(err));
			})
			.catch(err => done(err));
	});

	test('should not create todo with invalid body data', done => {
		request(app)
			.post('/todos')
			.send({})
			.expect(400)
			.end((err, res) => {
				if (err) return done(err);
				Todo.find()
					.then(todos => {
						expect(todos.length).toBe(2);
						done();
					})
					.catch(e => done(e));
			});
	});
});

describe('GET /todos', () => {
	test('should get all todos', done => {
		request(app)
			.get('/todos')
			.expect(200)
			.expect(res => expect(res.body.todos.length).toBe(2))
			.end(done);
	});
});

describe('GET /todos/:id', () => {
	test('should get todo', done => {
		request(app)
			.get(`/todos/${todos[0]._id.toHexString()}`)
			.expect(200)
			.expect(res => expect(res.body.todo.text).toBe(todos[0].text))
			.end(done);
	});

	test('404 if not found', done => {
		const hexId = new ObjectID().toHexString();
		request(app)
			.get(`/todos/${hexId}`)
			.expect(404)
			.end(done);
	});

	test('400 if id invalid', done => {
		request(app)
			.get('/todos/abc123')
			.expect(400)
			.end(done);
	});
});

describe('DELETE /todos/:id', () => {
	test('should remove a todo', done => {
		const hexId = todos[1]._id.toHexString();
		request(app)
			.delete(`/todos/${hexId}`)
			.expect(200)
			.expect(res => {
				expect(res.body.todo._id).toBe(hexId);
			})
			.end((err, res) => {
				if (err) return done(err);
				Todo.findById(hexId)
					.then(todo => {
						expect(todo).toBe(null);
						done();
					})
					.catch(err => done(err));
			});
	});

	test('return 404 if todo not found', done => {
		const hexId = new ObjectID().toHexString();
		request(app)
			.delete(`/todos/${hexId}`)
			.expect(404)
			.end(done);
	});

	test('400 if object id is invalid', done => {
		request(app)
			.delete(`/todos/abc123`)
			.expect(400)
			.end(done);
	});
});

describe('PATCH /todos/:id', () => {
	test('should update tood', done => {
		const hexId = todos[0]._id.toHexString();
		const text = 'New text';
		request(app)
			.patch(`/todos/${hexId}`)
			.send({ completed: true, text })
			.expect(200)
			.expect(res => {
				expect(res.body.todo.text).toBe(text);
				expect(res.body.todo.completed).toBe(true);
				expect(typeof res.body.todo.completedAt).toBe('number');
			})
			.end(done);
	});

	test('should clear completedAt when todo is not completed', done => {
		const hexId = todos[1]._id.toHexString();
		const text = 'New text';
		request(app)
			.patch(`/todos/${hexId}`)
			.send({ completed: false, text })
			.expect(200)
			.expect(res => {
				expect(res.body.todo.text).toBe(text);
				expect(res.body.todo.completed).toBe(false);
			})
			.end(done);
	});
});

describe('GET /users/me', () => {
	test('should return user if authenticated', done => {
		request(app)
			.get('/users/me')
			.set('x-auth', users[0].tokens[0].token)
			.expect(200)
			.expect(res => {
				expect(res.body._id).toBe(users[0]._id.toHexString());
				expect(res.body.email).toBe(users[0].email);
			})
			.end(done);
	});

	test('should return 401 if not authenticated', done => {
		request(app)
			.get('/users/me')
			.expect(401)
			.expect(res => {
				expect(res.body).toEqual({});
			})
			.end(done);
	});
});

describe('POST /users', () => {
	it('should create a user', done => {
		let email = 'test@test.com',
			password = '123Hello!';

		request(app)
			.post('/users')
			.send({ email, password })
			.expect(200)
			.expect(res => {
				expect(res.headers['x-auth']).not.toBeNull();
				expect(res.body._id).not.toBeNull();
				expect(res.body.email).toBe(email);
			})
			.end(err => {
				if (err) return done(err);
				User.findOne({ email })
					.then(user => {
						expect(user).not.toBeNull();
						expect(user.password).not.toBe(password);
						done();
					})
					.catch(err => done(err));
			});
	});

	it('should return validation errors if request invalid', done => {
		let email = 'wat',
			password = '123';
		request(app)
			.post('/users')
			.send({ email, password })
			.expect(400)
			.end(done);
	});

	it('should not create user if email in use', done => {
		let email = users[0].email,
			password = '123hello!';
		request(app)
			.post('/users')
			.send({ email, password })
			.expect(400)
			.end(done);
	});
});

describe('POST /users/login', () => {
	it('should login user and return auth token', done => {
		request(app)
			.post('/users/login')
			.send({
				email: users[1].email,
				password: users[1].password
			})
			.expect(200)
			.expect(res => expect(res.headers['x-auth']).not.toBeNull())
			.end((err, res) => {
				if (err) return done(err);
				User.findById(users[1]._id)
					.then(user => {
						expect(user.tokens[0]).toMatchObject({
							access: 'auth',
							token: res.headers['x-auth']
						});
						done();
					})
					.catch(err => done(err));
			});
	});

	it('should reject invalid login', done => {
		request(app)
			.post('/users/login')
			.send({
				email: users[1].email,
				password: users[1].password + '1'
			})
			.expect(400)
			.expect(res => expect(res.headers['x-auth']).toBeFalsy())
			.end((err, res) => {
				if (err) return done(err);
				User.findById(users[1]._id)
					.then(user => {
						expect(user.tokens.length).toBe(0);
						done();
					})
					.catch(err => done(err));
			});
	});
});

describe('DELETE /users/me/token', () => {
	it('should remove auth token on logout', done => {
		request(app)
			.delete('/users/me/token')
			.set('x-auth', users[0].tokens[0].token)
			.expect(200)
			.end((err, res) => {
				if (err) return done(err);
				User.findById(users[0]._id)
					.then(user => {
						expect(user.tokens.length).toBe(0);
						done();
					})
					.catch(err => done(err));
			});
	});
});
