const express = require('express');
const app = express();
app.use('/api/cinema', require('./api/routes/cinema').cinema);
app.use('/api/cinema/search', require('./api/routes/search_cinema').search_cinema);

app.listen(3000, () => {
	console.log('Example app listening on port 3000!');
});

module.exports = app;