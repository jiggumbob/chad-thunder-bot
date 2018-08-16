// calculates the time difference between when the message was sent and when the bot received it
exports.run = (client, message, args) => {
    message.channel.send("Ping: " + (new Date().getTime() - message.createdTimestamp) + " ms").catch(console.error);
}
