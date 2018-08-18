const http = require("http");
const express = require("express");
const app = express();
app.get("/", (request, response) => {
  console.log(Date.now() + " Ping Received");
  response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);

const Discord = require("discord.js");

const client = new Discord.Client();
client.commands = new Discord.Collection();

client.on('ready', () => {
  console.log('Ready!');
});

client.on("message", message => {
  if (message.author.bot) return;
  if(message.content.indexOf(process.env.PREFIX) !== 0) return;

  // This is the best way to define args. Trust me.
  const args = message.content.slice(process.env.PREFIX.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  // The list of if/else is replaced with those simple 2 lines:
  try {
    let commandFile = require(`./commands/${command}.js`);
    commandFile.run(client, message, args);
  } catch (err) {
    console.error(err);
  }
});

client.login(process.env.TOKEN);
