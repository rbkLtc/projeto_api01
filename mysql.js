const mysql = require('mysql');

var pool = mysql.createPool({
    "user" : "root",
    "password" : "senha",
    "database" : "books",
    "host" : "localhost",
    "port" : 3306
});

exports.pool = pool;