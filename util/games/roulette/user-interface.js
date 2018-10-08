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

const betTime = 30000;
exports.betTime = betTime;
const resultTime = 20000;
exports.resultTime = resultTime;

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
        let errorMessage = userInterface.createErrorMessage("There is already a different game in this channel.");
        context.channel.send(errorMessage);
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
        let errorMessage = userInterface.createErrorMessage("You need to specify what you're betting on " + 
                                                           "and how much on it! Use `" + process.env.PREFIX + 
                                                           "roulette help` for more info.");
        context.channel.send(errorMessage);
        return;
    }
    // make sure there is a roulette game running in the current channel
    if (!(context.channel.id in gameMeister.games) ||
        !(gameMeister.games[context.channel.id] instanceof RouletteGame)) {
        let errorMessage = userInterface.createErrorMessage("Please start a Roulette game before placing a bet.");
        context.channel.send(errorMessage);
        return;
    }
    
    let rouletteGame = gameMeister.games[context.channel.id];
  
    // make sure it's betting time
    if (!rouletteGame.canBet) {
        let errorMessage = userInterface.createErrorMessage("You can't bet right now, betting is over.");
        context.channel.send(errorMessage);
        return;
    }
  
    // make sure the user's betting group actually exists
    let names = betGroups.map(group => group.name);
    let isRealBetGroup = names.includes(args[1].toLowerCase());
    let isRealBetNumber = (Number(args[1]) >= 0) && (Number(args[1]) <= 36);
    if (!isRealBetGroup && !isRealBetNumber) {
        let errorMessage = userInterface.createErrorMessage("That betting group doesn't exist! Use `" + process.env.PREFIX + 
                                                           "roulette help` for more info.");
        context.channel.send(errorMessage);
        return;
    }
  
    let user = context.channel.guild.member(context.author);
    sql_connection.query("SELECT chad_bucks FROM UserInfo WHERE user_id = " + user.id, function(error, results, fields) {
        // check if the user is registered
        if(results.length == 0) {
            let errorMessage = userInterface.createErrorMessage("You are not registered, please register to play.");
            context.channel.send(errorMessage);
            return;
        }
        // check if user has sufficient funds
        let currentBalance = results[0].chad_bucks;
        let betAmount = parseInt(args[2]);
        if(currentBalance < betAmount) {
            let errorMessage = userInterface.createErrorMessage("You don't have enough money to make that bet.");
            context.channel.send(errorMessage);
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
        let errorMessage = userInterface.createErrorMessage("Start a Roulette game before trying to view results.");
        context.channel.send(errorMessage);
        return;
    }
    
    let rouletteGame = gameMeister.games[context.channel.id];
  
    // make sure it's viewing time
    if (!rouletteGame.canViewResults) {
        let errorMessage = userInterface.createErrorMessage("You can't view betting results yet.");
        context.channel.send(errorMessage);
        return;
    }
    let user = context.channel.guild.member(context.author);
  
    // make sure user actually betted in the game
    if(!(user.id in rouletteGame.playerBets)) {
        let errorMessage = userInterface.createErrorMessage("You didn't participate in this game.");
        context.channel.send(errorMessage);
        return;
    }
    
    // give results
    let userBet = rouletteGame.playerBets[user.id];
    let payIn = userBet.payIn;
    let payOut = userBet.payOut;
    let profit = payOut - payIn;
    
    let profitMessage = "Your total winnings are: ";
    let profitEmoji = "money with wings";
    if (profit <= 0) {
        profitMessage = "Your total losses are: ";
        profitEmoji = "crying face";
    }
    let description = "You spent: " + payIn + "\nYou were payed: " + payOut + "\n\n**" + profitMessage +
                      Math.abs(profit) + " Chad Bucks**";
    let resultMessage = embedUtil.createMessage("Bet Results", description, profitEmoji, false);
    resultMessage.setAuthor(user.displayName, user.user.displayAvatarURL);
    context.channel.send(resultMessage);
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
    let welcomeDescription = "You have **" + userInterface.betTime/1000 + " seconds** to place any " +
        "bets you like.\n\nUse `" + process.env.PREFIX + "roulette help` for info about betting and how to play Roulette.";
    let welcomeMessage = embedUtil.createMessage("Welcome to Roulette!", welcomeDescription, "smiling face", false);
    welcomeMessage.addField("Betting Table", "Start betting!");
    welcomeMessage.setImage(imageLinks.betTable);
    context.channel.send(welcomeMessage);
}

/**
 * Displays roulette wheel spinning animation, final roulette wheel image, and landed number.
 *
 * @param  Message  context       The Discord command that initiated the game start.
 * @param  Integer  landedNumber  The number landed on by the roulette wheel after spinning.
 */
exports.spinAnimations = async function spinAnimations(context, landedNumber) {
    let wheel = embedUtil.createMessage(undefined, undefined, undefined, false);
    wheel.setImage(imageLinks.spinningWheel);
    let message = await context.channel.send(wheel);
    setTimeout(function() {
        wheel.setImage(imageLinks.stillWheel);
        wheel.setTitle("Landed on " + landedNumber);
        message.edit(wheel);
    }, 3000);
}

/**
 * Prompts users that now is the time to view their betting results.
 *
 * @param  Message  context  The Discord command that initiated the game start.
 */
exports.viewResultsPrompt = async function viewResultsPrompt(context) {
    let description = "Once the wheel stops spinning, use `" + process.env.PREFIX + "roulette view` to see " +
                        "your betting results!";
    let resultsPrompt = embedUtil.createMessage("Get Ready to View Results", description, "exclamation mark", false);
    context.channel.send(resultsPrompt);
}

/**
 * Gives users the end game message before the Roulette game ends.
 *
 * @param  Message  context  The Discord command that initiated the game start.
 */
exports.endOfGameMessage = async function endOfGameMessage(context) {
    let description = "Thank you for playing Roulette!\n\nYou can easily start another " +
                        "game by using `" + process.env.PREFIX + "roulette start`";
    let endMessage = embedUtil.createMessage("End of Roulette Game", description, "smiling face", false);
    context.channel.send(endMessage);
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
    let description = "Your bet of " + betAmount + " Chad Bucks on `" + 
                        betGroup + "` has been added. Good luck!";
    let embedMessage = embedUtil.createMessage("Roulette Bet Added", description, undefined, false);
    embedMessage.setAuthor(user.displayName, user.user.displayAvatarURL);
    context.channel.send(embedMessage);
}

/**
 * Provides a unified system for creating roulette errors.
 *
 * @param  String  description  What the error message will say.
 */
exports.createErrorMessage = function createErrorMessage(description) {
    return embedUtil.createMessage("Roulette Error", description, undefined, true);
}