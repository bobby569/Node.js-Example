const jwt = require('jsonwebtoken');
const { ObjectID } = require('mongodb');
const { Todo } = require('../../models/todo');
const { User } = require('../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

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

const users = [
	{
		_id: userOneId,
		email: 'test1@example.com',
		password: 'userOnePass',
		token: [
			{
				access: 'auth',
				token: jwt.sign({ _id: userOneId, access: 'auth' }, 'secret').toString() // Not working
			}
		]
	},
	{
		_id: userTwoId,
		email: 'test2@example.com',
		password: 'userTwoPass'
	}
];

const populateTodos = done => {
	Todo.remove({})
		.then(() => Todo.insertMany(todos))
		.then(() => done());
};

const populateUsers = done => {
	User.remove({})
		.then(() => {
			const userOne = new User(users[0]).save();
			const userTwo = new User(users[1]).save();
			return Promise.all([userOne, userTwo]);
		})
		.then(() => done());
};

module.exports = { todos, users, populateTodos, populateUsers };
