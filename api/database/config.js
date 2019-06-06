const mysql = require('mysql');

const connection = mysql.createPool({
    // host: 'cinemadbinstance.cutwxlewnxqq.ap-northeast-1.rds.amazonaws.com',
    // user: 'admin',
    // password: 'dominic_13',
    // database: 'cinemaDB'
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'cinemaArchive'
});

module.exports = connection;