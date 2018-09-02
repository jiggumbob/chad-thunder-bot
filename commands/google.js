const {google} = require('googleapis');
const customsearch = google.customsearch('v1');
const Discord = require("discord.js");

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
        let embed = new Discord.RichEmbed();
        embed.setTitle("No Result Found");
        embed.setDescription("Uh oh! No result was found for that search!");
        embed.setThumbnail("https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/147/confused-face_1f615.png");
        embed.setColor(0xFF524C);
        message.channel.send(embed);
    }
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
