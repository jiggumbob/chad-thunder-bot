/**
 * Processes user commands to view the music queue.
 *
 * @author Jude Markabawi, Stanley Wang.
 * @license See the LICENSE file for details.
 */

var djChad = require("../../util/music/djChad.js");

exports.run = async (client, message, args) => {
    switch (args[0]) {
        case "remove":
            djChad.removeFromQueue(message, args);
            break;
        case "clear":
            djChad.clearQueue(message);
            break;
        default:
            djChad.queue(message);
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