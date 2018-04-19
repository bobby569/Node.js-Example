const yargs = require('yargs');
const geocode = require('./api/geocode');
const weather = require('./api/weather');

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

geocode
	.geocodeAddress(argv.address)
	.then(res => console.log(res))
	.catch(err => console.log(err));

weather.getWeather(res.lat, res.lng, (err, res) => {
	if (err) return console.log(err);
	console.log(
		`It is ${res.temperature} ˚F. It feels like ${res.apparentTemperature} ˚F.`
	);
});
