module.exports = (client, message) => {
  // Ignore all bots
  if (message.author.bot) return;

  // if (message.content.toLowerCase().includes("oof") >= 0) {
  //   message.delete();
  //   message.channel.send(message.content.replace("oof", "ZAHIJAHI"));
  // }
  // Ignore messages not starting with the prefix
  if (message.content.indexOf(process.env.PREFIX) !== 0) return;
  
  // Our standard argument/command name definition.
  const args = message.content.slice(process.env.PREFIX.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  // let perms = client.elevation(message);
  let cmd;
  // Check if the command exists in Commands
  if (client.commands.has(command)) {
    // Assign the command, if it exists in Commands
    cmd = client.commands.get(command)
  // Check if the command exists in Aliases
  } else if (client.aliases.has(command)) {
    // Assign the command, if it exists in Aliases
    cmd = client.commands.get(client.aliases.get(command));
  }

  if(cmd) {
    // Check user's perm level against the required level in the command
    // if (perms < cmd.conf.permLevel) return;
    // Run the `exports.run()` function defined in each command.
    cmd.run(client, message, args);
  }
};