/**
 * Defines the RedditSaver class.
 *
 * The RedditSaver class stores lists of Reddit post id's to be used for quick retrieval
 * of random Reddit posts, rather than waiting long periods of time to continuously contact
 * the Reddit API to get a new post every time a command is issued.
 *
 * @author Jude Markabawi, Stanley Wang.
 * @license See the LICENSE file for details.
 */

const snoowrap = require("snoowrap");

exports.RedditSaver = class RedditSaver {
    /**
     * Creates a RedditSaver (should only need one) which stores
     * lists of posts associated with a subreddit.
     *
     * @param  reddit API object  redditInstance  The object containing a reddit instance.
     * @param  integer            numPosts        How many posts are by default saved for every subreddit.
    */
    constructor(redditInstance, numPosts) {
        this.Reddit = redditInstance;
        this.subreddits = {}; // subreddit name to list of submission id's
        this.numPosts = numPosts;
    }

    /** 
     * Saves hot posts from specified subreddit.
     * 
     * Number of posts saved it determined by this.numPost.
     * Sends a request to Reddit to get these posts.
     *
     * @param  String  subredditName  Name of the subreddit to save posts from.
     */
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
  
    /** 
     * Checks if the specified subreddit already has saved posts in the list.
     *
     * @param  String  subredditName  Name of the subreddit to check.
     */
    async isSaved(subredditName) {
        return subredditName in this.subreddits;
    }

    /**
     * Gets a random saved post from the specified subreddit.*
     *
     * @param  String  subredditName  Name of subreddit to get a random saved post from.
     */
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
