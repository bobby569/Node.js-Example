const axios = require('axios');
const { weatherAPIKey } = require('../key');
const weatherBaseUrl = 'https://api.darksky.net/forecast';

Number.prototype.F2C = function() {
	return ~~((this - 32) / 1.8);
};

const getWeather = (lat, lng, callback) => {
	axios
		.get(`${weatherBaseUrl}/${weatherAPIKey}/${lat},${lng}`)
		.then(res => {
			const { temperature, apparentTemperature } = res.data.currently;
			const temp = temperature.F2C();
			const appa = apparentTemperature.F2C();
			callback(null, { temp, appa });
		})
		.catch(err => callback(err));
};

module.exports = { getWeather };
