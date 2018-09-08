const embedTool = require("../embed-message-tool.js");
const snoowrap = require("snoowrap");
const redditsaver = require("./reddit-saver.js");
const Reddit = new snoowrap({
    userAgent: "Discord: chad-thunder-bot",
    clientId: process.env.REDDIT_CLIENT_ID,
    clientSecret: process.env.REDDIT_CLIENT_SECRET,
    refreshToken: process.env.REDDIT_REFRESH_TOKEN
});

/* Get JQuery stuff ready*/
var jsdom = require("jsdom");
const {
    JSDOM
} = jsdom;
const {
    window
} = new JSDOM();
const {
    document
} = (new JSDOM('')).window;
global.document = document;
var $ = jQuery = require('jquery')(window);

/* Create a reddit saver that saves 100 post id's per subreddit and
clear all subreddits after 30 minutes*/
var redditSaver = new redditsaver.RedditSaver(Reddit, 100);
var clearPosts = setInterval(function() {
    redditSaver.subreddits = {};
}, 1.8e+6);

/* Handles functionality of the reddit r command.
    @param:
    1. Subreddit name
    2. User's discord message (command to the bot)
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

/* Handles functionality of the reddit u command.
    @param:
    1. Reddit post url
    2. User's discord message (command to the bot)
*/
exports.processUrlCommand = async function processUrlCommand(url, context) {
    try {
        var botRetrieveMessage = await context.channel.send("Retrieving that post...");
        var post;

        let urlJSON = url + ".json";
        await $.getJSON(urlJSON, async function(data) {
            // get post ID from the reddit link JSON and get the post object at that ID

            let id = data[0].data.children[0].data.id;
            post = await Reddit.getSubmission(id);
        });

        botRetrieveMessage.delete();
        printRedditPost(post, context);
    } catch (e) {
        botRetrieveMessage.delete();
        context.channel.send(await getEmbedError("Invalid post link. Maybe try providing a valid one?"));
    }
}

/* Returns pieces of what the bot should say if it's a real post.
    @param:
    1. Reddit submission object
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

/* Returns a Reddit post in embed.
    @param:
    1. Reddit submission object
    2. User's discord message (command to the bot)
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

/* Create an embed error message for a certain text*/
async function getEmbedError(errorMessage) {
    return embedTool.createMessage("Reddit Error",
                                    errorMessage,
                                    "loud crying",
                                    true);
}
/* Prints out the reddit post, requester, etc. 
    @param:
    1. Reddit submission object
    2. User's discord message (command to the bot)
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
