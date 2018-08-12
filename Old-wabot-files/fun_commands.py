import discord
import asyncio
import json
import random
import sys
import praw
import os
import textwrap
import time
import string
import re
import urllib.request
import urllib.parse
from discord.ext import commands
from discord.ext.commands import Bot
from PIL import Image, ImageDraw, ImageFont
from nltk.corpus import words
from random import sample
from difflib import SequenceMatcher

sys.path.insert(0, '')

import text_to_emoji
import subreddit_saver
import max_length_split

reddit_instance = praw.Reddit(client_id="",
                              client_secret="",
                              user_agent="")


def is_developer(ctx):
    developers = [""]
    return ctx.message.author.id in developers


class Fun():
    # define a SubRedditSaver to save posts for quicker use next time
    reddit_cache = subreddit_saver.SubRedditSaver(200)

    def __init__(self, bot):
        self.bot = bot

    @commands.command(pass_context=True)
    async def emojify(self, ctx, *userInput):
        '''The emoji movie is the best movie of 2017.

        Takes whatever the user inputted and the bot says it in emojis

         If the user's input is too long, the emoji string cannot be printed
         due to Discord length constraints

          Parameter(s):
          - User's input'''

        userString = ' '.join(userInput)
        emojifiedString = text_to_emoji.wordsToEmoji(userString)
        try:
            await self.bot.purge_from(ctx.message.channel, limit=1)
            await self.bot.say(emojifiedString)
        except Exception:
            if(len(userString) == 0):
                await self.bot.say(text_to_emoji.wordsToEmoji("Type something bhithead"))
            else:
                await self.bot.say(text_to_emoji.wordsToEmoji("Too long bro"))

    @commands.command(pass_context=True)
    async def reddit(self, ctx, arg):
        '''Prints something from the top NUM_POSTS of r/"arg", or the post at the URL arg.

        If arg is a URL, it prints out that post. Otherwise, fetch a random post
        from the specified subreddit. If the post is > 2000 characters, runs max_length_split to print separated messages.

        In order to speed up the time for retrieving posts, this method utilizes the
        SubRedditSaver() class. reddit_cache is defined in the Fun class and when
        posts are called to be recieved from a subreddit, the top NUM_POSTS 's will also be loaded
        and saved into reddit_cache. Subsequent calls to the same subreddit's posts
        will return random posts from the saved posts of that subreddit, without fetching them from reddit again.

        Parameter:
            1) arg - subreddit name
        '''

        arg = arg.lower()

        try:
            # get a post
            desired_post = Fun.reddit_cache.post_request(arg)

            # get post content of whatever post we chose
            desired_post_content = subreddit_saver.get_post_content(
                desired_post)

            # determine whether post is suitable for the current chat channel
            if desired_post.over_18 and not "nsfw" in ctx.message.channel.name:
                await self.bot.say("That post is NSFW. Switch to an nsfw chat and try again.")
                return

            # say the post title, then contents (using multiple says if necessary)
            await self.bot.say("**" + desired_post.title + "**")
            for stringPart in desired_post_content:
                await self.bot.say(stringPart)

        except Exception as e:
            await self.bot.say("That subreddit was not found.")

    @commands.command(pass_context=True)
    async def refresh(self, ctx, arg):
        '''Refreshes NUM_POSTS posts in the specified subreddit arg'''
        try:
            await self.bot.say("**Will proceed to refresh the " +
                               "`" + arg + "`"
                               + " subreddit.** \n")
            hot_posts = Fun.reddit_cache.fetch_hot_posts(arg)
            Fun.reddit_cache.add_posts(arg, hot_posts)
            await self.bot.say("**Refreshed.** \n")

        except:
            await self.bot.say("**Specified subreddit not found.** \n")

    @commands.command(pass_context=True)
    async def comments(self, ctx, number=5):
        ''' Prints out [number] comments of the last reddit post

        Default value of [number] is 5.
        '''
        # otherwise print the comments
        for comment_string in Fun.reddit_cache.get_comments(number):
            await self.bot.say(comment_string)
        await self.bot.say("All requested/available comments printed.")

def setup(bot):
    bot.add_cog(Fun(bot))
