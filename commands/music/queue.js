/**
 * Processes user commands to view the music queue.
 *
 * @author Jude Markabawi, Stanley Wang.
 * @license See the LICENSE file for details.
 */

var djChad = require("../../util/music/djChad.js");
const embedUtil = require("../../util/embed-message-tool.js");

exports.run = async (client, message, args) => {
    switch (args[0]) {
        case "remove":
            djChad.removeFromQueue(message, args);
            break;
        case "clear":
            djChad.clearQueue(message);
            break;
        case "view":
            djChad.queue(message, args);
            break;
        default:
            let error = embedUtil.createMessage("Error", "Please specify which queue subcommand " + 
                                                  "you want to use!\n Use `" + process.env.PREFIX + "help` " +
                                                  "for more info.", "crossed out bell", true);
            message.channel.send(error); 
    }
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["q"],
    permLevel: 0
};

exports.help = {
    name: "queue",
    description: "Lists queue.",
    usage: "queue"
};