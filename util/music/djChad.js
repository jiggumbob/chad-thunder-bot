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
const ytKey = process.env.GOOGLEKEY;
const YT = require("simple-youtube-api");
const Youtube = new YT(ytKey);

var servers = {};

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
    return (await Youtube.getVideo(url)).title;
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
    
    // nowPlaying is now the next song in the queue
    server.nowPlaying = server.queue.shift();
  
    server.dispatcher.on("end", function() {
        // if loop is enabled, push the current song back into queue again
        if (server.loop) {
            server.queue.unshift(server.nowPlaying);
        }
        // if there are more song in the queue
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
    // this server doesn't have a queue in memory --> create one
    if (!servers[context.guild.id]) {
        servers[context.guild.id] = {
            loop: false,
            queue: []
        };
    }
      
    var server = servers[context.guild.id];
  
    // nothing provided
    if (!args[0]) {
        // there is no song playing/there is but it's not paused
        if(!server.dispatcher || !server.dispatcher.paused) {
            let errorMessage = createErrorMessage("Please provide a YouTube link or search term.");
            context.channel.send(errorMessage);
            return;
        }
        // song has been paused so resume it
        server.dispatcher.resume();
        let songName = await getTitle(server.nowPlaying);
        let description = "**Resumed** [" + songName + "](" + server.nowPlaying +")\n\nHave fun listening!";
        let message = embedUtil.createMessage("Song Resumed", description, "play pause", false);
        context.channel.send(message); 
        return;
    }
  
    // user isn't in a voice channel
    if (!context.member.voiceChannel) {
        let errorMessage = createErrorMessage("You need to join a voice channel first.");
        context.channel.send(errorMessage);
        return;
    }
  
    let requestURL = args[0];
    // search for the video if argument isn't a URL
    if (!isYoutube(args[0])) {
        let temp = await search(args.join(" ")); // all the words in their search
        if (!temp) {
            let errorMessage = createErrorMessage("Nothing was found for that search.");
            context.channel.send(errorMessage);
            return;
        }
        requestURL = temp.url;
    }
    
    var isPlaylist;  
    var playlist;
  
    // ensure this is a valid URL (video or playlist) now
    try {
        playlist = await Youtube.getPlaylist(requestURL);
        isPlaylist = true;
    } catch (e) {}
    if (!isPlaylist) {
        try {
            await Youtube.getVideo(requestURL);
        } catch (e) {
            let errorMessage = createErrorMessage("Please provide a valid Youtube link or search term.");
            context.channel.send(errorMessage);
            return;
        }
    }
  
    var title;
    var durationString;
    
    if (isPlaylist) {
        let playlistVids = await playlist.getVideos();
        title = playlist.title;
        let durSecs = 0;
      
        for (let vid of playlistVids) {
            let vidCopy = await Youtube.getVideo(vid.url); // allows the duration to not be undefined
            server.queue.push(vid.url); // add song to queue
            durSecs += vidCopy.durationSeconds;
        }
        durationString = await getDurationFromSeconds(durSecs);
    } else {
        // push the single video to queue and set title and duration
        server.queue.push(requestURL);
        title = await getTitle(requestURL);
        durationString = await getDuration(requestURL);
    }
    
    let header = isPlaylist ? "Playlist Added" : "Song Added";
    let description = "**Added** [" + title + "](" + requestURL + ") to the queue.\n" +
                      "**Length** `" + durationString + "`\n\nHave fun listening!";
    let message = embedUtil.createMessage(header, description, "musical note", false);
    context.channel.send(message);
    
    // connect to the user's voice channel if we aren't already
    if (!context.guild.voiceConnection) {
        let connection = await context.member.voiceChannel.join();
        streamConnection(connection, context);
    }
}

/**
 * Handles user requests to pause a song.
 *
 * @param  Message  context  The Discord command that initiated the bot response.
 */
exports.pause = async function pause(context) {
    // user isn't in a voice channel
    if (!context.member.voiceChannel) {
        let errorMessage = createErrorMessage("You need to join a voice channel first.");
        context.channel.send(errorMessage);
        return;
    }
  
    var server = servers[context.guild.id];
  
    // audio isn't currently being played
  
    if (!server || !server.nowPlaying) {
        let errorMessage = createErrorMessage("Nothing is currently playing.");
        context.channel.send(errorMessage);
        return;
    }
    if (server.dispatcher.paused) {
        let errorMessage = createErrorMessage("Song is already paused.");
        context.channel.send(errorMessage);
        return;
    }
  
    let description = "**Paused** [" + await getTitle(server.nowPlaying) + "](" + server.nowPlaying +")";
    server.dispatcher.pause();
    let message = embedUtil.createMessage("Song Paused", description, "pause button", false);
    context.channel.send(message);
}

/**
 * Handles user requests to skip a song.
 *
 * @param  Message  context  The Discord command that initiated the bot response.
 */
exports.skip = async function skip(context) {
    var server = servers[context.guild.id];
    if (!server || !server.dispatcher) {
        let errorMessage = createErrorMessage("There is no song to skip!");
        context.channel.send(errorMessage);
        return;
    }
    server.dispatcher.end();
  
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
    server.nowPlaying = undefined;
    server.queue = [];
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
    
    let nowPlaying = "**Now Playing **[" + await getTitle(server.nowPlaying) + 
                     "](" + server.nowPlaying + ") | `" + await getDuration(server.nowPlaying) + "`\n";
    let queueSongs = "";
    const numToDisplay = 5; // only display first numToDisplay songs
    let length = (server.queue.length > numToDisplay) ? numToDisplay : server.queue.length;
    for (let i = 0; i < length; i++) { 
        let songTitle = await getTitle(server.queue[i]); 
        queueSongs += "**" + (i+1) + ".** [" + songTitle + "](" + server.queue[i] + 
        ") | `" + await getDuration(server.queue[i]) + "`\n";
    }
    let message = embedUtil.createMessage("Songs", nowPlaying, "musical note", false);
    if (queueSongs.length > 0) {
        // can't add empty fields, so do it only if there are queued songs
        message.addField("Queue", queueSongs);
    }
    context.channel.send(message);
}

exports.loop = async function loop(context) {
    var server = servers[context.guild.id];
    if (!server) {
        let errorMessage = createErrorMessage("There is nothing in the queue.");
        context.channel.send(errorMessage);
        return;
    }
    server.loop = !server.loop; // change loop setting off to on / on to off
  
    let title = server.loop ? "Loop Enabled" : "Loop Disabled";
    let emoji = server.loop ? "repeat arrow" : "right arrow";
    let description = "FYI, loop repeats the same song over and over if enabled."
    let message = embedUtil.createMessage(title, description, emoji, false);
    context.channel.send(message);
}

/**
 * Handles user requests to remove a song from the queue.
 *
 * @param  Message  context  The Discord command that initiated the bot response.
 * @param  Array    args     Arguments the user provided in their command.
 */
exports.removeFromQueue = async function removeFromQueue(context, args) {
    var server = servers[context.guild.id];
    if (!server || !server.nowPlaying) {
        let errorMessage = createErrorMessage("There is nothing in the queue to remove.");
        context.channel.send(errorMessage);
        return;
    }
    // check to see if a number was provided
    if (!args[1]) {
        let errorMessage = createErrorMessage("Please specify which position in the queue to remove.");
        context.channel.send(errorMessage);
        return;
    }
    
    let queuePosition = args[1] - 1; // use args[1] - 1 because the displayed list starts at 1 while the array start at 0
    // check to see if the number is within the queue bounds
    if (!server.queue[queuePosition]) {
        let errorMessage = createErrorMessage("That isnt a valid option in the queue.");
        context.channel.send(errorMessage);
        return;
    }
    
    let removedVideoURL = server.queue.splice(queuePosition, 1)[0]; // removes that song from the queue
  
    let description = "**Removed** `" + await getTitle(removedVideoURL) + "` from the queue.";
    let message = embedUtil.createMessage("Removed Video", description, "eject symbol", false);
    context.channel.send(message);
}

/**
 * Handles user requests to clear the queue.
 *
 * @param  Message  context  The Discord command that initiated the bot response.
 */
exports.clearQueue = async function clearQueue(context) {
    var server = servers[context.guild.id];
    if (!server || !server.nowPlaying) {
        let errorMessage = createErrorMessage("There is no queue!");
        context.channel.send(errorMessage);
        return;
    }
    server.queue = [];
    let description = "**Cleared** the queue successfully.";
    let message = embedUtil.createMessage("Cleared Queue", description, undefined, false);
    context.channel.send(message);
}
/**
 * Returns a URL for a Youtube video based on the search term.
 *
 * @param  String  query  Query for Youtube video search.
 *
 * @return  String  URL of the first video (if found).
 */
async function search (query) {
    let urls = await Youtube.searchVideos(query, 1);
    return urls[0];
}

/**
 * Provides a unified function to create Music errors.
 *
 * @param  String  description  Description of the error.
 *
 * @return  RichEmbed  Embedded error message.
 */
function createErrorMessage(description) {
    return embedUtil.createMessage("DJ Chad Error", description, "crossed out bell", true);
}

/**
 * Returns a String representation of the duration of a Youtube video with
 * the URL url.
 *
 * @param  String  url  URL of the youtube video.
 */
async function getDuration(url) {
    let video = await Youtube.getVideo(url);
    return await getDurationFromSeconds(video.durationSeconds);
}

/**
 * Returns a String representation of the duration of a Youtube video with
 * the duration specified in the object.
 *
 * @param  Integer  durationSeconds  Duration of the video in seconds.
 */
async function getDurationFromSeconds(durationSeconds) {
    let durationString = "";
    let hours = Math.floor(durationSeconds / 3600);
    let minutes = Math.floor(durationSeconds % 3600 / 60);
    let seconds = Math.floor(durationSeconds % 3600 % 60);
    
    // don't display hours unless there actually are any
    let hourString = hours > 10 ? hours + ":" : (hours > 0 ? "0" + hours + ":" : "");
    let minuteString = (minutes > 10 ? minutes : "0" + minutes) + ":";
    let secondString = seconds > 10 ? seconds : "0" + seconds;
    return (hourString + minuteString + secondString);
}