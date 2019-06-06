const express = require('express');
const os = require('os');
const router = express.Router();
var bodyParser = require('body-parser')
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
const db = require('../database/config');

router.get('/welcome', (req, res) => { // root page
	res.send('Welcome to Andy\'s Cine API for Searching!\n');
});

router.get('/title/:keyword', (req, res) => {
    console.log(req.params.keyword);
	const keyword = req.params.keyword;
    db.query("select * from cinema where title like '%" + keyword + "%'", (err, rows) => {
		if (!err) {
			console.log(rows);
			return res.json(rows);
		} else {
			console.log(`query error : ${err}`);
			return res.status(400).json({error: "Retrieve Error"});
		}
	});
})

module.exports.search_router = router;