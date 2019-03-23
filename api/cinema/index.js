const express = require('express');
const router = express.Router();

let films = [
    {
        id: 1,
        title: 'The Favourite',
        director: 'Yorgos Lanthimos',
        year: '2018'
    },
    {
        id: 2,
        title: 'Carol',
        director: 'Todd Haynes',
        year: '2015'
    },
    {
        id: 3,
        title: 'Lady Bird',
        director: 'Greta Gerwig',
        year: '2017'
    }
]


router.get('/', (req, res) => { // root page
	res.send('Welcome to Andy\'s Cine API!\n');
});

router.get('/:id', (req, res) => {
    const id = parseInt(req.param.id, 10);
    if (!id) {
        return res.status(400).json({error: "Incorrect id"});
    }
    let film = films.filter(film => film.id === id)[0];
    if (!film) {
        return res.status(404).json({error: "Unknown film"});
    }
    return res.json(film);
})

router.delete('/:id', (req, res) => {
    
})