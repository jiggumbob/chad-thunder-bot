var sql_connection = require("../sql-connection.js").sql_connection;
const embedTool = require("../embed-message-tool.js");

/* Gets the balance of a user, either the commander or a user mentioned.*/
exports.balance = async function balance (context) {
    let user;
    let isSelf; // whether or not user is looking for their own balance or someone else's
    
    // distinguish between finding the user's balance and a different user's balance
    if (typeof context.mentions.members.first() === "undefined") {
        user = context.channel.guild.member(context.author);
        isSelf = true;
    } else {  
        user = context.channel.guild.member(context.mentions.members.first());
        isSelf = false;
    }
  
    sql_connection.query("SELECT * FROM UserInfo WHERE user_id = " + user.id, function(error, results, fields) {
        let embedString;
        let embedImage;
        let isError = false; // errors have different embed colors
      
        // the requested user is not registered so they have no currency
        if (results.length == 0) {
            isError = true;
            embedImage = "crying face";
          
            if (isSelf) {
                embedString = "You are not registered! Use `" + process.env.PREFIX + "register` to register!";
            } else {
                embedString = user.displayName + " is not registered. Tell them to use `"
                                  + process.env.PREFIX + "register` to register!";
            }
        } 
        // user is registered, show their money
        else {
            embedImage = "money with wings";
          
            if (isSelf) {
                embedString = "You have "  + results[0].chad_bucks + " Chad Bucks!";
            } else {
                embedString = user.displayName + " has " + results[0].chad_bucks + " Chad Bucks!";
            }
        }
      
      let response = embedTool.createMessage("Balance:", embedString, embedImage, isError);
      response.setAuthor(user.displayName, user.user.displayAvatarURL);
      context.channel.send(response);
                                                   
    });

}
