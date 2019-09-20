const db = require('../database/config');
const bcrypt = require('bcrypt');
const async = require('async');

const userMethods = {
    createUser: ((newUser, cb) => {
        async.waterfall([

            // managing password hashing
            async.apply(((newUser, callback) => {
                bcrypt.genSalt(10, (err, salt) => {
                    if (err) {
                        console.log(err);
                        cb(err, null);
                    } else {
                        // console.log("salt: " + salt);
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) {
                                console.log(err);
                                cb(err, null);
                            } else {
                                let value = [[newUser.id, newUser.username, newUser.email, hash, salt, newUser.created_at, newUser.admin]];
                                callback(null, value);
                            }
                        })
                    }
                })
            }), newUser),

            // actual db querying
            ((value) => {
                let sql = "INSERT INTO user (id, username, email, password, password_salt, created_at, admin) VALUES ?";
                db.query(sql, [value], (err, res) => {
                    if (err) {
                        cb(err, null);
                    } else {
                        console.log("Successfully signed up");
                        console.log("Number of records inserted: " + res.affectedRows);
                        console.log(value);
                        cb(null, { message: "success", id: value[0][0], username: value[0][1] });
                    }
                });
            })
        ])
    }),
}

module.exports = userMethods;