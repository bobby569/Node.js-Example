const socket = io();

function scrollToBottom() {
	// Selector
	const messages = $('#messages');
	const newMessage = messages.children('li:last-child');
	// Height
	const clientHeight = messages.prop('clientHeight');
	const scrollTop = messages.prop('scrollTop');
	const scrollHeight = messages.prop('scrollHeight');
	const newMessageHeight = newMessage.innerHeight();
	const lastMessageHeight = newMessage.prev().innerHeight();

	if (
		clientHeight + scrollTop + newMessageHeight + lastMessageHeight >=
		scrollHeight
	) {
		messages.scrollTop(scrollHeight);
	}
}

socket.on('connect', () => {
	console.log('Connected to server');
	const params = $.deparam(window.location.search);
	socket.emit('join', params, function(err) {
		if (err) {
			alert(err);
			window.location.href = '/';
		} else {
			console.log('No error');
		}
	});
});

socket.on('disconnect', () => {
	console.log('Disconnected from server');
});

socket.on('updateUserList', function(users) {
	var ol = $('<ol></ol>');

	users.forEach(function(user) {
		ol.append($('<li></li>').text(user));
	});

	$('#users').html(ol);
});

socket.on('newMessage', data => {
	const formattedTime = moment(data.createdAt).format('h:mm a');
	const template = $('#message-template').html();
	const html = Mustache.render(template, {
		from: data.from,
		text: data.text,
		time: formattedTime
	});

	$('#messages').append(html);
	scrollToBottom();
});

socket.on('newLocationMessage', function(data) {
	const formattedTime = moment(data.createdAt).format('h:mm a');
	const template = $('#location-message-template').html();
	const html = Mustache.render(template, {
		from: data.from,
		url: data.url,
		time: formattedTime
	});

	$('#messages').append(html);
	scrollToBottom();
});

$('#message-form').on('submit', function(e) {
	e.preventDefault();

	const messageTextbox = $('[name=message]');

	socket.emit(
		'createMessage',
		{
			text: messageTextbox.val()
		},
		function() {
			messageTextbox.val('');
		}
	);
});

const locationButton = $('#send-location');

locationButton.on('click', function() {
	if (!navigator.geolocation) {
		return alert('Geolocation not supported');
	}

	locationButton.attr('disabled', 'disabled').text('Sending location ...');

	navigator.geolocation.getCurrentPosition(
		function(posi) {
			locationButton.removeAttr('disabled').text('Send Location');
			socket.emit('createLocationMessage', {
				latitude: posi.coords.latitude,
				longitude: posi.coords.longitude
			});
		},
		function() {
			locationButton.removeAttr('disabled');
			alert('Unable to fetch location');
		}
	);
});
