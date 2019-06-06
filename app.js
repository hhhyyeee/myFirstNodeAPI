const express = require('express');
const app = express();
app.use('/api', require('./api/routes/router').router);
app.use('/api/search', require('./api/routes/search_router').search_router);

// app.use('/api', require('./api/cinema'));

app.listen(3000, () => {
	console.log('Example app listening on port 3000!');
});

module.exports = app;