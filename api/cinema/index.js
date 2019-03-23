const express = require('express');
const router = express.Router();
var bodyParser = require('body-parser')
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

let films = [
    {
        id: 0,
        title: 'The Favourite',
        director: 'Yorgos Lanthimos',
        year: '2018'
    },
    {
        id: 1,
        title: 'Carol',
        director: 'Todd Haynes',
        year: '2015'
    },
    {
        id: 2,
        title: 'Lady Bird',
        director: 'Greta Gerwig',
        year: '2017'
    }
]


router.get('/', (req, res) => { // root page
	res.send('Welcome to Andy\'s Cine API!\n');
});

router.get('/:id', (req, res) => {
    console.log(req.params.id);
    const id = parseInt(req.params.id, 10);
    if (!id) {
        return res.status(400).json({error: "Incorrect id"});
    }
    let film = films.filter(film => film.id === id)[0];
    if (!film) {
        return res.status(404).json({error: "Unknown film"});
    }
    return res.json(film);
});

router.delete('/:id', (req, res) => {
	console.log(req.params.id);
	const id = parseInt(req.params.id, 10);
	if (!id) {
		return res.status(400).json({error: "Incorrect id"});
	}
	const filmIdx = films.findIndex(film => film.id === id);
	if (filmIdx === -1) {
		return res.status(404).json({error: "No film found"});
	}
	films.splice(filmIdx, 1);
	res.status(204).send();
});

router.post('/', (req, res) => {
	const title = req.body.title || '';
	if (!title.length) {
		return res.status(400).json({error: 'Empty title'});
	}
	const director = req.body.director || '';
	if (!director.length) {
		return res.status(400).json({error: 'Empty director'});
	}
	const year = req.body.year || '';
	if (!year.length) {
		return res.status(400).json({error: 'Empty year'});
	}
	const id = films.reduce((maxId, film) => {
		return film.id > maxId ? film.id : maxId; // this return value becomes the next maxId value
	}, 0) + 1; // maxId initial value 0
	const newFilm = {
		id: id,
		title: title,
		director: director,
		year: year
	};
	films.push(newFilm);
	return res.status(201).json(newFilm);
})

router.put('/:id', (req, res) => {
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

module.exports = router;