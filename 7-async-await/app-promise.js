const users = [
	{
		id: 1,
		name: 'Andrew',
		schoolId: 101
	},
	{
		id: 2,
		name: 'Jessica',
		schoolId: 999
	}
];

const grades = [
	{
		id: 1,
		schoolId: 101,
		grade: 86
	},
	{
		id: 2,
		schoolId: 999,
		grade: 100
	},
	{
		id: 3,
		schoolId: 101,
		grade: 80
	}
];

const getUser = id => {
	return new Promise((resolve, reject) => {
		const user = users.find(user => user.id === id);

		if (user) {
			resolve(user);
		} else {
			reject(`Unable to find user with id of ${id}.`);
		}
	});
};

const getGrade = schoolId => {
	return new Promise((resolve, reject) => {
		resolve(grades.filter(grade => grade.schoolId == schoolId));
	});
};

const getStatus = userId => {
	return getUser(userId)
		.then(user => getGrade(user.schoolId))
		.then(grades => console.log(grades));
};

const getStatusAlt = async userId => {
	const user = await getUser(userId);
	const grade = await getGrade(user.schoolId);
	console.log(grade);
};

getStatus(1)
	.then(grade => {})
	.catch(e => console.log(e));
