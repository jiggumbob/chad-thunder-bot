// uses DuckDuckGo Instant Answer API to give wikipedia answer
var DDG = require('node-ddg-api').DDG;
var ddg = new DDG('chad-thunder-bot');

exports.run = async (client, message, args) => {
    // removes prefix and command, leaves argument
    var cutArgs = message.content.substr(message.content.indexOf(" ") + 1);

    await ddg.instantAnswer(cutArgs, {
        skip_disambig: '0'
    }, function(err, response) {
        // if no response is given
        if (err) {
            message.channel.send("``" + cutArgs + "`` is not a valid argument.");
        }

        // Removes disambiguation from the wikipedia url
        let result = response.AbstractURL;
        if (result.includes("_(disambiguation)")) {
            result = result.slice(0, result.indexOf("_(disambiguation)"));
        }
        message.channel.send(result);
    });
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["wiki", "w"],
    permLevel: 0
};

exports.help = {
    name: "wikipedia",
    description: "Returns a Wikipedia article about the topic, if it exists.",
    usage: "wikipedia <argument>"
};
