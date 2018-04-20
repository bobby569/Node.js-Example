const utils = require('./utils');

test('add 1+2 to equal 3', () => {
	expect(utils.add(1, 2)).toBe(3);
});

test('square 3 to equal 9', () => {
	expect(utils.square(3)).toBe(9);
});

test('test async add', done => {
	utils.asycAdd(4, 3, sum => {
		expect(sum).toBe(7);
		done();
	});
});
