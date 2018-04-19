const asyncAdd = (a, b) =>
	new Promise((resolve, reject) => {
		setTimeout(() => {
			if (typeof a === 'number' && typeof b === 'number') {
				resolve(a + b);
			} else {
				reject('Need numbers');
			}
		}, 1000);
	});

asyncAdd(5, 7)
	.then(res => {
		console.log('equal', res);
		return asyncAdd(res, 33);
	})
	.then(res => {
		console.log('should be 45', res);
	})
	.catch(err => {
		console.log(err);
	});
