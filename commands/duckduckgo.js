exports.run = async (client, message, args) => {
  var DDG = require('node-ddg-api').DDG;

  var ddg = new DDG('my-app-name');
  var cutArgs = message.content.substr(message.content.indexOf(" ") + 1);
  
  await ddg.instantAnswer(cutArgs, {skip_disambig: '0'}, function(err, response) {
    console.log(response);
  });
}

exports.conf = {
  enabled: true, // not used yet
  guildOnly: false, // not used yet
  aliases: ["s"],
  permLevel: 0 // Permissions Required, higher is more power
};

exports.help = {
  name : "search",
  description: "Use DuckDuckGo to search for stuff.",
  usage: "search <argument>"
};

