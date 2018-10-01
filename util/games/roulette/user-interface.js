/**
 * Defines methods and utilities used to allow interact with 
 * an active Roulette Game.
 *
 * @author Jude Markabawi, Stanley Wang.
 * @license See the LICENSE file for details.
 */

const gameMeister = require("../game-meister.js").gameMeister;
const RouletteGame = require("./roulette-game.js").RouletteGame;
const sql_connection = require("../../sql-connection.js").sql_connection;
const betGroups = require("./bet-groups.js").groupCollections;

/**
 * Handles user requests to start a Roulette game.
 *
 * Creates a RouletteGame instance and sends it to the GameMeister for
 * confirmation to start. If failed, informs the user.
 *
 * @param  Message  context  The Discord command that initiated the game start.
 */
exports.startGame = async function startGame(context) {
    let newGame = new RouletteGame(context);
    if (!(await gameMeister.requestGame(newGame))) {
        context.channel.send("there is already a game here");
    }
}

/**
 * Handles user requests to bet in a Roulette game.
 *
 * After ensuring there is an active roulette game checks if: 
 *     (1) the user has sufficient funds to make the bet, and
 *     (2) the betting group is a real betting group,
 * then removes the funds from the user and adds it as bet.
 *
 * @param  Message  context  The Discord command that initiated the game start.
 * @param  Array    args     Array of arguments the user made in the bot commmand.
 */
exports.addBet = async function addBet(context, args) {
    // make sure there is a roulette game running in the current channel
    if (!gameMeister.hasGame(context.channel.id) ||
        !(gameMeister.games[context.channel.id] instanceof RouletteGame)) {
        context.channel.send("there is no roulette game here");
        return;
    }
    
    // make sure the user's betting group actually exists
    let names = betGroups.filter(group => group.name);
    let aGroup = args[1].toLowerCase() in names;
    let aNumber = (Number(args[1]) >= 0) && (Number(args[1]) <= 36);
    if (!aGroup && !aNumber) {
        context.channel.send("that betting category doesn't exist");
    }
  
    // make sure they have enough money and add their bet
}
