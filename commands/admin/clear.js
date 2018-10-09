/**
 * Defines the clear command.
 *
 * Bulk clears a specified number of messages from the channel's chat.
 * Only users with sufficient permission can use this command.
 *
 * @author Jude Markabawi, Stanley Wang.
 * @license See the LICENSE file for details.
 */

const embedTool = require("../../util/embed-message-tool.js");

exports.run = async (client, message, args) => {
    if (isNaN(args[0])) {
        message.channel.send(
            embedTool.createMessage("Invalid Clear Command",
                                    "You need to say how many messages to clear ... how " + "else would I know how many to clear?\n Use "
                                    + "`" + process.env.PREFIX + "help clear` for more info.", 
                                    "confused face", 
                                    true)
        );
        return;
    }
  
    // delete one extra to remove user's message
    await message.channel.bulkDelete(+args[0] + 1, true);
}
exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: 2
};

exports.help = {
    name: "clear",
    description: "Clears a certain number of messages. Cannot clear messages older than 14 days.",
    usage: "clear <number>"
};
