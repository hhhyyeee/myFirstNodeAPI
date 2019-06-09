const express = require('express');
const app = express();
app.use('/api/cinema', require('./api/routes/cinema').cinema);
app.use('/api/user', require('./api/routes/user').user);
app.use('/api/auth', require('./api/routes/auth').auth);
app.use('/api/search/cinema', require('./api/routes/search/cinema').cinema);

app.listen(3000, () => {
	console.log('Example app listening on port 3000!');
});

module.exports = app;