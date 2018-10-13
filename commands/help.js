/**
 * Defines the help command.
 *
 * Lists all of the commands the bot has available to the user. Does not
 * display disabled commands.
 *
 * @author Jude Markabawi, Stanley Wang.
 * @license See the LICENSE file for details.
 */

const embedUtil = require("../util/embed-message-tool");

exports.run = async (client, message, args) => {
    let description = "Go [here](https://chadthunderbot.weebly.com/help.html) for help.";
    let embed = embedUtil.createMessage("Help", description, "smiling sunglasses", false);
    message.channel.send(embed);
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: 0
};

exports.help = {
    name: "help",
    description: "Gives info on Chad's capabilities",
    usage: "help"
};
