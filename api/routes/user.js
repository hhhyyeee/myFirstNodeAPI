const express = require('express');
const os = require('os');
const router = express.Router();
var bodyParser = require('body-parser')
var bcrypt = require('bcrypt');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
const db = require('../database/config');

router.get('/welcome', (req, res) => { // root page
	res.send('Welcome to Andy\'s Cine API for Users!\n');
});

router.get('/', (req, res) => { // retrieve all
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

router.get('/:id', (req, res) => { // retrieve one by id
    console.log("id: " + req.params.id);
    const id = parseInt(req.params.id, 10);
    db.query("select id, username from user where id = " + id, (err, rows) => {
        if (!err) {
            console.log(rows);
            return res.json(rows);
        } else {
            console.log(`query error : ${err}`);
            return res.status(400).json({error: "Retrieve Error"});
        }
    })
})

router.post('/', (req, res) => { // create one
	db.query("select * from user", (err, rows) => {
		if (!err) {
			if (rows.length != 0) {
				console.log("last element id: " + rows[rows.length-1].id);
				newid = rows[rows.length-1].id + 1;
			} else newid = 1;

			const username = req.body.username || '';
			if (!username.length) {
				return res.status(400).json({error: 'Empty username'});
			}
			const email = req.body.email || '';
			if (!email.length) {
				return res.status(400).json({error: 'Empty email'});
			}
			const password = req.body.password || '';
			if (!password.length) {
				return res.status(400).json({error: 'Empty password'});
			}
			const created_at = new Date(); // search for better way?!?!?!?!?!?!?!?!?!

			console.log("id: " + newid + ", username: " + username);
			var sql = "insert into user (id, username, email, password, password_salt, created_at) VALUES ?";

			bcrypt.genSalt(10, function(err, salt) {
				if (err) {
					console.log(err);
					return res.status(501).json({error: "Salt generation failed"});
				}
				console.log("salt: " + salt);
				bcrypt.hash(password, salt, function(err, hash){
					if(err) {
						console.log(err);
						return res.status(501).json({error: "Password Hashing failed"});
					}
					var value = [[newid, username, email, hash, salt, created_at]];
					console.log(value);
					db.query(sql, [value], function(err, result) {
						if(err) throw err;
						console.log("Successful");
						console.log("Number of records inserted: " + result.affectedRows);
					});
				});
			})
            
			const newUser = {
				id: newid,
				username: username,
				email: email,
				created_at: created_at
			};
			return res.json(newUser);
		} else {
			console.log(`query error : ${err}`);
			return res.status(400).json({error: "Retrieve Error"});
		}
	});
})

module.exports.user = router;