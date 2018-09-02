var sql_connection = require("../sql-connection.js").sql_connection;
const Discord = require("discord.js");

exports.balance = async function balance (context) {
    let user_guild_member;
    let isSelf; // whether or not user is looking for their own balance or someone else's
    
    // distinguish between finding the user's balance and a different user's balance
    if (typeof context.mentions.members.first() === "undefined") {
        user_guild_member = context.channel.guild.member(context.author);
        isSelf = true;
    } else {  
        user_guild_member = context.channel.guild.member(context.mentions.members.first());
        isSelf = false;
    }
  
    sql_connection.query("SELECT * FROM UserInfo WHERE user_id = " + user_guild_member.id, function(error, results, fields) {          
        let embedMessage = new Discord.RichEmbed();
        let embedString;
        let embedColor;
        let embedImage;
      
        // the requested user is not registered so they have no currency
        if(results.length == 0) {
            embedColor = 0xFF524C; // red and sad emoji --> not registered
            embedImage = "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/147/crying-face_1f622.png"
            if (isSelf) {
                embedString = "You are not registered! Use `" + process.env.PREFIX + "register` to register!";
            } else {
                embedString = user_guild_member.displayName + " is not registered. Tell them to use `"
                                  + process.env.PREFIX + "register` to register!";
            }
        } else {
            embedColor = 0xFFDB1D; // yellow and money emoji --> registered
            embedImage = "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/147/money-with-wings_1f4b8.png"
            if (isSelf) {
                embedString = "You have "  + results[0].chad_bucks + " Chad Bucks!";
            } else {
                embedString = user_guild_member.displayName + " has " + results[0].chad_bucks + " Chad Bucks!";
            }
        }
          
      embedMessage.setTitle("Balance:");
      embedMessage.setAuthor(user_guild_member.displayName, user_guild_member.user.displayAvatarURL);
      embedMessage.setDescription(embedString);
      embedMessage.setThumbnail(embedImage);
      embedMessage.setColor(embedColor);

      context.channel.send(embedMessage);
    });

}
