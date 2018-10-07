/**
 * Defines the roulette command.
 *
 * Handles roulette game related functionality.
 * Interacts with the Roulette User Interface only, never directly
 * accesses the Roulette Game or Game Meister.
 *
 * @author Jude Markabawi, Stanley Wang.
 * @license See the LICENSE file for details.
 */

var rouletteUI = require("../../util/games/roulette/user-interface.js");
exports.run = async (client, message, args) => {
    switch (args[2]) {
        case "start":
            break;
        case "bet":
            break;
        case "view":
            break;
        case "help":
            break;
        default:
            break;
    }
}

exports.conf = {
    enabled: false,
    guildOnly: false,
    aliases: [],
    permLevel: 0
};

exports.help = {
    name: "roulette",
    description: "Roulette commands. Use " + process.env.PREFIX + " roulette help for info.", 
    usage: "roulette <bet/view/help> <bet group> <amount>" 
};