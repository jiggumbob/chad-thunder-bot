/**
 * Provides a command to create embed messages in a streamlined manner.
 *
 * Ensures consistency in the design color throughout the bot messages and allows for
 * easy switching between different colors without going through tons of files. Also provides a 
 * list of emojis for use by embed messages, eliminating the need to put huge links in many files.
 *
 * @author Jude Markabawi, Stanley Wang.
 * @license See the LICENSE file for details.
 */

const snoowrap = require("snoowrap");
const redditutil = require("../util/reddit/reddit-util.js");
const Reddit = new snoowrap({
    userAgent: "Discord: chad-thunder-bot",
    clientId: process.env.REDDIT_CLIENT_ID,
    clientSecret: process.env.REDDIT_CLIENT_SECRET,
    refreshToken: process.env.REDDIT_REFRESH_TOKEN
});
const embedTool = require("../util/embed-message-tool.js");

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
            message.channel.send(
                embedTool.createMessage("Unknown Reddit Subcommand", 
                                        "Maybe try using the command correctly? \n" + "Use `" + process.env.PREFIX + "help reddit` for info.",
                                        "question",
                                        true)
            );
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
