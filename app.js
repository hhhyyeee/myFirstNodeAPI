const express = require('express');
const app = express();
const cors = require('cors');
app.use('/public', express.static('./api/help'));
require('dotenv').config()

const corsOptions = {
	origin: 'http://localhost:3000',
	credentials: true
}

// setting middleware
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors(corsOptions));

// router
app.use('/api/cinema', require('./api/routes/cinema').cinema);
app.use('/api/user', require('./api/routes/user').user);
app.use('/api/auth', require('./api/routes/auth').auth);
app.use('/api/search/cinema', require('./api/routes/search/cinema').cinema);

//
app.listen(3000, () => {
	console.log('Example app listening on port 3000!');
});
app.get("/api", (req, res) => {
	res.sendFile("cineAPI.html", {root: "api/help"});
})

module.exports = app;