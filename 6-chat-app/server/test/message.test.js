const { genMsg, genLocMsg } = require('../util/message');

describe('genMsg', () => {
	test('should generate correct message object', () => {
		const from = 'Bobby';
		const text = 'Some msg';
		const message = genMsg(from, text);

		expect(typeof message.createdAt).toBe('number');
		expect(message.from).toBe(from);
		expect(message.text).toBe(text);
	});

	test('genLocMsg', () => {
		const from = 'Bobby';
		const lat = 15;
		const lng = 19;
		const url = 'https://www.google.com/maps?q=15,19';
		const message = genLocMsg(from, lat, lng);

		expect(typeof message.createdAt).toBe('number');
		expect(message.from).toBe(from);
		expect(message.url).toBe(url);
	});
});
