const express = require('express');
const os = require('os');
const router = express.Router();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const morgan = require('morgan');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'content-type, x-access-token'); //1
    next();
});
const db = require('../database/config');

router.post('/signin', (req, res) => { // user tries to sign in (body param: id, password)
    console.log(req.body.id);
	const id = req.body.id || '';
	if (!id.length) { // if id is not given
		return res.status(400).json({error: 'Empty id'});
	}
	const pw = req.body.password || '';
	if (!pw.length) { // if password is not given
		return res.status(400).json({error: 'Empty password'});
	}
	db.query("select id, password from user where id = " + id, (err, rows) => {
		if (!err) {
			// console.log(rows);
			if (!rows.length) { // if nothing is found from DB, in other words id has no match in DB
				return res.status(404).json({error: 'Invalid ID'});
			}
			const hash = rows[0].password;
			// console.log("pw: " + pw + ", hash: " + hash);
			bcrypt.compare(pw, hash, (err, result) => {
                if (result) { // result is true when the password is correct
                    console.log(res);
					return res.status(200).json({message: 'Sign in success'});
				} else {
					return res.status(400).json({error: 'Sign in failed'});
				}
			});
		} else {
			console.log(`query error : ${err}`);
			return res.json(err);
		}
	})
})

module.exports.auth = router;