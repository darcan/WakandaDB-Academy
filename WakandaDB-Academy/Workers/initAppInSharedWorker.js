// Warm the cache with a sequential query that will load all logsconsole.log('Warming the cache..........');try {	ds.Employee.query("firstName = *");} catch(err) {	// just ignore this error	console.warn('query failed:', err);}console.log('Warming the cache..........done');