/**
 * Defines the search command.
 *
 * @author Jude Markabawi, Stanley Wang.
 * @license See the LICENSE file for details.
 */
const searchUtil = require("../util/search.js");

exports.run = async (client, message, args) => {
    searchUtil.search(message, args);
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["s", "g"],
    permLevel: 0
};

exports.help = {
    name: "search",
    description: "Returns search results.",
    usage: "search <argument>"
};
