/**
 * Defines the ready event.
 *
 * Runs when the bot starts up and provides some information in the console.
 *
 * @author Jude Markabawi, Stanley Wang.
 * @license See the LICENSE file for details.
 */

module.exports = (client) => {
    console.log("Ready to serve in " + client.channels.size + " channels on " + client.guilds.size + " servers," + 
 " for a total of " + client.users.size + " users.");
    client.user.setActivity("Use " + process.env.PREFIX + "help");
}