var sql_connection = require("../sql-connection.js").sql_connection;
const embedTool = require("../embed-message-tool.js");

/* Registers a user into the SQL database*/
exports.registerUser = async function registerUser (context) {
    let user = context.channel.guild.member(context.author);
  
    // check if user is already registered
    sql_connection.query("SELECT 1 FROM UserInfo WHERE user_id = " + user.id, function(error, results, fields) {
        let embedString;
      
        if(results.length > 0) {
            embedString = "You are already registered, no need to register again!";
        } else {
            // not registered, register them with 100 chad bucks to start
            sql_connection.query("INSERT INTO UserInfo (user_id, chad_bucks, canClaimDaily) VALUES (" 
                                 + user.id + ", 100, 1)", function(error, results, fields) {        
            });
            embedString = "You are now registered to the Chad Economy and have been given 100 Chad Bucks! Have fun!";
        }
      
        let response = embedTool.createMessage("Register:", embedString, "smiling sunglasses", false);
        response.setAuthor(user.displayName, user.user.displayAvatarURL);
        context.channel.send(response);
    });
}
