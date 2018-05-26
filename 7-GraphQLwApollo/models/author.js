import mongoose, { Schema } from 'mongoose';

const authorSchema = new Schema({
	name: String,
	age: Number,
	books: [String]
});

export default mongoose.model('author', authorSchema);
