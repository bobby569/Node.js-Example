const axios = require('axios');

const getExchangeRate = (from, to) => {
	return axios
		.get(`https://api.fixer.io/latest?base=${from}`)
		.then(res => res.data.rates[to]);
};

const getCountries = code => {
	return axios
		.get(`https://restcountries.eu/rest/v2/currency/${code}`)
		.then(res => res.data.map(item => item.name));
};

const convertCurrency = (from, to, amount) =>
	getCountries(to).then(countries =>
		getExchangeRate(from, to).then(
			rate =>
				`${amount} ${from} is worth ${amount *
					rate} ${to}. ${to} can be used in ${countries.join(',')}.`
		)
	);

const convertCurrencyAlt = async (from, to, amount) => {
	const countries = await getCountries(to);
	const rate = await getExchangeRate(from, to);
	return `${amount} ${from} is worth ${amount *
		rate} ${to}. ${to} can be used in ${countries.join(',')}.`;
};

// getExchangeRate('USD', 'CAD').then(rate => console.log(rate));

// getCountries('USD').then(country => console.log(country));

// convertCurrency('USD', 'CAD', 100).then(status => console.log(status));

convertCurrencyAlt('USD', 'CAD', 100).then(status => console.log(status));
