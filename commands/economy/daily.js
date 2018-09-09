/**
 * Defines the daily command.
 *
 * Attemps to claim a user's daily reward. Utilizes the dailyReward utility function
 * to handle the entire process.
 *
 * @author Jude Markabawi, Stanley Wang.
 * @license See the LICENSE file for details.
 */

var dailyUtil = require("../../util/economy/daily.js");

exports.run = async (client, message, args) => {
    dailyUtil.dailyReward(message);
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: 0
};

exports.help = {
    name: "daily",
    description: "Claims user's daily reward",
    usage: "daily"
};