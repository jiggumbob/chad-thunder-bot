exports.run = async (client, message, args) => {
  const snoowrap = require("snoowrap");
  
  const Reddit = new snoowrap({
      userAgent: "Discord: chad-thunder-bot",
      clientId: process.env.REDDIT_CLIENT_ID,
      clientSecret: process.env.REDDIT_CLIENT_SECRET,
      refreshToken: process.env.REDDIT_REFRESH_TOKEN
    });
  
  let testPosts = await Reddit.getSubreddit("nosleep").getHot();
  let testPost = testPosts[3];
  
  // var keys = Object.keys(testPost);
  // for(let key of keys) {
  //   message.channel.send(key);
  // }
  
  message.channel.send(testPost.selftext.slice(0, 1900));
}

