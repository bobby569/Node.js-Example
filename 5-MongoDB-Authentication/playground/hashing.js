const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const password = '123abc!';
// bcrypt.genSalt(10, (err, salt) => {
// 	bcrypt.hash(password, salt, (err, hash) => {
// 		console.log(hash);
// 	});
// });

const hashedPassword =
	'$2a$10$u4XT/ZKWK.fm.0bNJSIg1uBcrYfhjU4QxdaCoWx72Gt1DcmbepwS2';

bcrypt.compare(password, hashedPassword, (err, res) => {
	console.log(res);
});
