const Discord = require("discord.js");

exports.run = async (client, message, args) => {
    // calculates the time difference between when user's message was sent and when the bot sent one back
    let responseMessage = await message.channel.send("Pinging...");
    let latency = responseMessage.createdTimestamp - message.createdTimestamp;

    // if negative latency error happens, try again
    while (latency < 0) {
        responseMessage.delete();
        responseMessage = await message.channel.send("Pinging again...");
        latency = responseMessage.createdTimestamp - message.createdTimestamp;
    }

    let embed = new Discord.RichEmbed();
    embed.setColor(0xFFDB1D);
    embed.setTitle("Ping");
    embed.setDescription(latency + " ms");

    responseMessage.edit(embed);
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: 0
};

exports.help = {
    name: "ping",
    description: "Returns how long it takes for Chad to send a message back.",
    usage: "ping"
};
