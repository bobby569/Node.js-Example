const rewire = require('rewire');
const app = rewire('./app');

describe('App', () => {
	test('Should call spy', () => {
		const spy = jest.spyOn(app, 'handleSignup');
		const sign = app.handleSignup('test@test.com', '1234');
		expect(spy).toHaveBeenCalled();
		expect(sign).toBe(undefined);

		spy.mockReset();
		spy.mockRestore();
	});

	// const db = {
	// 	saveUser: jest.spyOn(app, 'handleSignup')
	// };
	// app.__set__('db', db);
	//
	// test('should save user', () => {
	// 	const email = 'test@test.com';
	// 	const password = '1234';
	// 	app.handleSignup(email, password);
	// 	expect(db.saveUser).toHaveBeenCalledWith({ email, password });
	// });
});
