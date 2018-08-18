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

    await responseMessage.edit({
        embed: {
            color: 0xffff00,

            title: "Chad ThunderBot",

            fields: [{
                name: 'Ping',

                value: latency + " ms",
            }]
        }
    });


}
