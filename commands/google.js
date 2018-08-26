const {google} = require('googleapis');
const customsearch = google.customsearch('v1');

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

    message.channel.send(JSON.parse(JSON.stringify(res.data.items['0'].link)));
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["g"],
    permLevel: 0
};

exports.help = {
    name: "google",
    description: "Returns Google search results.",
    usage: "google <argument>"
};
