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
    switch (args[0]) {
        case "start":
            rouletteUI.startGame(message);
            break;
        case "bet":
            rouletteUI.addBet(message, args);
            break;
        case "view":
            rouletteUI.viewResults(message);
            break;
        case "help":
            message.channel.send("coming soon - help");
            break;
        default:
            message.channel.send("Unknown roulette subcommand");
            break;
    }
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: 0
};

exports.help = {
    name: "roulette",
    description: "Roulette commands. Use " + process.env.PREFIX + " roulette help for info.", 
    usage: "roulette <start/bet/view/help> <bet group> <amount>" 
};