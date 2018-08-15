module.exports = {
    name: 'test',
    description: 'Testing command',
    execute(message, args) {
        message.channel.send('test');
    },
};
