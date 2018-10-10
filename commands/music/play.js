/**
 * Processes user commands to play music.
 *
 * @author Jude Markabawi, Stanley Wang.
 * @license See the LICENSE file for details.
 */

var djChad = require("../../util/music/djChad.js");

exports.run = async (client, message, args) => {
    djChad.play(message, args);
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: 0
};

exports.help = {
    name: "play",
    description: "Add a song to the queue to be played.",
    usage: "play <song/link>"
};