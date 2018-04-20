const axios = require('axios');
const yargs = require('yargs');
const { weatherAPIKey } = require('./key');
const geocodeURL = `https://maps.google.com/maps/api/geocode/json?address=`;
const weatherBaseUrl = 'https://api.darksky.net/forecast';

Number.prototype.F2C = function() {
	return ~~((this - 32) / 1.8);
};

const { address } = yargs
	.options({
		address: {
			alias: 'a',
			demand: true,
			describe: 'Address to fetch weather for',
			string: true
		}
	})
	.help()
	.alias('help', 'h').argv;

const encodedAddress = encodeURIComponent(address);

axios
	.get(`${geocodeURL}${encodedAddress}`)
	.then(res => {
		const { status, results } = res.data;
		if (status === 'ZERO_RESULTS') {
			throw new Error('Unable to find the address');
		}
		const result = results[0];
		const { lat, lng } = result.geometry.location;
		console.log(result.formatted_address);
		return axios.get(`${weatherBaseUrl}/${weatherAPIKey}/${lat},${lng}`);
	})
	.then(res => {
		const { temperature, apparentTemperature } = res.data.currently;
		const temp = temperature.F2C();
		const appa = apparentTemperature.F2C();
		console.log(`Now: ${temp}˚C. Feels like ${appa}˚C.`);
	})
	.catch(err => {
		if (err.code === 'ENOTFOUND') console.log('Unable to connect API');
		else console.log(err.message);
	});
