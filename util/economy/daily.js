var sql_connection = require("../sql-connection.js").sql_connection;
var fs = require("fs");
var moment = require("moment");
const Discord = require("discord.js");

exports.dailyReward = function dailyReward(context) {
    let user = context.channel.guild.member(context.author);
  
    sql_connection.query("SELECT chad_bucks, canClaimDaily FROM UserInfo WHERE user_id = " + user.id, function (error, results, fields) {
        let embedMessage = new Discord.RichEmbed();
        let embedString;
        let embedColor;
        let embedImage;
      
        // user is not registered
        if (results.length == 0) {
            embedColor = 0xFF524C; // red and sad emoji --> not registered
            embedImage = "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/147/crying-face_1f622.png";
            embedString = "You are not registered! Use `" + process.env.PREFIX + "register` to register!";
        } 
        // user already claimed reward today
        else if (results[0].canClaimDaily == 0) {
            embedColor = 0xFFDB1D; // yellow and whoops emoji --> already claimed
            embedImage = "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/147/face-with-open-mouth_1f62e.png";
            embedString = "You have already claimed your daily reward today!\nCome back tomorrow for more!";
        } 
        // user can claim reward
        else {                   
            const rewardAmount = 300;
            embedColor = 0xFFDB1D; // yellow and cash emoji --> successful claim
            embedImage = "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/147/money-bag_1f4b0.png";
            embedString = "Hooray! You have claimed your daily reward of " + rewardAmount + " Chad Bucks today!";       
            // make them unable to claim a reward again today and give them the money
            sql_connection.query("UPDATE UserInfo SET canClaimDaily = 0, " 
                                 + "chad_bucks = chad_bucks + " + rewardAmount
                                 + " WHERE user_id = " + user.id, function (error, results, fields) {
            });
        }
        
          embedMessage.setTitle("Daily Reward:");
          embedMessage.setAuthor(user.displayName, user.user.displayAvatarURL);
          embedMessage.setDescription(embedString);
          embedMessage.setThumbnail(embedImage);
          embedMessage.setColor(embedColor);
        
          context.channel.send(embedMessage);
    });
}


/* Checks to see if it has been a full day since the last midnight UTC, and if so, resets everyone's ability to claim a daily reward,
  and changes the day to current UTC.*/
setInterval(function resetClaims(){
    let currentTime = moment();
    let fileTime;
    fs.readFile(__dirname + "/dailyRewardTimer.txt", "utf-8", function(err, data) {
        fileTime = moment(data);
        if (currentTime.diff(fileTime) >= 24 * 60 * 60 * 1000) {
            sql_connection.query("UPDATE UserInfo SET canClaimDaily = 1", function (error, result, fields) {
            });
          
            let newFileTime = fileTime.add(1, 'days');
          
            fs.writeFile(__dirname + "/dailyRewardTimer.txt", newFileTime.toISOString(), function(err, data) {
            });
        }
    });
}, 10000);
