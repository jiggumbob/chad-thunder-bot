const snoowrap = require("snoowrap");

exports.RedditSaver = class RedditSaver {
    /* Creates a RedditSaver (should only need one) which stores
    lists of posts associated with a subreddit.

    @param: Instance of reddit API, and number of posts to be saved from a
    subreddit.
    */
    constructor(redditInstance, numPosts) {
        this.Reddit = redditInstance;
        this.subreddits = {}; // subreddit name to list of submission id's
        this.numPosts = numPosts;
    }

    /* Saves [this.numPosts] hot posts from specified subreddit.*/
    async save(subredditName) {
        try {
            let postListing = await this.Reddit.getSubreddit(subredditName).getHot({
                "limit": this.numPosts - 1
            });
            let idList = postListing.map(post => post.id); // make list of id's
            this.subreddits[subredditName] = idList;
        } catch (e) {
            throw e;
        }
    }

    /* Checks if the specified subreddit already has saved posts. */
    async isSaved(subredditName) {
        return subredditName in this.subreddits;
    }

    /* Gets a random saved post from the specified subreddit.*/
    async getRandomPost(subredditName) {
        try {
            let rand = Math.floor(Math.random() * this.numPosts);
            let postID = this.subreddits[subredditName][rand];
            return await this.Reddit.getSubmission(postID);
        } catch (e) {
            throw e;
        }
    }
}