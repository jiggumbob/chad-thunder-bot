const snoowrap = require("snoowrap");
const redditutil = require("../util/reddit/reddit-util.js");
const Reddit = new snoowrap({
    userAgent: "Discord: chad-thunder-bot",
    clientId: process.env.REDDIT_CLIENT_ID,
    clientSecret: process.env.REDDIT_CLIENT_SECRET,
    refreshToken: process.env.REDDIT_REFRESH_TOKEN
});
const Discord = require("discord.js");

exports.run = async (client, message, args) => {
    let commands = message.content.split(" ");
    let subcommand = commands[1];
    let argument = commands[2];

    switch (subcommand) {
        case "r":
            redditutil.processRandomCommand(argument, message);
            break;
        case "u":
            redditutil.processUrlCommand(argument, message);
            break;
        default:
            let embed = new Discord.RichEmbed();
            embed.setTitle("Unknown Reddit Subcommand");
            embed.setDescription("Maybe try using the command correctly? \n" 
                                 + "Use `" + process.env.PREFIX + "help reddit` for info.");
            embed.setThumbnail("https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/147/black-question-mark-ornament_2753.png");
            embed.setColor(0xFF524C);
            message.channel.send(embed);
    }
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: 0
};

exports.help = {
    name: "reddit",
    description: "For ``reddit r [subreddit]``, prints a random post from that subreddit.\n" +
        "For ``reddit u [reddit post url]``, prints the post at that URL.",
    usage: "reddit <r/u> <argument>"
};
