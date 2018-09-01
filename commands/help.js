const Discord = require("discord.js");

exports.run = async (client, message, args) => {
    let embed = new Discord.RichEmbed()
    if (!args[0]) {
        embed.setTitle("Commands");
        embed.setDescription("Use " + process.env.PREFIX + "help <command> for details.");
        embed.setColor(0xffff00);
        // list every command and its description
        client.commands.forEach(function(c) {
            embed.addField(c.help.name, c.help.description);
        });
        await message.channel.send(embed);
    } else {
        let c = args[0];
        if (client.commands.has(c)) {
            c = client.commands.get(c);
            embed.setTitle(c.help.name);
            embed.setColor(0xffff00);
            embed.addField(c.help.usage, "aliases: " + c.conf.aliases.toString());
            embed.addField("Description", c.help.description);
            await message.channel.send(embed);
        }
    }
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: 0
};

exports.help = {
    name: "help",
    description: "Returns what Chad can do.",
    usage: "help"
};
