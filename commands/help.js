/**
 * Defines the help command.
 *
 * Lists all of the commands the bot has available to the user. Does not
 * display disabled commands.
 *
 * @author Jude Markabawi, Stanley Wang.
 * @license See the LICENSE file for details.
 */

const Discord = require("discord.js");

exports.run = async (client, message, args) => {
    let embed = new Discord.RichEmbed()
    if (!args[0]) {
        embed.setTitle("Commands");
        embed.setDescription("Use " + process.env.PREFIX + "help <command> for details.");
        embed.setColor(0xFFDB1D);
        // list every enabled command and its description
        client.commands.forEach(function(c) {
            if(c.conf.enabled) {
                embed.addField(c.help.name, c.help.description);
            }
        });
        message.channel.send(embed);
    } else {
        let c = args[0];
        if (client.commands.has(c)) {
            c = client.commands.get(c);
            embed.setTitle(c.help.name);
            embed.setColor(0xFFDB1D);
            embed.addField(c.help.usage, "aliases: " + c.conf.aliases.toString());
            embed.addField("Description", c.help.description);
            message.channel.send(embed);
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
