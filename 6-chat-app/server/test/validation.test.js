const { isValidString } = require('../util/validation');

describe('isValidString', () => {
	test('should reject non-string values', () => {
		expect(isValidString(98)).toBe(false);
		expect(isValidString(true)).toBe(false);
		expect(isValidString({ 1: 2 })).toBe(false);
		expect(isValidString([1, 2])).toBe(false);
	});

	test('should reject string with only spaces', () => {
		expect(isValidString('          ')).toBe(false);
	});

	test('should accept string with non-space characters', () => {
		expect(isValidString('   Bobby    ')).toBe(true);
	});
});
