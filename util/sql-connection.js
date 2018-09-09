/**
 * Establishes connection to the SQL database.
 *
 * The database is used to store user's currency information as well as other info relating to the 
 * economy functions, game functions, etc. where needed.
 *
 * @author Jude Markabawi, Stanley Wang.
 * @license See the LICENSE file for details.
 */

var mysql = require("mysql");

exports.sql_connection = mysql.createConnection({
    host     : process.env.DATABASE_HOST,
    user     : process.env.DATABASE_USERNAME,
    password : process.env.DATABASE_PASSWORD,
    database : process.env.DATABASE_USERNAME
}); 

