const { generateMessage, generateLocationMessage } = require('./message');

describe('generateMessage', () => {
	test('should generate correct message object', () => {
		const from = 'Bobby';
		const text = 'Some msg';
		const message = generateMessage(from, text);

		expect(typeof message.createdAt).toBe('number');
		expect(message.from).toBe(from);
		expect(message.text).toBe(text);
	});

	test('generateLocationMessage', () => {
		const from = 'Bobby';
		const lat = 15;
		const lng = 19;
		const url = 'https://www.google.com/maps?q=15,19';
		const message = generateLocationMessage(from, lat, lng);

		expect(typeof message.createdAt).toBe('number');
		expect(message.from).toBe(from);
		expect(message.url).toBe(url);
	});
});
