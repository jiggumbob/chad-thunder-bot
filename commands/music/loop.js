/**
 * Processes user commands to loop the song.
 *
 * @author Jude Markabawi, Stanley Wang.
 * @license See the LICENSE file for details.
 */

var djChad = require("../../util/music/djChad.js");

exports.run = async (client, message, args) => {
    djChad.loop(message);
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: 0
};

exports.help = {
    name: "loop",
    description: "Loops the current song.",
    usage: "loop"
};