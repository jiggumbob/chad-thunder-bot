const Discord = require("discord.js");
exports.run = async (client, message, args) => {
    if (!message.channel.permissionsFor(message.member).has("MANAGE_MESSAGES")) {
        message.channel.send("Sorry, you don't have the permission to execute the command \"" + message.content + "\"");
        return;
    }

    if (isNaN(args[0])) {
        let embed = new Discord.RichEmbed();
        embed.setTitle("Invalid Clear Command");
        embed.setDescription("You need to say how many messages to clear ... how "
                             + "else would I know how many to clear?\n Use "
                            + "`" + process.env.PREFIX + "help clear` for more info.");
        embed.setThumbnail("https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/147/confused-face_1f615.png");
        embed.setColor(0xFF524C);
        message.channel.send(embed);
        return;
    }

     // delete one extra to remove user's message
    message.channel.bulkDelete(+args[0] + 1);
}
exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: 2
};

exports.help = {
    name: "clear",
    description: "Clears a certain number of messages.",
    usage: "clear <number>"
};
