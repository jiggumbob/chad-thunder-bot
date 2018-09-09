/**
 * Defines the reddit command.
 *
 * Distinguishes between the two subcommands of the reddit command, 
 * then uses the reddit-util file to handle each of the subcommands.
 *
 * @author Jude Markabawi, Stanley Wang.
 * @license See the LICENSE file for details.
 */

const snoowrap = require("snoowrap");
const redditutil = require("../util/reddit/reddit-util.js");
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
