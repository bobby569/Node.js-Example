const fs = require('fs');
const yargs = require('yargs');
const notes = require('./lib/notes');
const { TITLE, BODY } = require('./lib/command');

const argv = yargs
	.command('add', 'Add a new note', { title: TITLE, body: BODY })
	.command('get', 'Read a note by title', { title: TITLE })
	.command('del', 'Delete a note by title', { title: TITLE })
	.command('list', 'List all notes')
	.help().argv;

const cmd = argv._[0];
const { title, body } = argv;

switch (cmd) {
	case 'add':
		console.log(notes.addNote(title, body) ? 'Success' : 'Duplicate!');
		break;
	case 'get':
		const note = notes.getNote(title);
		if (!note) {
			console.log('Note not found!');
			break;
		}
		console.log(`Title: ${note.title}\nBody: ${note.body}`);
		break;
	case 'del':
		console.log(notes.removeNote(title) ? 'Success' : 'Note not exist!');
		break;
	case 'list':
		console.log(notes.getAll());
		break;
	default:
		console.log('What?');
}
