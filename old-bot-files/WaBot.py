import discord
import asyncio
import pprint
import json
import random
import time
import aiohttp
import subprocess
import sys
import praw
import os.path
import urllib.request
from discord.ext import commands
from discord.ext.commands import Bot
from googleapiclient.discovery import build

sys.path.insert(0, '')

import text_to_emoji
import subreddit_saver
import max_length_split

bot = commands.Bot(command_prefix='wa!', help_attrs={'hidden': True})
startup_extensions = ["fun_commands", "utility_commands"]


def is_developer(ctx):
    async def predicate(ctx):
        developers = []
        return ctx.author.id in developers
    return commands.check(predicate)


@bot.event
async def on_ready():
    print("I am running on " + bot.user.name)
    print("With an ID of: " + bot.user.id)
    await bot.send_message(bot.get_channel(""), "Successfully Restarted.")
    await bot.change_presence(game=discord.Game(name="Prefix: wa! | Use wa!help"))


@bot.command(hidden=True)
@commands.check(is_developer)
async def load(ctx, extension_name: str):
    """Loads an extension."""
    try:
        bot.load_extension(extension_name)
    except (AttributeError, ImportError) as e:
        await bot.say("```py\n{}: {}\n```".format(type(e).__name__, str(e)))
        return
    await bot.say("{} loaded.".format(extension_name))


@bot.command(hidden=True)
@commands.check(is_developer)
async def unload(ctx, extension_name: str):
    """Unloads an extension."""
    bot.unload_extension(extension_name)
    await bot.say("{} unloaded.".format(extension_name))

@bot.event
async def on_command_error(ctx, error):
    # if isinstance(error, commands.CommandNotFound):
    #     return
    if isinstance(error, commands.CheckFailure):
        await bot.say("You must be a developer to do this.")
        return

for extension in startup_extensions:
    try:
        bot.load_extension(extension)
    except Exception as e:
        exc = '{}: {}'.format(type(e).__name__, e)
        print('Failed to load extension {}\n{}'.format(extension, exc))

bot.run("")
