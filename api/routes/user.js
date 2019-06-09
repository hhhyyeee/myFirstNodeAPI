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

router.post('/', (req, res) => { // create new user (body param: username, email, password)
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
			const created_at = new Date(); // any better way?!?!?!?!?!?!?!?!?!

			console.log("id: " + newid + ", username: " + username);
			let sql = "insert into user (id, username, email, password, password_salt, created_at) VALUES ?";
			bcrypt.genSalt(10, function(err, salt) { // bcrypt generates SALT
				if (err) {
					console.log(err);
					return res.status(501).json({error: "Salt generation failed"});
				}
				console.log("salt: " + salt);
				bcrypt.hash(password, salt, function(err, hash){ // bcrypt HASHes password with salt
					if(!err) {
						let value = [[newid, username, email, hash, salt, created_at]];
						console.log(value);
						db.query(sql, [value], function(err, result) {
							if(err) throw err;
							console.log("Successful");
							console.log("Number of records inserted: " + result.affectedRows);
						});
					} else {
						console.log(err);
						return res.status(501).json({error: "Password Hashing failed"});
					}
				});
			})            
			const newUser = {
				id: newid,
				username: username,
				email: email,
				created_at: created_at
			};
			return res.status(201).json(newUser);
		} else {
			console.log(`query error : ${err}`);
			return res.status(400).json({error: "Retrieve Error"});
		}
	});
})

router.delete('/:id', (req, res) => { // delete one user by id
	console.log(req.params.id);
	const id = parseInt(req.params.id, 10);
	db.query("delete from user where id = " + id, (err, rows) => {
		if (!err) {
			console.log("user successfully deleted");
			return res.json(rows);
		} else {
			console.log(`query error : ${err}`);
			return res.json(err);
		}
	})
})

router.put('/username/:id', (req, res) => { // update username (body param: username, password)
	console.log(req.params.id);
	console.log(req.body.username);
	// console.log(req.body.password);
	const id = parseInt(req.params.id, 10);
	db.query("update user set username = '" + req.body.username + "' where id = " + id, (err, rows) => {
		if (!err) {
			console.log(rows);
			return res.json({message: "username successfully updated"});
		} else {
			console.log(`query error : ${err}`);
			return res.json(err);
		}
	});
})

module.exports.user = router;