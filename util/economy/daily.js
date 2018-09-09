/**
 * Defines the dailyReward function and reset interval.
 *
 * The dailyReward function is used by the daily command to process requests to claim
 * a user's daily reward. It is in charge of determining whether the requester is actually 
 * registered and is eligible to claim their daily reward. The reset interval resets everyone
 * in the database's daily claim eligibility and updates the date tracking timer every 24 hours
 * in alignment with UTC midnight.
 *
 * @author Jude Markabawi, Stanley Wang.
 * @license See the LICENSE file for details.
 */

var sql_connection = require("../sql-connection.js").sql_connection;
var fs = require("fs");
var moment = require("moment");
const embedTool = require("../embed-message-tool.js");

/**
 * Gives a user their daily reward, if they are eligible to receive one.
 *
 * First checks if they are registered, if not, prompts them to register.
 * Then if they already claimed a reward today, tells them so. Finally, allows them to claim their reward.
*/
exports.dailyReward = function dailyReward(context) {
    let user = context.channel.guild.member(context.author);
  
    sql_connection.query("SELECT chad_bucks, canClaimDaily FROM UserInfo WHERE user_id = " + user.id, function (error, results, fields) {
        let embedString;
        let isError = false; // errors have different embed colors
        let embedImage;
      
        // user is not registered
        if (results.length == 0) {
            isError = true;
            embedImage = "crying face";
            embedString = "You are not registered! Use `" + process.env.PREFIX + "register` to register!";
        } 
        // user already claimed reward today
        else if (results[0].canClaimDaily.readInt8(0) == 0) { // stored as BIT in SQL, in node it is a buffer object, we will read as int
            embedImage = "face open mouth";
            embedString = "You have already claimed your daily reward today!\nCome back tomorrow for more!";
        } 
        // user can claim reward
        else {                   
            const rewardAmount = 300;
            embedImage = "bag of cash";
            embedString = "Hooray! You have claimed your daily reward of " + rewardAmount + " Chad Bucks today!";       
            // make them unable to claim a reward again today and give them the money
            sql_connection.query("UPDATE UserInfo SET canClaimDaily = 0, " 
                                 + "chad_bucks = chad_bucks + " + rewardAmount
                                 + " WHERE user_id = " + user.id, function (error, results, fields) {
            });
        }
      
        let response = embedTool.createMessage("Daily Reward:", embedString, embedImage, isError);
        response.setAuthor(user.displayName, user.user.displayAvatarURL);
        context.channel.send(response);
    });
}


/**
 * Checks to see if it has been a full day since the last midnight UTC, and if so, resets everyone's ability to claim a daily reward,
 * and changes the day to current UTC.
 */
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
