/**
 * Defines the google command.
 *
 * Uses the Google API to search for something (safesearch if in NSFW channel).
 * If no result is found, it informs the user.
 *
 * @author Jude Markabawi, Stanley Wang.
 * @license See the LICENSE file for details.
 */

const {google} = require('googleapis');
const customsearch = google.customsearch('v1');
const embedTool = require("../util/embed-message-tool.js");

exports.run = async (client, message, args) => {
    var cutArgs = message.content.substr(message.content.indexOf(" ") + 1);

    var active;
    if (!message.channel.nsfw) {
        active = "active";
    } else {
        active = "off";
    }

    const res = await customsearch.cse.list({
        cx: process.env.GOOGLEID,
        q: cutArgs,
        auth: process.env.GOOGLEKEY,
        num: 1,
        safe: active
    });
    
    try {
        message.channel.send(JSON.parse(JSON.stringify(res.data.items['0'].link)));
    } catch(e) {
        // there was no result
        message.channel.send(
            embedTool.createMessage("No Result Found",
                                    "Uh oh! No result was found for that search!",
                                    "confused face",
                                    true)
        );
    }
}

exports.conf = {
    enabled: false,
    guildOnly: false,
    aliases: ["g"],
    permLevel: 0
};

exports.help = {
    name: "google",
    description: "Returns Google search results.",
    usage: "google <argument>"
};
