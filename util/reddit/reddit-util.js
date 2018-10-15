/**
 * Provides utility functions to access Reddit posts through the bot.
 *
 * Almost all of the work regarding reddit functionality is handled through this file. The
 * functions for handling the reddit subcommands use other utility functions in this file, as well
 * as other libraries where needed to handle Reddit commands.
 *
 * @author Jude Markabawi, Stanley Wang.
 * @license See the LICENSE file for details.
 */

const embedTool = require("../embed-message-tool.js");
const snoowrap = require("snoowrap");
const redditsaver = require("./reddit-saver.js");
const Reddit = new snoowrap({
    userAgent: "Discord: chad-thunder-bot",
    clientId: process.env.REDDIT_CLIENT_ID,
    clientSecret: process.env.REDDIT_CLIENT_SECRET,
    refreshToken: process.env.REDDIT_REFRESH_TOKEN
});

/* Create a reddit saver that saves 100 post id's per subreddit and
clear all subreddits after 30 minutes*/
var redditSaver = new redditsaver.RedditSaver(Reddit, 100);
var clearPosts = setInterval(function() {
    redditSaver.subreddits = {};
}, 1.8e+6);

/** Handles functionality of the reddit r command.
 *
 * Begins by checking if posts from the requested subreddit are already saved in the
 * reddit saver. If they aren't, then it will request the saver to save posts from that
 * subreddit (if it exists). Next it gets a random saved post from the saver
 * and prints it out to the user.
 *
 * @param  String   subredditName  Name of subreddit requested
 * @param  Message  context        User's command
 */
exports.processRandomCommand = async function processRandomCommand(subredditName, context) {
    try {
        if (!await redditSaver.isSaved(subredditName)) {
            await redditSaver.save(subredditName);
        }

        let randomPost = await redditSaver.getRandomPost(subredditName);
        printRedditPost(randomPost, context);
    } catch (e) {
        context.channel.send(await getEmbedError("That subreddit doesn't exist. Maybe try one that does?"));
    }
}

/**
 * Handles functionality of the reddit u command.
 *
 * Sends a temporary message to the user letting them know it is currently
 * retrieving the message. Then it retrieves the json body of the reddit 
 * url page, and finds the id of the post (buried kinda deep in the JSON).
 * Finally, uses Reddit API to get the actual post object at this id and
 * prints it out the to user, deleting the temporary message.
 *
 * @param  String   url      URL of a reddit post
 * @param  Message  context  User's command
 *
 */
exports.processUrlCommand = async function processUrlCommand(url, context) {
    try {
        var botRetrieveMessage = await context.channel.send("Retrieving that post...");
        var post;
      
        let idSearch = new RegExp("/[a-zA-Z0-9]{6}/"); // match the id in the URL
        let id = url.match(idSearch)[0].replace("/", "");
        post = await Reddit.getSubmission(id);

        botRetrieveMessage.delete();
        printRedditPost(post, context);
    } catch (e) {
        botRetrieveMessage.delete();
        context.channel.send(await getEmbedError("Invalid post link. Maybe try providing a valid one?"));
    }
}

/** 
 * Returns pieces of what the bot should say if it's a real post.
 *
 * Splits the text of the reddit post into pieces of SPLIT_AMOUNT or less size
 * for Discord to able to send them in a message.
 *
 * @param  Submission  post  A Reddit post object
 *
 * @return  Array  Array of strings of shortened pieces of the post's text
*/
async function getLongPostContent(post) {
    let content = [];
    let text = await post.selftext;
    // split the string into 2000 character strings (to fit in a discord message)
    const SPLIT_AMOUNT = 2000;
    for (var index = 0; index < await text.length - SPLIT_AMOUNT; index += SPLIT_AMOUNT) {
        content.push(text.substr(index, SPLIT_AMOUNT));
    }
    // last piece is < 2000 long and goes to the end of the string.
    content.push(text.slice(index, await text.length));
    return content;
}

/**
 * Creates and eturns a RichEmbed of a reddit post
 *
 * Takes a Reddit post object and turns it into an embed message, with a link, author,
 * title, score, etc. as well as the user who requested the post in the first place, and returns it.
 * 
 * @param  Submission  post     A reddit post object
 * @param  Message     context  User's command
 *
 * @return  RichEmbed  An embed object representing the Reddit post
*/
async function getEmbedMessage(post, context) {
    let embed = embedTool.createMessage(await post.title.slice(0, 256),
                                    undefined,
                                    undefined,
                                    false);
    // use the permalink to make sure that even for image posts you get the reddit link, not the image  link
    embed.setAuthor("u/" + await post.author.name, undefined, "https://www.reddit.com" + await post.permalink);
    embed.setFooter(await post.subreddit_name_prefixed + " → Score: " + 
                    await post.score + " → Requested by " + context.channel.guild.member(context.author).nickname);
    return embed;
}

/** 
 * Creates an embed error message for a certain error.
 * 
 * Ensures consistency among the design of various reddit errors by creating
 * a similar error message with only a slight difference in message content.
 *
 * @param  String  errorMessage  Text to be included as the error body text of the embed error message
 *
 * @return  RichEmbed  An embed object detailing the error that occurred
 */
async function getEmbedError(errorMessage) {
    return embedTool.createMessage("Reddit Error",errorMessage,"loud crying", true);
}

/**
 * Prints out the reddit post as an embed message.
 *
 * First checks if the post is NSFW in a non-NSFW channel, and prevents it from being
 * sent, printing out an error in the chat. Then it deletes the user's command, fetches
 * an embed message representing the reddit post, and prints it out. Long reddit posts require
 * multiple messages to be printed out.
 *
 * @param  Submission  post     A Reddit post object
 * @param  Message     context  User's command
*/
async function printRedditPost(post, context) {
    // first check if post/ discord channels are NSFW/not\
    if (await post.over_18 && !context.channel.nsfw) {
        context.channel.send(await getEmbedError("That is an NSFW post. Maybe go to an NSFW chat?"));
        return;
    }

    context.delete();

    let embed = await getEmbedMessage(post, context);

    if (await post.selftext.length == 0) {
        // print URL
        context.channel.send(embed);
        context.channel.send(await post.url);
    } else {
        // print text post
        for (let piece of await getLongPostContent(post)) {
            embed.setDescription(piece);
            context.channel.send(embed);
        }
    }
}
