const request = require('supertest');
const { ObjectID } = require('mongodb');
const { app } = require('../server');
const { Todo } = require('../models/todo');

const todos = [
	{
		_id: new ObjectID(),
		text: 'First'
	},
	{
		_id: new ObjectID(),
		text: 'Second',
		completed: true,
		completedAt: 123456
	}
];

beforeEach(done => {
	Todo.remove({})
		.then(() => Todo.insertMany(todos))
		.then(() => done());
});

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