const { isRealString } = require('./validation');

describe('isRealString', () => {
	test('should reject non-string values', () => {
		expect(isRealString(98)).toBe(false);
		expect(isRealString(true)).toBe(false);
		expect(isRealString({ 1: 2 })).toBe(false);
		expect(isRealString([1, 2])).toBe(false);
	});

	test('should reject string with only spaces', () => {
		expect(isRealString('          ')).toBe(false);
	});

	test('should accept string with non-space characters', () => {
		expect(isRealString('   Bobby    ')).toBe(true);
	});
});
