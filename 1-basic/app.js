const _ = require('lodash');
const fs = require('fs');
const yargs = require('yargs');
const notes = require('./notes');

const title = {
	describe: 'Title of note',
	demand: true,
	alias: 't'
};

const body = {
	describe: 'Body of note',
	demand: true,
	alias: 'b'
};

const argv = yargs
	.command('add', 'Add a new note', { title, body })
	.command('list', 'List all note')
	.command('read', 'Read a note', { title })
	.command('remove', 'Remove a note', { title })
	.help().argv;
const cmd = argv._[0];

switch (cmd) {
	case 'add':
		const { title, body } = argv;
		console.log(notes.addNote(title, body) ? 'Success' : 'Duplicate!');
		break;
	case 'list':
		console.log(notes.getAll());
		break;
	case 'read':
		const note = notes.getNode(argv.title);
		if (!note) {
			console.log('Note not found');
			break;
		}
		console.log(`Title: ${note.title}`);
		console.log(`Body: ${note.body}`);
		break;
	case 'remove':
		console.log(notes.removeNote(argv.title) ? 'Success' : 'Error');
		break;
	default:
		console.log('What?');
}
