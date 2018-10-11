/**
 * Processes user commands to remove a song from the music queue.
 *
 * @author Jude Markabawi, Stanley Wang.
 * @license See the LICENSE file for details.
 */

var djChad = require("../../util/music/djChad.js");

exports.run = async (client, message, args) => {
    djChad.removeFromQueue(message, args);
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: 0
};

exports.help = {
    name: "remove",
    description: "Removes a song in the queue.",
    usage: "remove <song position>"
};