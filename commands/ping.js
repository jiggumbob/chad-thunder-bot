const Discord = require("discord.js");

exports.run = async (client, message, args) => {
    // calculates the time difference between when user's message was sent and when the bot sent one back

    let responseMessage = await message.channel.send("Pinging...");
    let latency = responseMessage.createdTimestamp - message.createdTimestamp;

    // delete first ping message, resend new one, and recalculate (sometimes negative latency error happens)
    while (latency < 0) {
        responseMessage.delete();
        responseMessage = await message.channel.send("Pinging again...");
        latency = responseMessage.createdTimestamp - message.createdTimestamp;
    }
    
    let embed = new Discord.RichEmbed();
    embed.setColor(0xffff00);
    embed.setTitle("Ping");
    embed.setDescription(latency + " ms");
  
    await responseMessage.edit(embed);
}

exports.conf = {
    enabled: true, // not used yet
    guildOnly: false, // not used yet
    aliases: [],
    permLevel: 0 // Permissions Required, higher is more power
};

exports.help = {
    name: "ping",
    description: "Returns how long it takes for Chad to send a message back.",
    usage: "ping"
};