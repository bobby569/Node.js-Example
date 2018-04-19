const request = require('request');
const mapBaseUrl = 'https://maps.google.com/maps/api/geocode/json';

const geocodeAddress = address => {
	return new Promise((resolve, reject) => {
		const encodedAddress = encodeURIComponent(address);
		request(
			{
				url: `${mapBaseUrl}?address=${encodedAddress}`,
				json: true
			},
			(err, res, body) => {
				if (err) reject('Cannot connect to Google servers.');
				else if (body.status === 'ZERO_RESULTS') reject('Unable to find the address');
				else if (body.status === 'OK') {
					const result = body.results[0];
					const { lat, lng } = result.geometry.location;
					resolve({
						addr: result.formatted_address,
						lat,
						lng
					});
				}
			}
		);
	});
};

module.exports = { geocodeAddress };
