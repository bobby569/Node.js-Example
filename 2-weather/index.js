const yargs = require('yargs');
const geocode = require('./api/geocode');
const weather = require('./api/weather');

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

geocode
	.geocodeAddress(address)
	.then(data => {
		const { lat, lng, addr } = data;
		weather.getWeather(lat, lng, (err, res) => {
			if (err) return console.log(err);
			const { temp, appa } = res;
			console.log(`${addr}\nIt is ${temp}˚C. It feels like ${appa}˚C.`);
		});
	})
	.catch(err => console.log(err));
