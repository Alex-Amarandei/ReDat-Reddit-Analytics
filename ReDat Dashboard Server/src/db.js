var mysql = require('mysql');
var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "parola",
    database: "redat"
});

connection.connect(function(err) {
    if (err) throw err;
});

connection.on('error', function(err) {
    console.log("[mysql error]", err);
});

module.exports = connection;