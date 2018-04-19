const request = require('request');
const weatherBaseUrl = 'https://api.darksky.net/forecast';
const weatherAPIKey = 'd06b1b688eafe0000549b048e1885017';

const getWeather = (lat, lng, callback) => {
	request(
		{
			url: `${weatherBaseUrl}/${weatherAPIKey}/${lat},${lng}`,
			json: true
		},
		(err, res, body) => {
			if (err || res.statusCode !== 200) {
				callback('Unable to connect to fetch whether');
			} else {
				const { temperature, apparentTemperature } = body.currently;
				callback(null, {
					temperature,
					apparentTemperature
				});
			}
		}
	);
};

module.exports = { getWeather };
