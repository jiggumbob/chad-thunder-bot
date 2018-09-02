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
const Enmap = require("enmap");
const fs = require("fs");

const client = new Discord.Client();
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

fs.readdir("./events/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    const event = require(`./events/${file}`);
    let eventName = file.split(".")[0];
    client.on(eventName, event.bind(null, client));
  });
});

fs.readdir("./commands/", (err, files) => {
  if(err) console.error(err);
  console.log(`Loading a total of ${files.length} commands.`);
  // Loops through each file in that folder
  files.forEach(f=> {
    if (fs.lstatSync("./commands/"+f).isDirectory()) {
      console.log("true");
    }
    // require the file itself in memory
    let props = require(`./commands/${f}`);
    console.log(`Loading Command: ${props.help.name}`);
    // add the command to the Commands Collection
    client.commands.set(props.help.name, props);
    // Loops through each Alias in that command
    props.conf.aliases.forEach(alias => {
      // add the alias to the Aliases Collection
      client.aliases.set(alias, props.help.name);
    });
  });
});

client.login(process.env.TOKEN);