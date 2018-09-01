var mysql = require("mysql");

exports.sql_connection = mysql.createConnection({
    host     : process.env.DATABASE_HOST,
    user     : process.env.DATABASE_USERNAME,
    password : process.env.DATABASE_PASSWORD,
    database : process.env.DATABASE_USERNAME
}); 

