import discord
import asyncio
import json
import time
import aiohttp
import subprocess
import sys
import urllib.request
from discord.ext import commands
from discord.ext.commands import Bot
from googleapiclient.discovery import build

my_api_key = ""
my_cse_id = ""
aiosession = aiohttp.ClientSession()
startup_channel = None
client = discord.Client


def google_search(search_term, api_key, cse_id, **kwargs):
    service = build("customsearch", "v1", developerKey=api_key)
    res = service.cse().list(q=search_term, cx=cse_id, **kwargs).execute()
    return res['items']


def is_developer(ctx):
    developers = [""]
    return ctx.message.author.id in developers


class Utility():
    def __init__(self, bot):
        self.bot = bot

    @commands.command(pass_context=True, hidden=True)
    @commands.check(is_developer)
    async def restart(self, ctx, member: discord.Member = None):
        '''Stops running aiosession, then closes the bot and reopens
        it through the subprocess and sys modules'''

        await self.bot.say("Restarting...")
        print(ctx.message.author.name + " has restarted the bot.")
        await aiosession.close()
        await self.bot.logout()
        subprocess.call([sys.executable, ""])

    @commands.command(pass_context=True)
    async def ping(self, ctx):
        '''Measures the time it takes to connect to discordapp.com'''
        start = time.time()
        async with aiohttp.get("https://discordapp.com"):
            duration = time.time() - start
        duration = round(duration * 1000)
        await self.bot.say("Pong! `{0}ms`".format(duration))

    @commands.command(pass_context=True, aliases=["g"])
    async def google(self, ctx, *args, member: discord.Member = None):
        '''elgoog is google spelled backwards.

        Searches Google for the specified query and says the result in chat.

        Parameter(s):
          - Search query'''

        arg = ' '.join(args)
        results = google_search(arg, my_api_key, my_cse_id, num=1)
        json_string = json.dumps(results)
        values = json.loads(json_string)
        if member is None:
            member = ctx.message.author
        print("{0}  -  googled:  ".format(member) + arg)
        await self.bot.say(values[0]['link'])

    @commands.command(pass_context=True, aliases=["wiki"])
    async def wikipedia(self, ctx, *args, member: discord.Member = None):
        '''Wikipedia has an official theme song. Google it.

        Searches wikipedia for the specified query and says the result in chat

        Parameter(s):
          - Search query'''

        arg = '+'.join(args)
        spaced_arg = ' '.join(args)
        urljson = "http://api.duckduckgo.com/?q=" + arg + "&ia=web&format=json"
        with urllib.request.urlopen(urljson) as url:
            values = json.loads(url.read().decode())
        if member is None:
            member = ctx.message.author
        print("{0}  -   wiki'd:  ".format(member) + spaced_arg)
        if values['AbstractURL'] == "":
            await self.bot.say('There is no wikipedia article on: "{0}"'.format(spaced_arg))
        await self.bot.say(values['AbstractURL'])

    @commands.command(pass_context=True)
    async def get_invite(self, ctx):
        '''Invite link for the bot.'''
        await self.bot.say("https://discordapp.com/api/oauth2/authorize?client_id=437117960633712641&permissions=96256&scope=bot")

    @commands.command(pass_context=True, aliases=["purge"])
    async def clear(self, ctx, number_clears):
        '''Clears [num] amount of previous messages.

        Only server administrators have permission to do this.
        '''
        # check if administrator
        if ctx.message.author.server_permissions.administrator or ctx.message.author.id == "":
            num = int(number_clears)
            await self.bot.purge_from(ctx.message.channel, limit=num + 1)
        else:
            await self.bot.say(ctx.message.author.id)
            await self.bot.say("You must be an administrator to do this.")


def setup(bot):
    bot.add_cog(Utility(bot))
