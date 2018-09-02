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

function getFiles (dir, files_){
    files_ = files_ || [];
    var files = fs.readdirSync(dir);
    for (var i in files){
        var name = dir + '/' + files[i];
        if (fs.statSync(name).isDirectory()){
            getFiles(name, files_);
        } else {
            files_.push(name);
        }
    }
    return files_;
}

let commandsArr = getFiles("./commands");
console.log(`Loading a total of ${commandsArr.length} commands.`);
for (var i = 0; i< commandsArr.length; i++) {
    // require the file itself in memory
    let props = require(commandsArr[i]);
    console.log(`Loading Command: ${props.help.name}`);
    // add the command to the Commands Collection
    client.commands.set(props.help.name, props);
    // Loops through each Alias in that command
    props.conf.aliases.forEach(alias => {
      // add the alias to the Aliases Collection
      client.aliases.set(alias, props.help.name);
    });
}

client.login(process.env.TOKEN);