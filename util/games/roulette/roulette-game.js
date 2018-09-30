/**
 * Defines the RouletteGame class and functions related to its use.
 *
 * The RouletteGame class handles all the processes related to a roulette game
 * while it is happening, including managing multiple player's bets, spinning
 * the wheel, etc. Once the game is over, the RouletteGame sends a request
 * to the GameMeister, asking for its destruction.
 *
 * @author Jude Markabawi, Stanley Wang.
 * @license See the LICENSE file for details.
 */

const gameMeister = require("../game-meister.js").gameMeister;
const betUtil = require("./bet.js");

class RouletteGame {
    constructor() {
        this.playerBets = {} // player ID to Bet object
        this.context; // the discord message that started the game
        this.canBet = false; // boolean - if users are in the betting phase
        this.canViewResult = false; // boolean - if users are in the end game result phase
    }
  
    /**
     * Starts a roulette game and runs the lifetime of the game.
     *
     * @param  Message  context  The discord message of the game start command origin.
     */
    async start(context) {
        this.context = context;
        // GREETING MESSAGE
            this.gameStartGreeting();
        // GET BETS
            await this.getUserBets();
        // SPIN WHEEL (CALCULATE BET EARNINGS)
            // etc
        // GIVE TIME TO SEE EARNINGS
            // etc
        // TELL GAME MEISTER TO DESTROY THE GAME
            // etc
    }
    
    /**
     * Greets users in a channel, introducing them to the Roulette game.
     */
    gameStartGreeting() {
        this.context.channel.send("*welcome message*");
        this.context.channel.send("*picture of the betting table*");
    }
    
    /**
     * Allows bets to be added for a period of time, then stops it.
     */
    async getUserBets() {
        this.canBet = true;
        setTimeout(function() {
            this.canBet = false;
        }, 15000);
    }
    
    /**
     * Handles all the aspects of spinning the roulette wheel.
     *
     * Includes displaying the spinning animation, picking the random
     * landed number, calculating the winning bets, calculating users'
     * earnings after betting, and displaying the image of the landed number.
     */
    async spin() {
        this.spinWheelAnimation();
        let landedNumber = Math.floor(Math.random() * 37);
        let winningBets = betUtil.getWinningBets(landedNumber);
        for (let player of Object.keys(this.playerBets)) {
            this.playerBets[player].calculatePayOut();
        }
    }
  
    /**
     * Adds the bet of a user to the bets list.
     *
     * Assumes that the user already has sufficient funds and payed for
     * the bet to be placed.
     *
     * @param  String   userID     ID of the user adding a bet.
     * @param  String   betGroup   Type of roulette bet the user is betting on.
     * @param  integer  betAmount  Amount of money betting on that group.
     *
     * @return  boolean  If the bet was successfully added or not.
     */
    async addBet(userID, betGroup, betAmount) {
        if (!this.canBet) {
            return false;
        }
        // add the bet
        if (!(userID in this.playerBets)) {
            this.playerBets[userID] = new betUtil.Bet();
        }
        this.playerBets[userID].addBet(betGroup, betAmount);
        return true;
    }
}