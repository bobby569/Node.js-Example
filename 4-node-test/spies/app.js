const saveUser = user => console.log('Saving the user', user);

handleSignup = (email, password) =>
	saveUser({
		email,
		password
	});

module.exports = { handleSignup };
