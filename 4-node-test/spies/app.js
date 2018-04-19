const db = require('./db');

handleSignup = (email, password) => {
	db.saveUser({
		email,
		password
	});
};

module.exports = { handleSignup };
