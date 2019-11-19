const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../database/config');

const userMethods = require('../modules/user');

router.post('/signin', (req, res) => { // user tries to sign in (body param: email, password)
	console.log("email: " + req.body.email);
	const email = req.body.email || '';
	if (!email.length) { // if email is not given
		return res.status(400).json({error: 'Empty email'});
	}
	const pw = req.body.password || '';
	if (!pw.length) { // if password is not given
		return res.status(400).json({error: 'Empty password'});
	}
	db.then(client => {
		client.query("select email, password from user where email = ?", [email], (err, rows) => {
			if (!err) {
				if (!rows.length) { // if nothing is found from DB, in other words email has no match in DB
					console.log("Invalid Email");
					return res.status(404).json({error: 'Invalid Email'});
				}
				const hash = rows[0].password;
				bcrypt.compare(pw, hash, (err, result) => {
					if (result) { // result is true when the password is correct
						// console.log("right password?: " + result);
						// req.session.user = {
						// 	"email": email
						// };
						// req.session.save(
						// 	res.redirect('/')
						// );

						res.cookie("email", email , {
							maxAge: 2 * 60 * 1000, // in milliseconds
							// expires: new Date(Date.now() + 900000), // duration in milliseconds (currently 15m)
							httpOnly: true
						});

						return res.status(200).json({ success: 'Sign in success' });
					} else {
						console.log(`error : ${err}`);
						return res.status(400).json({ error: 'Wrong Password' });
					}
				});
			} else { // almost nothing reaches here
				return res.json(err);
			}
		});
	});
})

router.get("/signout", (req,res) => {
	req.session.destroy((err) => {
		if(err) {
			return res.status(400).json({ error: 'Sign out failed' });
		} else {
			return res.status(200).json({ message: 'Sign out success' });
		}
	});
})

router.post('/register', (req, res) => { // create new user (body param: username, email, password)
	db.then(client => {
		client.query("select * from user", (err, rows) => {
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
	});
})

router.delete('/deregister/:id', (req, res) => { // delete one user by id
	console.log(req.params.id);
	const id = parseInt(req.params.id, 10);
	db.then(client=> {
		client.query("delete from user where id = " + id, (err, rows) => {
			if (!err) {
				console.log("user successfully deleted");
				return res.json(rows);
			} else {
				console.log(`query error : ${err}`);
				return res.json(err);
			}
		});
	});
})

router.get('/signedstatus', (req, res) => {
	if (req.cookies.email) return res.json({ email: req.cookies.email, signin: true });
	else return res.json({ email: false, signin: false });
})

// router.put('/update/:id', (req, res) => { // update username (body param: username, password)
// 	console.log(req.params.id);
// 	console.log(req.body.username);
// 	const id = parseInt(req.params.id, 10);
// 	db.query("update user set username = '" + req.body.username + "' where id = " + id, (err, rows) => {
// 		if (!err) {
// 			console.log(rows);
// 			return res.json({message: "username successfully updated"});
// 		} else {
// 			console.log(`query error : ${err}`);
// 			return res.json(err);
// 		}
// 	});
// })

module.exports.auth = router;