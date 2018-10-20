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
    if(!args[0]) {
        message.channel.send(embedTool.createMessage("Reddit Error", "Please specify a Subreddit", "confused face", true));
        return;
    }
    if(args[0].includes("https://")) {
        redditutil.processUrlCommand(args[0], message);
    } else {
        redditutil.processRandomCommand(args[0], message);
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
    description: "For ``reddit [subreddit]``, prints a random post from that subreddit.\n" +
        "For ``reddit [reddit post url]``, prints the post at that URL.",
    usage: "reddit <argument>"
};
