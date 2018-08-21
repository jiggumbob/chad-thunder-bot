const Discord = require("discord.js");

exports.run = (client, message, args) => {
  let embed = new Discord.RichEmbed()
  if (!args[0]) {
    embed.setTitle("Commands");
    embed.setDescription(`Use ${process.env.PREFIX}help <command> for details.`);
    embed.setColor(0xffff00);
    client.commands.forEach(function(c) {
      embed.addField(c.help.name, c.help.description);
    });
    message.channel.send(embed);
    // message.channel.sendCode("asciidoc", `= Command List =\n\n[Use ${process.env.PREFIX}help <commandname> for details]\n\n${client.commands.map(c=>`${c.help.name}:: ${c.help.description}`).join("\n")}`);
  } else {
    let c = args[0];
    if(client.commands.has(c)) {
      c = client.commands.get(c);
      embed.setTitle(c.help.name);
      embed.setColor(0xffff00);
      embed.addField(c.help.usage, `aliases: ${c.conf.aliases.toString()}`);
      message.channel.send(embed);
      // message.channel.sendCode("asciidoc", `= ${command.help.name} = \n${command.help.description}\nusage::${command.help.usage}`);
    }
  }
}

exports.conf = {
  enabled: true, // not used yet
  guildOnly: false, // not used yet
  aliases: [],
  permLevel: 0 // Permissions Required, higher is more power
};

exports.help = {
  name : "help",
  description: "Return stuff Chad can do.",
  usage: "help"
};



