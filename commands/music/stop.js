/**
 * Processes user commands to stop music.
 *
 * @author Jude Markabawi, Stanley Wang.
 * @license See the LICENSE file for details.
 */

var djChad = require("../../util/music/djChad.js");

exports.run = async (client, message, args) => {
    djChad.stop(message, args);
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: 0
};

exports.help = {
    name: "stop",
    description: "Stop playing music.",
    usage: "stop"
};