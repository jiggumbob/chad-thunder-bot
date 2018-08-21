exports.run = async (client, message, args) => {
  const {google} = require('googleapis');
  const customsearch = google.customsearch('v1');

  var cutArgs = message.content.substr(message.content.indexOf(" ") + 1);
  
  var active;
  if (message.channel.nsfw === false) {
    active = "active";
  } else {
    active = "off";
  }
  
  const res =  await customsearch.cse.list({
    cx: process.env.GOOGLEID,
    q: cutArgs,
    auth: process.env.GOOGLEKEY,
    num: 1,
    safe: active
  });
  
  // console.log(res.data);
  // console.log((JSON.parse(JSON.stringify(res.data.items))));
  message.channel.send(JSON.parse(JSON.stringify(res.data.items['0'].link)));
  //message.channel.send();
  
  // runSample(options).catch(console.error);
  // console.log(Object.keys(runSample()));
}

exports.conf = {
  enabled: true, // not used yet
  guildOnly: false, // not used yet
  aliases: ["g"],
  permLevel: 0 // Permissions Required, higher is more power
};

exports.help = {
  name : "google",
  description: "Google search stuff",
  usage: "google <argument>"
};