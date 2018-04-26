const path = require('path');
const express = require('express');
const { genMsg, genLocMsg } = require('./util/message');
const { isValidString } = require('./util/validation');
const { Users } = require('./util/users');

const PATH = path.join(__dirname, '../public');
const PORT = process.env.PORT || 3000;

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const users = new Users();

app.use(express.static(PATH));

io.on('connection', socket => {
	// New user connected
	socket.on('join', (params, callback) => {
		const { name, room } = params;
		if (!isValidString(name) || !isValidString(room)) {
			return callback('Name or room is invalid!');
		}
		// Join room
		socket.join(room);
		// Remove from other room
		users.removeUser(socket.id);
		// Add user to current room
		users.addUser(socket.id, name, room);
		// Broadcast to everyone in the room and update user list
		io.to(room).emit('updateUserList', users.getUserList(room));
		// Greeting message
		socket.emit('newMessage', genMsg('admin', 'Welcome to the chat app'));
		// Let others in the same room know someone has joined
		socket.broadcast
			.to(room)
			.emit('newMessage', genMsg('admin', `${name} has joined`));
		// done
		callback();
	});

	socket.on('createMessage', (message, callback) => {
		// Get user
		const user = users.getUser(socket.id);
		// Validation
		if (user && isValidString(message.text)) {
			// Send message to the room
			io.to(user.room).emit('newMessage', genMsg(user.name, message.text));
		}
		// done
		callback();
	});

	socket.on('createLocationMessage', coords => {
		// Get lat and lng
		const { latitude, longitude } = coords;
		// Get user
		const user = users.getUser(socket.id);
		// Validation
		if (user) {
			// Send location info to the room
			io
				.to(user.room)
				.emit('newLocationMessage', genLocMsg(user.name, latitude, longitude));
		}
	});

	socket.on('disconnect', () => {
		const user = users.removeUser(socket.id);

		if (user) {
			const { room, name } = user;
			// Update user list
			io.to(room).emit('updateUserList', users.getUserList(room));
			// Send location info to the room
			io.to(room).emit('newMessage', genMsg('admin', `${name} has left`));
		}
	});
});

server.listen(PORT, () => console.log(`Server up on port ${PORT}`));
