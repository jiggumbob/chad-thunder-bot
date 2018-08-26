module.exports = (client, message) => {
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
        message.channel.send("``" + process.env.PREFIX + command + "`` is not a command.");
    }

    if (cmd) {
        // Check user's perm level against required perms
        if (perms < cmd.conf.permLevel) {
            message.channel.send("You don't have permission to use this command.");
            return;
        }
        // Run the `exports.run()` function defined in each command.
        cmd.run(client, message, args);
    }
};
