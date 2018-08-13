module.exports = {
    name: 'restart',
    description: 'Restarts the bot.',
    execute(message, args) {
        resetBot(message.channel)
    },
};

// Turn bot off (destroy), then turn it back on
function resetBot(channel) {
    // send resetting message
    channel.send('Resetting...')
    .then(msg => client.destroy())
    .then(() => client.login(config.discordToken);
}
