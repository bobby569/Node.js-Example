const fs = require('fs');
const FILE = 'notes-data.json';

const fetchNotes = () => {
	try {
		const notesString = fs.readFileSync(FILE);
		return JSON.parse(notesString);
	} catch (e) {
		return [];
	}
};

const saveNotes = notes => {
	fs.writeFileSync(FILE, JSON.stringify(notes));
};

const addNote = (title, body) => {
	const notes = fetchNotes();

	const duplicate = notes.filter(note => note.title === title);
	if (duplicate.length > 0) return null;

	const note = { title, body };
	notes.push(note);
	saveNotes(notes);
	return note;
};

const getAll = () => {
	return fetchNotes();
};

const getNode = title => {
	const notes = fetchNotes();
	const filtered = notes.filter(note => note.title === title);
	return filtered[0];
};

const removeNote = title => {
	const notes = fetchNotes();
	const res = notes.filter(note => note.title !== title);
	saveNotes(res);
	return notes.length - 1 === res.length;
};

module.exports = { addNote, getAll, getNode, removeNote };
