const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
	if (err) return console.log('Unable to connect to MongoDB server');
	console.log('Connect to server');
	const db = client.db('TodoApp');

	// db
	// 	.collection('Todos')
	// 	.find({ _id: new ObjectID('5a9b7dfb6a83fc4f71e06b2d') })
	// 	.toArray()
	// 	.then(docs => console.log(JSON.stringify(docs, undefined, 2)))
	// 	.catch(err => console.log('Unable to fetch todos', err));

	// db
	// 	.collection('Todos')
	// 	.find()
	// 	.count()
	// 	.then(count => console.log(`Count: ${count}`))
	// 	.catch(err => console.log('Unable to fetch todos', err));

	client.close();
});
