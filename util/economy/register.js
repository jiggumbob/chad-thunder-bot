var sql_connection = require("../sql-connection.js").sql_connection;

exports.registerUser = async function registerUser (context) {
    // 1. check if user is already registered
        // search through user database, if there is a match for their ID, then do not register
    // 2. register user
        // add user to database with their ID, give them a few chadbucks to start off
}
