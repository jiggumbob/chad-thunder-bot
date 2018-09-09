/**
 * Defines the balance command.
 *
 * Views a user's balance. Utilizes the balance utility function to 
 * handle the entire process.
 *
 * @author Jude Markabawi, Stanley Wang.
 * @license See the LICENSE file for details.
 */

var registerUtil = require("../../util/economy/balance.js");

exports.run = async (client, message, args) => {
    registerUtil.balance(message);
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["bal"],
    permLevel: 0
};

exports.help = {
    name: "balance",
    description: "Returns how many Chad Bucks the user has",
    usage: "balance"
};