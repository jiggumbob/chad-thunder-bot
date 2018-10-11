/**
 * Defines all methods related to music functionality in Chad
 * Thunder Bot.
 *
 * servers holds objects for every Discord server with the bot and each server
 * contains a queue of songs.
 *
 * @author Jude Markabawi, Stanley Wang.
 * @license See the LICENSE file for details.
 */

const embedUtil = require("../embed-message-tool.js");
const ytdl = require("ytdl-core");
const ytInfo = require("youtube-info");
const ytID = require("get-youtube-id");

var servers = {};
var ytKey = process.env.GOOGLEKEY;

/**
 * Returns whether the argument is a youtube link or not.
 *
 * @param  String  str  String to be checked.
 */
function isYoutube(str) {
    return str.includes("youtube.com") || str.includes("youtu.be");
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
    
    server.nowPlaying = server.queue.shift();
  
    server.dispatcher.on("end", function() {
        if (server.queue[0]) {
            streamConnection(connection, context);
        }
        else {
            server.nowPlaying = undefined;
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
    
    // this server doesn't have a queue in memory --> create one
    if (!servers[context.guild.id]) {
        servers[context.guild.id] = {
            queue: []
        };
    }
  
    var server = servers[context.guild.id];
    server.queue.push(args[0]);
  
    // connect to the user's voice channel if we aren't already
    if (!context.guild.voiceConnection) {
        let connection = await context.member.voiceChannel.join();
        streamConnection(connection, context);
    }
    let description = "Added `" + await getTitle(args[0]) + "` to the queue.\n\nHave fun listening!";
    let message = embedUtil.createMessage("Song Added", description, "musical note", false);
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
 * Handles user requests to stop song playing and leave the channel.
 *
 * @param  Message  context  The Discord command that initiated the bot response.
 */
exports.leave = async function stop(context) {
    var server = servers[context.guild.id];
    if (!context.guild.voiceConnection) {
        let errorMessage = createErrorMessage("I'm not even playing songs!");
        context.channel.send(errorMessage);
        return;
    }
    
    context.guild.voiceConnection.disconnect();
    let message = embedUtil.createMessage("Disconnected", "Thanks for listening!", "waving hand", false);
    context.channel.send(message);
}

/**
 * Handles user requests to view the queue.
 *
 * @param  Message  context  The Discord command that initiated the bot response.
 */
exports.queue = async function queue(context) {
    var server = servers[context.guild.id];
    if (!server || !server.nowPlaying) {
        let errorMessage = createErrorMessage("There is nothing in the queue.");
        context.channel.send(errorMessage);
        return;
    }
    
    let nowPlaying = "**Now Playing: **`" + await getTitle(server.nowPlaying) + "`\n";
    let queueSongs = "";
    const numToDisplay = 15; // only display first numToDisplay songs
    let length = (server.queue.length > numToDisplay) ? numToDisplay : server.queue.length;
    for (let i = 0; i < length; i++) { 
        let songTitle = await getTitle(server.queue[i]); 
        queueSongs += "**" + (i+1) + ".** `" + songTitle + "`\n";
    }
    let message = embedUtil.createMessage("Songs", nowPlaying, "musical note", false);
    if (queueSongs.length > 0) {
      message.addField("Queue", queueSongs);
    }
    context.channel.send(message);
}

/**
 * Provides a unified function to create Music errors.
 *
 * @param  String  description  Description of the error.
 */
function createErrorMessage(description) {
    return embedUtil.createMessage("DJ Chad Error", description, "crossed out bell", true);
}