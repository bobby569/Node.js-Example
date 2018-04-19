const utils = require('../utils/utils');

test('add 1+2 to equal 3', () => {
	expect(utils.add(1, 2)).toBe(3);
});

test('test async add', done => {
	utils.asycAdd(4, 3, sum => {
		expect(sum).toBe(7);
		done();
	});
});
