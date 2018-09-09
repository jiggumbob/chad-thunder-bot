/**
 * Defines the ban command.
 *
 * Bans a user from the server, if the bot is able to. Only users
 * with sufficient permission are able to use this command.
 *
 * @author Jude Markabawi, Stanley Wang.
 * @license See the LICENSE file for details.
 */

const embedTool = require("../../util/embed-message-tool.js");

exports.run = async (client, message, args) => {
    let embedString;
    let embedTitle = "Ban Error"; // the most common
    let embedImage = "question";
    let isError = true;
    // error: no user specified
    if (typeof message.mentions.members.first() === "undefined") {
        embedString = "No user specified! Maybe try specifying one?";
    } 
    // error: no reason specified
    else if (args.length < 2) {
        embedString = "No reason specified! Specify a reason for banning!";
    } 
    // normal operation
    else {
        let reason = args.slice(1).join(" ");
        let user = message.channel.guild.member(message.mentions.members.first());
        try {
            await user.ban(reason);
            embedTitle = "Successful Ban"
            embedString = user.displayName + " has been banned.\nReason: " + reason;
            embedImage = "smiling face";
            isError = false;
        } catch (e) {
            embedString = "Sorry but I couldn't ban " + user.displayName + "!"
            embedImage = "pensive";
        }
    }
    
    let response = embedTool.createMessage(embedTitle, embedString, embedImage, isError);
    message.channel.send(response);
}
exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: 3 
};

exports.help = {
    name: "ban",
    description: "Bans a user for a certain reason.",
    usage: "ban @user <reason>"
};
