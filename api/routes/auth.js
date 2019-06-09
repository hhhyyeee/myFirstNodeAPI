const express = require('express');
const os = require('os');
const router = express.Router();
var bodyParser = require('body-parser')
var bcrypt = require('bcrypt');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'content-type, x-access-token'); //1
    next();
});
const db = require('../database/config');

const header = {
    "typ": "JWT",
    "alg": "HS256"
}
const encodedHeader = new Buffer(JSON.stringify(header))
                            .toString('base64')
                            .replace('=', '');
console.log('header: ', encodedHeader);
const payload = {
    "iss": "andrea.com",
    "exp": "1485270000000",
    "https://velopert.com/jwt_claims/is_admin": true,
    "userId": "1",
    "username": "dominique"
};
const encodedPayload = new Buffer(JSON.stringify(payload))
                            .toString('base64')
                            .replace('=', '');
console.log('payload: ', encodedPayload);
const crypto = require('crypto');
const signature = crypto.createHmac('sha256', 'secret')
             .update(encodedHeader + '.' + encodedPayload)
             .digest('base64')
             .replace('=', '');
console.log('signature: ', signature);
const theresult = encodedHeader + '.' + encodedPayload + '.' + signature;
console.log('result: ', theresult);


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