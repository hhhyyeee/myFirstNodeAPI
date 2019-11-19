const express = require('express');
const router = express.Router();
const db = require('../database/config');

router.get('/welcome', (req, res) => { // root page
	res.send('Welcome to Andy\'s Cine API for Cinema!\n');
});

router.get('/', (req, res) => { // retrieve every rows
	// if (req.cookies) {
	// 	console.log("cookie: " + req.cookies);
	// }
	db.then(client => {
		client.query("select * from cinema", (err, rows) => {
			if (!err) {
				// console.log(rows);
				return res.json(rows);
			} else {
				console.log(`query error : ${err}`);
				return res.status(400).json({error: "Retrieve Error"});
			}
		});
	});
})

router.get('/:id', (req, res) => { // retrieve one row
	console.log(req.params.id);
	const id = parseInt(req.params.id, 10);
	db.then(client => {
		client.query("select * from cinema where id = " + id, (err, rows) => {
			if (!err) {
				console.log(rows.length);
				if (rows.length == 0) {
					return res.status(404).json({error: "ID unavailable"});
				} else {
					console.log(rows);
					return res.json(rows);
				}
			} else {
				console.log(`query error : ${err}`);
				return res.json(err);
			}
		});
	});
})

router.delete('/:id', (req, res) => { // delete one row
	console.log(req.params.id);
	const id = parseInt(req.params.id, 10);
	db.then(client => {
		client.query("delete from cinema where id = " + id, (err, rows) => {
			if (!err) {
				console.log("cinema deleted");
				return res.json(rows);
			} else {
				console.log(`query error : ${err}`);
				return res.json(err);
			}
		});
	});
})

router.post('/', (req, res) => { // create one (body param: title, year, director, actors, country)
	db.then(client => {
		client.query("select * from cinema", (err, rows) => {
			if (!err) {
				console.log("last element id: " + rows[rows.length-1].id);
				newid = rows[rows.length-1].id + 1;

				const title = req.body.title || '';
				if (!title.length) {
					return res.status(400).json({error: 'Empty title'});
				}
				const director = req.body.director || '';
				if (!director.length) {
					return res.status(400).json({error: 'Empty director'});
				}
				let releaseYear = req.body.year || '';
				if (!releaseYear.length) {
					return res.status(400).json({error: 'Empty year'});
				}
				if (typeof(releaseYear) != "number") { // if year input is not a number
					releaseYear = Number(releaseYear);
					if (typeof(releaseYear) != "number") {
						return res.status(404).json({error: 'Please put number only to the year field'});
					}
				}
				const actors = req.body.actors || '';
				if (!actors.length) {
					return res.status(400).json({error: 'Empty actors'});
				}
				const country = req.body.country || '';
				if (!country.length) {
					return res.status(400).json({error: 'Empty country'});
				}
				console.log("id: " + newid + ", title: " + title);
				let sql = "insert into cinema (id, title, releaseYear, director, actors, country) VALUES ?";
				let values = [
					[newid, title, releaseYear, director, actors, country],
				];
				client.query(sql, [values], function (err, result) {
					if (err) throw err;
					console.log("Number of records inserted: " + result.affectedRows);
				});

				const newFilm = {
					id: newid,
					title: title,
					year: releaseYear,
					director: director,
					actors: actors,
					country: country
				};
				return res.json(newFilm);
			} else {
				console.log(`query error : ${err}`);
				return res.status(400).json({error: "Retrieve Error"});
			}
		});
	});
})

module.exports.cinema = router;