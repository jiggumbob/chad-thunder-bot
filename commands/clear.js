exports.run = async (client, message, args) => {
    if (!message.channel.permissionsFor(message.member).has("MANAGE_MESSAGES")) {
        await message.channel.send("Sorry, you don't have the permission to execute the command \"" + message.content + "\"");
        return;
    }

    if (isNaN(args[0])) {
        await message.channel.send("Use a number as an argument.");
        return;
    }

     // delete one extra to remove user's message
    await message.channel.bulkDelete(+args[0] + 1);
}
exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: 2
};

exports.help = {
    name: "clear",
    description: "Clears a certain number of messages.",
    usage: "clear <number>"
};
