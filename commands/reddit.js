exports.run = async (client, message, args) => {
    const snoowrap = require("snoowrap");
    const redditutil = require("../util/reddit/reddit-util.js");

    const Reddit = new snoowrap({
        userAgent: "Discord: chad-thunder-bot",
        clientId: process.env.REDDIT_CLIENT_ID,
        clientSecret: process.env.REDDIT_CLIENT_SECRET,
        refreshToken: process.env.REDDIT_REFRESH_TOKEN
    });

    let commands = message.content.split(" ");
    let subcommand = commands[1];
    let argument = commands[2];

    switch (subcommand) {
        case "r":
            await redditutil.processRandomCommand(argument, message); // message is the context passed
            break;
        case "u":
            await redditutil.processUrlCommand(argument, message);
            break;
        default:
            message.channel.send("Unrecognized reddit subcommand.");
    }
}

exports.conf = {
    enabled: true, // not used yet
    guildOnly: false, // not used yet
    aliases: [],
    permLevel: 0 // Permissions Required, higher is more power
};

exports.help = {
    name: "reddit",
    description: "For ``reddit r [subreddit]``, prints a random post from that subreddit.\n"
                +"For ``reddit u [reddit post url]``, prints the post at that URL.",
    usage: "reddit <r/u> <argument>"
};