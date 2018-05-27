const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const password = '123abc!';

// bcrypt.genSalt(10, (err, salt) => {
// 	bcrypt.hash(password, salt, (err, hash) => {
// 		console.log(hash);
// 	});
// });

const hashedPassword =
	'$2a$10$goVcYI2oUgq8nd1MBjBNyepOTyQmQ5oGveigCCnpQSWxO5m0zBt/O';

bcrypt.compare(password, hashedPassword, (err, res) => console.log(res));
