// uses DuckDuckGo Instant Answer API to give wikipedia answer
var DDG = require("node-ddg-api").DDG;
var ddg = new DDG("chad-thunder-bot");
const Discord = require("discord.js");

exports.run = async (client, message, args) => {
    // removes prefix and command, leaves argument
    var cutArgs = message.content.substr(message.content.indexOf(" ") + 1);
    ddg.instantAnswer(cutArgs, {skip_disambig: '0'}, async function(err, response) {
        let result = response.AbstractURL;
        
        if(result.length == 0) {
            // there was no result
            let embed = new Discord.RichEmbed();
            embed.setTitle("No Result Found");
            embed.setDescription("Uh oh! No result was found for that search!");
            embed.setThumbnail("https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/147/confused-face_1f615.png");
            embed.setColor(0xFF524C);
            message.channel.send(embed);
        } else {     
            // there is result, remove disambiguation URL from wikipedia response
            if (result.includes("_(disambiguation)")) {
                result = result.slice(0, result.indexOf("_(disambiguation)"));
            }
            await message.channel.send(result);
        }
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