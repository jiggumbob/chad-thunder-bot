/**
 * Defines the message event.
 *
 * Runs whenever a user sends a message.
 *
 * @author Jude Markabawi, Stanley Wang.
 * @license See the LICENSE file for details.
 */

const embedTool = require("../util/embed-message-tool.js");
module.exports = async (client, message) => {
    client.elevation = function(message) {
        /* This function should resolve to an ELEVATION level which
           is then sent to the command handler for verification*/
        let permlvl = 0;
        if (message.member.permissions.has("MANAGE_MESSAGES")) permlvl = 2;
        if (message.member.permissions.has("ADMINISTRATOR")) permlvl = 3;
        return permlvl;
    };
    // ignore all bots
    if (message.author.bot) return;

    if (message.content.indexOf(process.env.PREFIX) !== 0) return;

    // standard argument/command name definition.
    const args = message.content.slice(process.env.PREFIX.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    let perms = client.elevation(message);
    let cmd;

    // check if command exists in commands or aliases, then assign it
    if (client.commands.has(command)) {
        cmd = client.commands.get(command)
    } else if (client.aliases.has(command)) {
        cmd = client.commands.get(client.aliases.get(command));
    } else {
        message.channel.send(
            embedTool.createMessage("Unknown Command",
                                    "`" + process.env.PREFIX + command + "` is not a command.\n"
                                    + "Try issuing an actual command?\nUse `" + process.env.PREFIX + "help` to see what they are.",
                                    "question",
                                    true)               
        );
        return;
    }

    if (cmd) {
        // Check user's perm level against required perms
        if (perms < cmd.conf.permLevel) {
            message.channel.send(
                embedTool.createMessage("Insufficient Permission",
                                    "You don't have permission to use this command.\n Maybe try not using it? Or getting permission?",
                                    "entry denied",
                                    true)              
            );
            return;
        }
        // Run the `exports.run()` function defined in each command.
        cmd.run(client, message, args);
    }
};
