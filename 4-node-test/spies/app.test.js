const rewire = require('rewire');
const app = rewire('./app');

describe('App', () => {
	const email = 'test@test.com';
	const password = '1234';

	test('Should call spy', () => {
		const spy = jest.spyOn(app, 'handleSignup');
		const sign = app.handleSignup(email, password);
		expect(spy).toHaveBeenCalled();
		expect(spy).toHaveBeenCalledWith(email, password);
		expect(sign).toBe(undefined);

		spy.mockReset();
		spy.mockRestore();
	});
});
