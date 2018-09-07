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