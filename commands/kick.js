const embedTool = require("../util/embed-message-tool.js");

exports.run = async (client, message, args) => {
    let embedString;
    let embedTitle = "Kick Error"; // the most common
    let embedImage = "question";
    let isError = true;
    // error: no user specified
    if (typeof message.mentions.members.first() === "undefined") {
        embedString = "No user specified! Maybe try specifying one?";
    } 
    // error: no reason specified
    else if (args.length < 2) {
        embedString = "No reason specified! Specify a reason for kicking!";
    } 
    // normal operation
    else {
        let reason = args.slice(1).join(" ");
        let user = message.channel.guild.member(message.mentions.members.first());
        try {
            await user.kick(reason);
            embedTitle = "Successful Kick"
            embedString = user.displayName + " has been kicked.\nReason: " + reason;
            embedImage = "smiling face";
            isError = false;
        } catch (e) {
            embedString = "Sorry but I couldn't kick " + user.displayName + "!"
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
    name: "kick",
    description: "Kicks a user for a certain reason.",
    usage: "kick @user <reason>"
};
