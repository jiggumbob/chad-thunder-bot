/**
 * Defines the roulette command.
 *
 * Handles roulette game related functionality.
 *
 * @author Jude Markabawi, Stanley Wang.
 * @license See the LICENSE file for details.
 */

exports.run = async (client, message, args) => {
  
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