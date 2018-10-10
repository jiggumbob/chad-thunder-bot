/**
 * Defines all methods related to music functionality in Chad
 * Thunder Bot.
 *
 * @author Jude Markabawi, Stanley Wang.
 * @license See the LICENSE file for details.
 */

const embedUtil = require("../embed-message-tool.js");
const ytdl = require("ytdl-core");
// const ytInfo = require("simple-youtube-api");
const ytInfo = require("youtube-info");
const ytID = require("get-youtube-id");

var servers = {};
var ytKey = process.env.GOOGLEKEY;

// const youtube = new ytInfo(ytKey);

/**
 * Returns whether the argument is a youtube link or not.
 *
 * @param  String  str  String to be checked.
 */
function isYoutube(str) {
    return str.toLowerCase().indexOf("youtube.com") > -1;
}

/**
 * Returns the the title of the video at the specified url.
 *
 * @param  String  url  Youtube URL to find the title of.
 */
async function getTitle(url) {
    return (await ytInfo(ytID(url))).title;
}

/**
 * Plays songs in the queue inside of a voice chat. Disconnects if there is no songs
 * left in the queue.
 *
 * @param  Connection  connection  The connection to youtube.
 * @param  Message  context  The discord command that initiated the bot response.
 */
function streamConnection(connection, context) {
    var server = servers[context.guild.id];
  
    server.dispatcher = connection.playStream(ytdl(server.queue[0], {filter: "audioonly"}));
    
    server.queue.shift();
    server.dispatcher.on("end", function() {
        if (server.queue[0]) {
            streamConnection(connection, context);
        }
        else {
            connection.disconnect();
        }
    });
}

/**
 * Handles user requests to play a song.
 *
 * Ensures the link is a Youtube link and the user is in a voice channel, then adds
 * the song to the queue.
 *
 * @param  Message  context  The Discord command that initiated the bot response.
 * @param  Array    args     Arguments the user provided in their command.
 */
exports.play = async function play(context, args) {
    const member = context.member;
    if (!args[0] || !isYoutube(args[0])) {
        let errorMessage = createErrorMessage("Please provide a proper YouTube link");
        context.channel.send(errorMessage);
        return;
    }
    if (!context.member.voiceChannel) {
        let errorMessage = createErrorMessage("You need to join a voice channel first.");
        context.channel.send(errorMessage);
        return;
    }
    
    if (!servers[context.guild.id]) {
        servers[context.guild.id] = {
            queue: []
        };
    }
  
    var server = servers[context.guild.id];
    server.queue.push(args[0]);
  
    if (!context.guild.voiceConnection) {
        context.member.voiceChannel.join().then(function(connection) {
            streamConnection(connection, context);
        });
    }
    let message = embedUtil.createMessage("Song Added", "Have fun listening!", "musical note", false);
    context.channel.send(message);
}

/**
 * Handles user requests to skip a song.
 *
 * @param  Message  context  The Discord command that initiated the bot response.
 */
exports.skip = async function skip(context) {
    var server = servers[context.guild.id];
  
    if (server.dispatcher) {
        server.dispatcher.end();
    }
    let message = embedUtil.createMessage("Song Skipped", undefined, "curved arrow", false);
    context.channel.send(message);
}

/**
 * Handles user requests to stop song playing.
 *
 * @param  Message  context  The Discord command that initiated the bot response.
 */
exports.stop = async function stop(context) {
    var server = servers[context.guild.id];
  
    if (context.guild.voiceConnection) {
        context.guild.voiceConnection.disconnect();
        let message = embedUtil.createMessage("Disconnected", "Thanks for listening!", "waving hand", false);
        context.channel.send(message);
    }
}

/**
 * Handles user requests to view the queue.
 *
 * @param  Message  context  The Discord command that initiated the bot response.
 */
exports.queue = async function queue(context) {
    var server = servers[context.guild.id];
    if (!server || server.queue.length == 0) {
        let errorMessage = createErrorMessage("There is nothing in the queue.");
        context.channel.send(errorMessage);
        return;
    }
    
    var titles = [];  
    // for (let url of server.queue) {
    //     titles.push(getTitle(url));
    // }
    for (var i = 0; i < server.queue.length; i++) { 
        titles[i] = await getTitle(server.queue[i]); 
    }
    console.log(titles.toString());
}

/**
 * Provides a unified function to create Music errors.
 *
 * @param  String  description  Description of the error.
 */
function createErrorMessage(description) {
    return embedUtil.createMessage("DJ Chad Error", description, "crossed out bell", true);
}