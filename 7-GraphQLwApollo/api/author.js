import { makeExecutableSchema } from 'graphql-tools';
import authorModel from '../models/author';

const typeDefs = `
  type Author {
    age: Int
    name: String
    books: [String]
  }
  type Query {
    authors: [Author]
    author(_id: String): Author
  }
  type Mutation {
    addAuthor(name: String!, age: Int!, books: [String]!): Author
    deleteAuthor(_id: String!): Author
    updateAuthor(_id: String!, name: String!): Author
  }
`;

const resolvers = {
	Query: {
		authors: () => authorModel.find({}),
		author: (root, { _id }) => authorModel.find({ _id })
	},
	Mutation: {
		addAuthor: (root, { name, age, books }) => {
			const author = new authorModel({ name, age, books });
			return author.save();
		},
		deleteAuthor: (root, { _id }) => authorModel.findOneAndRemove({ _id }),
		updateAuthor: (root, { _id, name }) =>
			authorModel.findOneAndUpdate({ _id }, { name })
	}
};

export default makeExecutableSchema({ typeDefs, resolvers });
