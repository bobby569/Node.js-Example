const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
	if (err) return console.log('Unable to connect to MongoDB server');
	console.log('Connect to server');
	const db = client.db('TodoApp');

	db.collection('Todos').insertOne(
		{
			text: 'Todo',
			complete: false
		},
		(err, res) => {
			if (err) return console.log('insert fails', err);
			console.log(JSON.stringify(res.ops));
		}
	);

	// db.collection('Users').insertOne(
	// 	{
	// 		name: 'Bobby',
	// 		age: 21,
	// 		location: 'West Lafayette'
	// 	},
	// 	(err, res) => {
	// 		if (err) return console.log('insert fails', err);
	// 		console.log(JSON.stringify(res.ops));
	// 	}
	// );

	client.close();
});
