var sql_connection = require("../sql-connection.js").sql_connection;

exports.registerUser = async function registerUser (context) {
    let user_id = context.author.id;
    sql_connection.connect();
  
    // 1. check if user is already registered
    let exists_query = "SELECT TOP 1 1 FROM UserInfo WHERE id = " + user_id + ";";
    let result;
    await sql_connection.query(exists_query, function(error, results, fields) {
        result = results;
    });
  
    if(typeof result === "undefined") {
        context.channel.send("You are already registered, no need to register again!");
        return;
    }
  
    // 2. register user and give them 100 chad bucks to start with
    let add_query = "INSERT INTO UserInfo (user_id, chad_bucks) VALUES (" + user_id + ", 100);"
    await sql_connection.query(add_query, function(error, results, fields) {
        context.channel.send("You are now registered to the Chad Economy and have been given 100 Chad Bucks! Have fun!");
    });

    sql_connection.end();
}
