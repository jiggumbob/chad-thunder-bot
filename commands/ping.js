exports.run = async (client, message, args) => {
  // calculates the time difference between when user's message was sent and when the bot sent one back

  let responseMessage =  await message.channel.send("Pinging...");
  let latency = responseMessage.createdTimestamp - message.createdTimestamp;
  
  // delete first ping message, resend new one, and recalculate (sometimes negative latency error happens)
  while (latency < 0) {
    responseMessage.delete();
    responseMessage = await message.channel.send("Pinging again...");
    latency = responseMessage.createdTimestamp - message.createdTimestamp;
  }
  
  await responseMessage.edit({
    embed: {
      color: 0xffff00,
      
      title: "Chad ThunderBot",
      
      fields : [
        {
          name:"Ping",
          
          value: latency + " ms",
        } 
      ]
    }
  });
}

exports.conf = {
  enabled: true, // not used yet
  guildOnly: false, // not used yet
  aliases: [],
  permLevel: 0 // Permissions Required, higher is more power
};

exports.help = {
  name : "ping",
  description: "Get ping",
  usage: "ping"
};