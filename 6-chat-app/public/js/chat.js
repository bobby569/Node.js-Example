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
	// Connected to server
	const params = $.deparam(window.location.search);
	socket.emit('join', params, err => {
		if (err) {
			alert(err);
			window.location.href = '/';
		}
	});
});

socket.on('updateUserList', users => {
	var ol = $('<ol></ol>');

	users.forEach(user => ol.append($('<li></li>').text(user)));

	$('#users').html(ol);
});

socket.on('newMessage', data => {
	const template = $('#message-template').html();
	const { from, text } = data;
	const time = moment(data.createdAt).format('h:mm a');
	const html = Mustache.render(template, { from, text, time });

	$('#messages').append(html);
	scrollToBottom();
});

socket.on('newLocationMessage', data => {
	const template = $('#location-template').html();
	const { from, url } = data;
	const time = moment(data.createdAt).format('h:mm a');
	const html = Mustache.render(template, { from, url, time });

	$('#messages').append(html);
	scrollToBottom();
});

$('#message-form').on('submit', e => {
	e.preventDefault();

	const msgTextbox = $('[name=message]');
	const text = msgTextbox.val();
	socket.emit('createMessage', { text }, () => msgTextbox.val(''));
});

const locButton = $('#send-location');

locButton.on('click', () => {
	if (!navigator.geolocation) return alert('Geolocation not supported');

	locButton.attr('disabled', 'disabled').text('Sending location ...');

	navigator.geolocation.getCurrentPosition(
		posi => {
			locButton.removeAttr('disabled').text('Send Location');
			const { latitude, longitude } = posi.coords;
			socket.emit('createLocationMessage', { latitude, longitude });
		},
		() => {
			locButton.removeAttr('disabled');
			alert('Unable to fetch location');
		}
	);
});
