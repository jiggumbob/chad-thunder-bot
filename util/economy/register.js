var sql_connection = require("../sql-connection.js").sql_connection;

exports.registerUser = async function registerUser (context) {
    let user_id = context.author.id;
  
    // check if user is already registered
    sql_connection.query("SELECT 1 FROM UserInfo WHERE user_id = " + user_id, function(error, results, fields) {
        if(results.length > 0) {
            context.channel.send("You are already registered, no need to register again!");
            return;
        } else {
            // not registered, register them with 100 chad bucks to start
            let add_query = "INSERT INTO UserInfo (user_id, chad_bucks) VALUES (" + user_id + ", 100)";
            sql_connection.query(add_query, function(error, results, fields) {
                context.channel.send("You are now registered to the Chad Economy and have been given 100 Chad Bucks! Have fun!");
            });
        }
    });
}
