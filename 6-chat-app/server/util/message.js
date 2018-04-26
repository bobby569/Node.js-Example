const moment = require('moment');

const genMsg = (from, text) => ({
	from,
	text,
	createdAt: moment().valueOf()
});

const genLocMsg = (from, lat, lng) => ({
	from,
	url: `https://www.google.com/maps?q=${lat},${lng}`,
	createdAt: moment().valueOf()
});

module.exports = { genMsg, genLocMsg };
