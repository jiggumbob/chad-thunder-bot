/**
 * Defines methods and utilities used to allow interact with 
 * a Roulette Game.
 *
 * @author Jude Markabawi, Stanley Wang.
 * @license See the LICENSE file for details.
 */

const gameMeister = require("../game-meister.js").gameMeister;
const RouletteGame = require("./roulette-game.js").RouletteGame;
const sql_connection = require("../../sql-connection.js").sql_connection;
const betGroups = require("./bet-groups.js").groupCollections;
const userInterface = require("./user-interface.js");
const embedUtil = require("../../embed-message-tool.js");
const imageLinks = require("../../../assets/games/roulette/image-links.js");

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
 * @param  Message  context  The Discord command that asked to place a bet.
 * @param  Array    args     Array of arguments the user made in the bot commmand.
 */
exports.addBet = async function addBet(context, args) {
    // make sure the command is valid
    if (typeof args[1] == "undefined" || typeof args[2] == "undefined") {
        context.channel.send("Invalid bet command!");
        return;
    }
    // make sure there is a roulette game running in the current channel
    if (!(context.channel.id in gameMeister.games) ||
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
    let names = betGroups.map(group => group.name);
    let isRealBetGroup = names.includes(args[1].toLowerCase());
    let isRealBetNumber = (Number(args[1]) >= 0) && (Number(args[1]) <= 36);
    if (!isRealBetGroup && !isRealBetNumber) {
        context.channel.send("That betting category doesn't exist.");
        return;
    }
  
    let user = context.channel.guild.member(context.author);
    sql_connection.query("SELECT chad_bucks FROM UserInfo WHERE user_id = " + user.id, function(error, results, fields) {
        // check if the user is registered
        if(results.length == 0) {
            context.channel.send("You are not registered, please register to play.");
            return;
        }
        // check if user has sufficient funds
        let currentBalance = results[0].chad_bucks;
        let betAmount = parseInt(args[2]);
        if(currentBalance < betAmount) {
            context.channel.send("You do not have enough money to make that bet.");
            return;
        }
        // process payment and submit to roulette game
        sql_connection.query("UPDATE UserInfo SET chad_bucks = " + (currentBalance - betAmount) + 
                             " WHERE user_id = " + user.id, function(error, results, fields) {});
        rouletteGame.addBet(user.id, args[1], betAmount);
        userInterface.betAddedMessage(context, args[1], betAmount);
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
 * @param  Message  context  The Discord command that asked to view results.
 */
exports.viewResults = async function viewResults(context) {
    // make sure there is a roulette game running in the current channel
    if (!(context.channel.id in gameMeister.games) ||
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

/**
 * Pays out users after the Roulette wheel has spun.
 *
 * @param  Message  context  The Discord command that initiated the game start.
 */
exports.payOutUsers = async function payOutUsers(context) {
    let rouletteGame = gameMeister.games[context.channel.id];
    for (let userID of Object.keys(rouletteGame.playerBets)) {
        let bet = rouletteGame.playerBets[userID];
        sql_connection.query("UPDATE UserInfo SET chad_bucks = chad_bucks + " + bet.payOut + 
                             " WHERE user_id = " + userID, function(error, results, fields) {});
    }
}

/**
 * Greets users at the start of a Roulette Game
 *
 * @param  Message  context  The Discord command that initiated the game start.
 */
exports.gameStartGreeting = async function gameStartGreeting(context) {
    let welcomeDescription = "Thanks for starting a game of Roulette! You have 20 seconds to place any " +
        "bets you like.\n\nUse `" + process.env.PREFIX + "roulette help` for info about betting and how to play Roulette.";
    let welcomeMessage = embedUtil.createMessage("Welcome to Roulette!", welcomeDescription, "smiling face", false);
    let betTableDescription = "Use " + process.env.PREFIX + "roulette bet to bet";
    let betTableMessage = embedUtil.createMessage("Betting Table", betTableDescription, undefined, false); 
    betTableMessage.setImage(imageLinks.betTable);
    context.channel.send(welcomeMessage);
    context.channel.send(betTableMessage);
}

/**
 * Displays roulette wheel spinning animation, final roulette wheel image, and landed number.
 *
 * @param  Message  context       The Discord command that initiated the game start.
 * @param  Integer  landedNumber  The number landed on by the roulette wheel after spinning.
 */
exports.spinAnimations = async function spinAnimations(context, landedNumber) {
    let message = await context.channel.send("Spinning Wheel...");
    setTimeout(function() {
        message.edit("Landed on " + landedNumber + ".");
    }, 3000);
}

/**
 * Prompts users that now is the time to view their betting results.
 *
 * @param  Message  context  The Discord command that initiated the game start.
 */
exports.viewResultsPrompt = async function viewResultsPrompt(context) {
    context.channel.send("Once the wheel stops spinning, use `" + process.env.PREFIX + "roulette view` to see " +
                        "your results.");
}

/**
 * Gives users the end game message before the Roulette game ends.
 *
 * @param  Message  context  The Discord command that initiated the game start.
 */
exports.endOfGameMessage = async function endOfGameMessage(context) {
    context.channel.send("Thank you for playing Roulette! You can easily start another " +
                        "game by using `" + process.env.PREFIX + "roulette start`");                       
}

/**
 * Gives users the end game message before the Roulette game ends.
 *
 * @param  Message  context    The Discord command that added a bet.
 * @param  String   betGroup   What the user betted on.
 * @param  Integer  betAmount  How much the user bet on that.
 */
exports.betAddedMessage = async function betAddedMessage(context, betGroup, betAmount) {
    let user = context.channel.guild.member(context.author);
    context.channel.send(user.displayName + ", your bet of " + betAmount + " Chad Bucks on " + 
                        betGroup + " has been added. Good luck!");
}