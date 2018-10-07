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
        context.channel.send("There is already a different game in this channel.");
    }
}

/**
 * Handles user requests to bet in a Roulette game.
 *
 * After ensuring there is an active roulette game checks if:
 *     (1) the roulette game is in the betting stage, and
 *     (2) the betting group is a real betting group, and
 *     (3) the user has sufficient funds to make the bet
 * then removes the funds from the user and adds it as bet.
 *
 * @param  Message  context  The Discord command that initiated the game start.
 * @param  Array    args     Array of arguments the user made in the bot commmand.
 */
exports.addBet = async function addBet(context, args) {
    // make sure there is a roulette game running in the current channel
    if (!gameMeister.hasGame(context.channel.id) ||
        !(gameMeister.games[context.channel.id] instanceof RouletteGame)) {
        context.channel.send("Please start a Roulette game before placing a bet.");
        return;
    }
    
    let rouletteGame = gameMeister.games[context.channel.id];
  
    // make sure it's betting time
    if (!rouletteGame.canBet) {
        context.channel.send("Now is not the time for betting.");
        return;
    }
  
    // make sure the user's betting group actually exists
    let names = betGroups.filter(group => group.name);
    let isRealBetGroup = args[1].toLowerCase() in names;
    let isRealBetNumber = (Number(args[1]) >= 0) && (Number(args[1]) <= 36);
    if (!isRealBetGroup && !isRealBetNumber) {
        context.channel.send("That betting category doesn't exist.");
        return;
    }
  
    // make sure they have enough money and add their bet
    let user = context.channel.guild.member(context.author);
    sql_connection.query("SELECT chad_bucks FROM UserInfo WHERE user_id = " + user.id, function(error, results, fields) {
        // check if the user is registered
        if(results.length == 0) {
            context.channel.send("You are not registered, please register to play.");
            return;
        }
        // check if user has sufficient funds
        let currentBalance = results[0].chad_bucks;
        let betAmount = args[2];
        if(currentBalance < betAmount) {
            context.channel.send("You do not have enough money to make that bet.");
            return;
        }
        // process payment and submit to roulette game
        sql_connection.query("UPDATE UserInfo SET chad_bucks = " + currentBalance - betAmount + 
                             " WHERE user_id = " + user.id, function(error, results, fields) {});
        rouletteGame.addBet(user.id, args[1], betAmount);
    });
}

/**
 * Handles user requests to view bet results after a Roulette game.
 *
 * After ensuring there is an active roulette game checks if: 
 *     (1) the roulette game is in the end game viewing stage, and
 *     (2) the user bet in the game
 * then displays the pay in, pay out, and profit/loss of the Roulette game.
 *
 * @param  Message  context  The Discord command that initiated the game start.
 */
exports.viewResults = async function viewResults(context) {
    // make sure there is a roulette game running in the current channel
    if (!gameMeister.hasGame(context.channel.id) ||
        !(gameMeister.games[context.channel.id] instanceof RouletteGame)) {
        context.channel.send("Please start a Roulette game before trying to view results.");
        return;
    }
    
    let rouletteGame = gameMeister.games[context.channel.id];
  
    // make sure it's viewing time
    if (!rouletteGame.canViewResults) {
        context.channel.send("You cannot view betting results yet.");
        return;
    }
    let user = context.channel.guild.member(context.author);
  
    // make sure user actually betted in the game
    if(!(user.id in rouletteGame.playerBets)) {
        context.channel.send("You didn't participate in this game.");
        return;
    }
    
    // give results
    let userBet = rouletteGame.playerBets[user.id];
    let payIn = userBet.payIn;
    let payOut = userBet.payOut;
    let profit = payOut - payIn;
    context.channel.send("you spent " + payIn + ", were payed " + payOut + ", so " +
                         "in total, your profit is " + profit);
}