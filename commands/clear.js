exports.run = async (client, message, args) => {
    // Check if the user has enough permissions
    if (!message.channel.permissionsFor(message.member).has("MANAGE_MESSAGES")) {
        await message.channel.send("Sorry, you don't have the permission to execute the command \"" + message.content + "\"");
        return;
    }

    //checks if there is a number after
    if (isNaN(args[0])) {
        await message.channel.send("Use a number as an argument.");
        return;
    }

    await message.channel.bulkDelete(+args[0] + 1); // one extra to delete the user's message
}
exports.conf = {
    enabled: true, // not used yet
    guildOnly: false, // not used yet
    aliases: [],
    permLevel: 2 // Permissions Required, higher is more power
};

exports.help = {
    name: "clear",
    description: "Clears a certain number of messages.",
    usage: "clear <number>"
};
