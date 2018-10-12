/**
 * Defines the wikipedia command.
 *
 * Uses the DuckDuckGo Quick Answer API to get Wikipedia results from searches.
 * If no search is found, it informs the user.
 *
 * @author Jude Markabawi, Stanley Wang.
 * @license See the LICENSE file for details.
 */

var DDG = require("node-ddg-api").DDG;
var ddg = new DDG("chad-thunder-bot");
const embedTool = require("../util/embed-message-tool.js");

exports.run = async (client, message, args) => {
    // removes prefix and command, leaves argument
    var cutArgs = message.content.substr(message.content.indexOf(" ") + 1);
    ddg.instantAnswer(cutArgs, {skip_disambig: '0'}, async function(err, response) {
        let result = response.AbstractURL;
        
        if(result.length == 0) {
            // there was no result
            message.channel.send(
                embedTool.createMessage("No Result Found", 
                                        "Uh oh! No result was found for that search!", 
                                        "confused face", 
                                        true)
            );
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
    enabled: false,
    guildOnly: false,
    aliases: ["wiki", "w"],
    permLevel: 0
};

exports.help = {
    name: "wikipedia",
    description: "Returns a Wikipedia article about the topic, if it exists.",
    usage: "wikipedia <argument>"
};