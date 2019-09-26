const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../database/config');

const userMethods = require('../modules/user');

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
			if (!rows.length) { // if nothing is found from DB, in other words id has no match in DB
				return res.status(404).json({error: 'Invalid ID'});
			}
			const hash = rows[0].password;
			bcrypt.compare(pw, hash, (err, result) => {
                if (result) { // result is true when the password is correct
                    console.log(res);
					return res.status(200).json({ message: 'Sign in success' });
				} else {
					return res.status(400).json({ error: 'Sign in failed' });
				}
			});
		} else {
			console.log(`query error : ${err}`);
			return res.json(err);
		}
	})
})

router.post('/register', (req, res) => { // create new user (body param: username, email, password)
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
			const admin = 0;
			const created_at = new Date();

			console.log("id: " + newid + ", username: " + username);
			const newUser = {
				id: newid,
				username: username,
				email: email,
				password: password,
				created_at: created_at,
				admin: admin
			};
			userMethods.createUser(newUser, (error, result) => {
				if (error) {
					console.log(`${error}`);
					// console.log(error);
					return res.status(400).json(error);
				} else {
					console.log(result);
					return res.json(result);
				}
			})
		} else {
			console.log(`query error : ${err}`);
			return res.status(400).json({error: "Retrieve Error"});
		}
	});
})

router.delete('/deregister/:id', (req, res) => { // delete one user by id
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

router.put('/update/:id', (req, res) => { // update username (body param: username, password)
	console.log(req.params.id);
	console.log(req.body.username);
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

module.exports.auth = router;