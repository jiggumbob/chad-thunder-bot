import random
import max_length_split
import urllib.parse
import praw


class SubRedditSaver:
    '''
    Saves posts from specified subreddits, allowing for simple addition
    to the dictionary and retrieval

    Attributes:
        1) postDictionary: Dictionary mapping subreddit names to lists of Submissions
    '''

    def __init__(self, NUM_POSTS=200):
        # Key: Subreddit name (all lowercase)
        # Value: Lists of posts
        self.postDictionary = {}

        # reddit
        self.reddit_instance = praw.Reddit(client_id="",
                                           client_secret="",
                                           user_agent="")
        # cache to hold the most recent comment for the fetching the comments of it
        self.recent_post_cache = None

        # define the number of reddit posts to be saved every time
        self.NUM_POSTS = NUM_POSTS

    def post_request(self, request):
        '''Processes a user's request. Returns a post at the specified url if the request is a url,
        or a random post from the subreddit if the requestis a subreddit.'''

        request = request.lower()
        desired_post = None

        if "https://" in request:  # if request is a URL
            desired_post = praw.models.Submission(
                self.reddit_instance, None, request)  # get post at that URL
        else:  # if request is a subreddit
            # load and save next NUM_POSTS posts if it's not a saved subreddit
            if not self.is_saved(request):
                hot_posts = self.fetch_hot_posts(request)
                self.add_posts(request, hot_posts)

            # get random post from specific subreddit (request)
            desired_post = self.get_random_post(request)

        # put post in the cache
        self.recent_post_cache = desired_post

        return desired_post

    def fetch_hot_posts(self, subreddit_name):
        '''Fetches the NUM_POSTS hot posts in the specified subreddit and
        returns them as a list.'''
        posts = self.reddit_instance.subreddit(subreddit_name)
        return [post for post in posts.hot(limit=self.NUM_POSTS)]

    def get_comments(self, num_comments):
        if self.recent_post_cache is None:
            yield "No post available."

        comments = self.recent_post_cache.comments
        num_comments_said = 0
        for top_comment in comments:
            # only say as many comments as the user wants us to, and not too many
            if num_comments_said >= num_comments or num_comments_said > 10:
                break

            # yield user's comment -> author name in bold, newline, comment text, newline, seperator dashes
            yield "**" + str(top_comment.author) + "** said:" + "\n" + top_comment.body + "\n" + "-" * 40

            num_comments_said += 1

    def add_posts(self, subreddit_name, posts):
        '''Adds a list of posts to the dictionary

        Removes/replaces posts already there, puts the new ones instead.
        DOES NOT add on to posts already there.

        Parameters:
            1) Subreddit's name
            2) List of Posts (Submission object)
        '''

        self.postDictionary[subreddit_name.lower()] = posts

    def get_random_post(self, subreddit_name):
        ''' Chooses a random post from a subreddit's post list and returns it

        Parameters:
        1) Subreddit's name

        Return:
            Submission object
        '''
        # get a random post in the specified subreddit
        posts_of_subreddit = self.postDictionary[subreddit_name]
        rand_post = random.choice(posts_of_subreddit)

        return rand_post

    def is_saved(self, subreddit_name):
        '''Checks if a subreddit already has posts saved within it

        Parameters:
            1) Subreddit's name

        Return:
            1) Boolean (whether or not the subreddit name is a key)
        '''
        if subreddit_name.lower() in self.postDictionary:
            return True
        else:
            return False


def get_post_content(submission):
    ''' Takes a Reddit post, and returns its contents

    Parameters:
    1) Reddit Submission

    Return:
        Content of a the post
            * Will return text of the post. If the post doesn't have text,
              it returns its URL instead.
    '''
    submission_content = None

    if len(submission.selftext) != 0:
        submission_content = max_length_split.max_length_split(
            submission.selftext, 2000)  # this is actual text
        # runs this statement if the post is not text
        # urllib.parse.unquote()
    else:
        submission_content = max_length_split.max_length_split(
            urllib.parse.unquote(submission.url), 2000)  # this is a URL

    return submission_content
