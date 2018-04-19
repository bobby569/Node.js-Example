import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import bodyParser from 'body-parser';
import express from 'express';
import mongoose from 'mongoose';
import author from './api/author';

mongoose.connect('mongodb://localhost/graphql');

const app = express();
app.use(bodyParser.json());

// Development purpose
app.use(
	'/graphiql',
	graphiqlExpress({
		endpointURL: '/graphql'
	})
);

app.use('/graphql', graphqlExpress({ schema: author }));

app.listen(3000, () => console.log('Listen on port 3000'));
