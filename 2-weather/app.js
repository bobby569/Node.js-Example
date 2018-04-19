const axios = require('axios');
const yargs = require('yargs');
const geocodeURL = `https://maps.google.com/maps/api/geocode/json?address`;
const weatherBaseUrl = 'https://api.darksky.net/forecast';
const weatherAPIKey = 'd06b1b688eafe0000549b048e1885017';

const { argv } = yargs
	.options({
		address: {
			demand: true,
			alias: 'a',
			describe: 'Address to fetch weather for',
			string: true
		}
	})
	.help()
	.alias('help', 'h');

const encodedAddress = encodeURIComponent(argv.address);

axios
	.get(`${geocodeURL}=${encodedAddress}`)
	.then(res => {
		if (res.data.status === 'ZERO_RESULTS') {
			throw new Error('Unable to find the address');
		}
		const result = res.data.results[0];
		const { lat, lng } = result.geometry.location;
		console.log(result.formatted_address);
		return axios.get(`${weatherBaseUrl}/${weatherAPIKey}/${lat},${lng}`);
	})
	.then(res => {
		const { temperature, apparentTemperature } = res.data.currently;
		console.log(`Now: ${temperature} ˚F. Feels like ${apparentTemperature} ˚F.`);
	})
	.catch(err => {
		if (err.code === 'ENOTFOUND') {
			console.log('Unable to connect API');
		} else {
			console.log(err.message);
		}
	});
