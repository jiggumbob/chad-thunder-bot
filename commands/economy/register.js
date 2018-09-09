/**
 * Defines the register command.
 *
 * Registers a user into the database. Utilizes the registerUser utility function to 
 * handle the entire process.
 *
 * @author Jude Markabawi, Stanley Wang.
 * @license See the LICENSE file for details.
 */

var registerUtil = require("../../util/economy/register.js");

exports.run = async (client, message, args) => {
    registerUtil.registerUser(message);
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: 0
};

exports.help = {
    name: "register",
    description: "Registers you into the Chad Economy, granting access to games, money, shops, and more!",
    usage: "register"
};