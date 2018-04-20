const axios = require('axios');
const mapBaseUrl = 'https://maps.google.com/maps/api/geocode/json?address=';

const geocodeAddress = address => {
	return new Promise((resolve, reject) => {
		const encodedAddress = encodeURIComponent(address);
		axios.get(`${mapBaseUrl}${encodedAddress}`).then(res => {
			const { status, results } = res.data;
			if (status === 'ZERO_RESULTS') {
				reject('Unable to find the address');
			} else if (status === 'OK') {
				const result = results[0];
				const { lat, lng } = result.geometry.location;
				resolve({
					addr: result.formatted_address,
					lat,
					lng
				});
			}
		});
	});
};

module.exports = { geocodeAddress };
