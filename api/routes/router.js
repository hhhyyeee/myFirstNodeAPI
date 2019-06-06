const express = require('express');
const os = require('os');
const router = express.Router();
var bodyParser = require('body-parser')
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
const db = require('../database/config');

router.get('/welcome', (req, res) => { // root page
	res.send('Welcome to Andy\'s Cine API!\n');
});

router.get('/', (req, res) => { // retrieve every rows
	db.query("select * from cinema", (err, rows) => {
		if (!err) {
			console.log(rows);
			return res.json(rows);
		} else {
			console.log(`query error : ${err}`);
			return res.status(400).json({error: "Retrieve Error"});
		}
	});
})

// router.get('/alltitle', (req, res) => { // retrieve all titles
// 	db.query("select title from cinema", (err, rows) => {
// 		if (!err) {
// 			console.log(rows);
// 			return res.json(rows);
// 		} else {
// 			console.log(`query error : ${err}`);
// 			return res.json(err);
// 		}
// 	})
// })

router.get('/:id', (req, res) => { // retrieve one row
	console.log(req.params.id);
	const id = parseInt(req.params.id, 10);
	db.query("select * from cinema where id = " + id, (err, rows) => {
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
	})
})

router.delete('/:id', (req, res) => { // delete one row
	console.log(req.params.id);
	const id = parseInt(req.params.id, 10);
	db.query("delete from cinema where id = " + id, (err, rows) => {
		if (!err) {
			console.log("cinema deleted");
			return res.json(rows);
		} else {
			console.log(`query error : ${err}`);
			return res.json(err);
		}
	})
	// if (!id) {
	// 	return res.status(400).json({error: "Incorrect id"});
	// }
	// const filmIdx = films.findIndex(film => film.id === id);
	// if (filmIdx === -1) {
	// 	return res.status(404).json({error: "No film found"});
	// }
	// films.splice(filmIdx, 1);
	// res.status(204).send();	
});

router.post('/', (req, res) => { // create one
	db.query("select * from cinema", (err, rows) => {
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
			var releaseYear = req.body.year || '';
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
			var sql = "insert into cinema (id, title, releaseYear, director, actors, country) VALUES ?";
			var values = [
				[newid, title, releaseYear, director, actors, country],
			];
			db.query(sql, [values], function (err, result) {
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
})

router.put('/:id', (req, res) => { // update one // not working yet
	console.log(req.params.id);
	const id = parseInt(req.params.id, 10);
	if (!id) {
		return res.status(400).json({error: "Incorrect id"});
	}
	let film = films.filter(film => film.id === id)[0];
    if (!film) {
        return res.status(404).json({error: "Unknown film"});
	}
	const updateFilm = film;
	if (req.body) {
		if (req.body.title) {
			updateFilm.title = req.body.title;
		}
		if (req.body.director) {
			updateFilm.director = req.body.director;
		}
		if (req.body.year) {
			updateFilm.year = req.body.year;
		}
		films.push(updateFilm);
	} else {
		return res.status(400).json({error: "Nothing to update"});
	}
	return res.status(201).json(updateFilm);
})

module.exports.router = router;