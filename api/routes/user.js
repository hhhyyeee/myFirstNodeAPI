const express = require('express');
const router = express.Router();
const db = require('../database/config');
const bcrypt = require('bcrypt');

router.get('/welcome', (req, res) => { // root page
	res.send('Welcome to Andy\'s Cine API for Users!\n');
});

router.get('/', (req, res) => { // retrieve all users
    db.query("select id, username from user", (err, rows) => {
		if (!err) {
			console.log(rows);
			return res.json(rows);
		} else {
			console.log(`query error : ${err}`);
			return res.status(400).json({error: "Retrieve Error"});
        }
    });
})

router.get('/:id', (req, res) => { // retrieve one user by id
    console.log("id: " + req.params.id);
    const id = parseInt(req.params.id, 10);
    db.query("select id, username from user where id = " + id, (err, rows) => {
        if (!err) {
			if (rows.length == 0) {
				return res.status(204).json({message: "No user with the given id"});
			} else {
				console.log(rows);
				return res.json(rows);
			}
        } else {
            console.log(`query error : ${err}`);
            return res.status(400).json({error: "Retrieve Error"});
        }
    })
})

module.exports.user = router;