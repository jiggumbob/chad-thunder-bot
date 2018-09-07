var sql_connection = require("../sql-connection.js").sql_connection;
const Discord = require("discord.js");

/* Registers a user into the SQL database*/
exports.registerUser = async function registerUser (context) {
    let user = context.channel.guild.member(context.author);
  
    // check if user is already registered
    sql_connection.query("SELECT 1 FROM UserInfo WHERE user_id = " + user.id, function(error, results, fields) {
        let embedMessage = new Discord.RichEmbed();
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
        
        embedMessage.setTitle("Register");
        embedMessage.setAuthor(user.nickname, user.user.displayAvatarURL);
        embedMessage.setDescription(embedString);
        embedMessage.setThumbnail("https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/"
                                  + "120/twitter/147/smiling-face-with-sunglasses_1f60e.png");
        embedMessage.setColor(0xFFDB1D);
        context.channel.send(embedMessage);
    });
}
