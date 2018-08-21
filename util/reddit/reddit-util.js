const snoowrap = require("snoowrap");
const redditsaver = require("./reddit-saver.js");

const Reddit = new snoowrap({
    userAgent: "Discord: chad-thunder-bot",
    clientId: process.env.REDDIT_CLIENT_ID,
    clientSecret: process.env.REDDIT_CLIENT_SECRET,
    refreshToken: process.env.REDDIT_REFRESH_TOKEN
});

var redditSaver = new redditsaver.RedditSaver(Reddit, 100);

/* Handles functionality of the reddit r command.

   Context is the message that the user sent in the Discord chat, allowing for this file to be 
   able to send a message in the same folder.
*/
exports.processRandomCommand = async function processRandomCommand(subredditName, context) {
    try {
        if (! await redditSaver.isSaved(subredditName)) {
            context.channel.send("Saving more posts from that subreddit for faster access..");
            await redditSaver.save(subredditName);
        }
      
        let randomPost = await redditSaver.getRandomPost(subredditName);
        context.channel.send("Selected random post.");
        // print out the post content
        await printRedditPost(randomPost, context);
    } catch (e) {
        console.log(e);
    }
}

/* Handles functionality of the reddit u command. */
async function processUrlCommand(url) {
    let urlJSON = url + ".json";
    // find the id of the post, turn it into a submission, print it
}

/* Handles functionality of the reddit c command. */
async function processCommentCommand(url) {

}

/* Returns pieces of what the bot should say if it's a real post.*/
async function getPostContent(post) {
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

/* Actually prints the reddit post/URL with embedding. 

  Context is the message that the user sent in the Discord chat, allowing for this file to be 
  able to send a message in the same folder.

*/
// TODO: actually embed
async function printRedditPost(post, context) {
    // first check if post/ discord channels are NSFW/not\
    if(await post.over_18 && !context.channel.nsfw) {
        context.channel.send("This post is NSFW. Go to an NSFW channel.");
        return;
    }
  
    if (await post.selftext.length == 0) {
        // print URL
        context.channel.send({
                "embed": {
                    "title": await post.title,

                    "author": {
                        "name": "u/" + await post.author.name,
                        "url": await post.url
                    },

                    "footer": {
                        "text": "Score: " + await post.score
                    }, 
                  
                    "image": {
                        "url": await post.url
                    }
                }
            });
    } else {
        // print post
        for (let piece of await getPostContent(post)) {
            context.channel.send({
                "embed": {
                    "title": await post.title,

                    "author": {
                        "name": "u/" + await post.author.name,
                        "url": await post.url
                    },

                    "footer": {
                        "text": "Score: " + await post.score
                    },

                    "description": piece
                }
            });
        }
    }
}

