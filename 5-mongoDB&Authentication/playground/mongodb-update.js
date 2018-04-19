const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
	if (err) return console.log('Unable to connect to MongoDB server');
	console.log('Connect to server');
	const db = client.db('TodoApp');

	// db
	// 	.collection('Users')
	// 	.findOneAndUpdate(
	// 		{ _id: new ObjectID('5a9b7eb1b0a0154f99ba2f1c') },
	// 		{
	// 			$set: {
	// 				name: 'Bobby'
	// 			},
	// 			$inc: {
	// 				age: 1
	// 			}
	// 		},
	// 		{ returnOriginal: false }
	// 	)
	// 	.then(res => console.log(res));

	client.close();
});
