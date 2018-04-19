const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
	if (err) return console.log('Unable to connect to MongoDB server');
	console.log('Connect to server');
	const db = client.db('TodoApp');

	// deleteMany
	// db
	// 	.collection('Todos')
	// 	.deleteMany({ text: 'Todo' })
	// 	.then(res => console.log(res))
	// 	.catch(err => console.log(err));

	// deteleOne
	// db
	// 	.collection('Todos')
	// 	.deleteOne({ text: 'Todo' })
	// 	.then(res => console.log(res))
	// 	.catch(err => console.log(err));

	// findOneAndDelete
	// db
	// 	.collection('Todos')
	// 	.findOneAndDelete({ text: 'Todo' })
	// 	.then(res => console.log(res))
	// 	.catch(err => console.log(err));

	client.close();
});
