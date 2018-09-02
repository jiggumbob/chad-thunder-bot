var registerUtil = require("../util/economy/register.js");

exports.run = async (client, message, args) => {
    await registerUtil.registerUser(message);
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