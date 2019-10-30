const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
// let session = require('express-session');
// let MySQLStore = require('express-mysql-session')(session);
// const options = {
// 	host: 'localhost',
// 	port: 3306,
// 	user: 'root',
// 	password: 'root',
// 	database: 'cinemaArchive'
// };
// let sessionStore = new MySQLStore(options);
app.use('/public', express.static('./api/help'));
require('dotenv').config();
const corsOptions = {
	origin: 'http://localhost:3000',
	credentials: true
}

// setting middleware
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors(corsOptions));
app.use(cookieParser());
// app.use(session({
// 	key: 'sid',
// 	secret: 'secret',
// 	resave: false,
// 	saveUninitialized: true,
// 	store: sessionStore,
// 	cookie: {
// 		secure: true,
// 		maxAge: 2 * 60 * 1000 // in milliseconds
// 	}
// }));

// router
app.use('/api/cinema', require('./api/routes/cinema').cinema);
app.use('/api/user', require('./api/routes/user').user);
app.use('/api/auth', require('./api/routes/auth').auth);
app.use('/api/search/cinema', require('./api/routes/search/cinema').cinema);

//
app.listen(3030, () => {
	console.log('Example app listening on port 3030!');
});
app.get("/api", (req, res) => {
	res.sendFile("cineAPI.html", {root: "api/help"});
})

module.exports = app;