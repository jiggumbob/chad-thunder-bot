const Discord = require('discord.js');
const {prefix, discordToken} = require('./config.json');

const client = new Discord.Client();
client.commands = new Discord.Collection();

client.on('ready', () => {
  console.log('Ready!');
});

client.on("message", message => {
  if (message.author.bot) return;
  if(message.content.indexOf(prefix) !== 0) return;

  // This is the best way to define args. Trust me.
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  // The list of if/else is replaced with those simple 2 lines:
  try {
    let commandFile = require(`./commands/${command}.js`);
    commandFile.run(client, message, args);
  } catch (err) {
    console.error(err);
  }
});

client.login(discordToken);
