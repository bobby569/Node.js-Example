const { Users } = require('./users');

describe('Users', () => {
	let obj;

	beforeEach(() => {
		obj = new Users();
		obj.users = [
			{
				id: '1',
				name: 'Mike',
				room: 'Node'
			},
			{
				id: '2',
				name: 'Jen',
				room: 'Node'
			},
			{
				id: '3',
				name: 'Julie',
				room: 'React'
			}
		];
	});

	test('addUser', () => {
		const obj = new Users();
		const user = {
			id: '1',
			name: 'Mike',
			room: 'Node'
		};
		const resUser = obj.addUser(user.id, user.name, user.room);

		expect(obj.users).toEqual([user]);
	});

	test('removeUser', () => {
		const user2 = obj.removeUser('99');
		expect(user2).toBe(undefined);
		expect(obj.users.length).toBe(3);

		const user1 = obj.removeUser('1');
		expect(user1.id).toBe('1');
		expect(obj.users.length).toBe(2);
	});

	test('getUser', () => {
		const user1 = obj.getUser('1');
		expect(user1.id).toBe('1');
		const user2 = obj.getUser('99');
		expect(user2).toBe(undefined);
	});

	test('getUserList', () => {
		expect(obj.getUserList('Node')).toEqual(['Mike', 'Jen']);
		expect(obj.getUserList('React')).toEqual(['Julie']);
	});
});
