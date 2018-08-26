exports.run = async (client, message, args) => {
    var DDG = require('node-ddg-api').DDG;

    var ddg = new DDG('chad-thunder-bot');

    // Removes the prefix and command, leaving only the argument
    var cutArgs = message.content.substr(message.content.indexOf(" ") + 1);

    await ddg.instantAnswer(cutArgs, {
        skip_disambig: '0'
    }, function(err, response) {
        if (err) { //If no response is given
            message.channel.send("``" + cutArgs + "`` is not a valid argument.");
        }

        // Removes disambiguation from the url
        let result = response.AbstractURL;
        if (result.includes("_(disambiguation)")) {
            result = result.slice(0, result.indexOf("_(disambiguation)"));
        }
        message.channel.send(result);
    });
}

exports.conf = {
    enabled: true, // not used yet
    guildOnly: false, // not used yet
    aliases: ["wiki", "w"],
    permLevel: 0 // Permissions Required, higher is more power
};

exports.help = {
    name: "wikipedia",
    description: "Returns a Wikipedia article about the topic, if it exists.",
    usage: "wikipedia <argument>"
};