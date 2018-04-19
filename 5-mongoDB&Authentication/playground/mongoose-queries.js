const { ObjectID } = require('mongodb');
const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo');

const id = '5aaeeb433740b03600817c8a';
if (!ObjectID.isValid(id)) return console.log('ID invalid');

Todo.find({ _id: id }).then(todos => console.log(todos));

Todo.findOne({ _id: id }).then(todo => console.log(todo));

Todo.findById(id).then(todo => {
	if (!todo) return console.log('Id not found');
	console.log(todo);
});
