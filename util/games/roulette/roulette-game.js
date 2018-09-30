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

const betTime = 15000;
const resultTime = 15000;

class RouletteGame {
    constructor(context) {
        this.playerBets = {} // player ID to Bet object
        this.context = context; // the discord message that started the game
        this.canBet = false; // boolean - if users are in the betting phase
        this.canViewResults = false; // boolean - if users are in the end game result phase
    }
  
    /**
     * Starts a roulette game and runs the lifetime of the game.
     *
     * Greets users and displays a betting table and options, allows users
     * to make their bets, spins the wheel (calculating the results while spinning),
     * then gives time for users to view their earnings/losses before terminating.
     */
    async start() {
        this.gameStartGreeting();
        this.getUserBets();
        this.spin();
        this.canViewResults = true;
        setTimeout(function() {
            gameMeister.requestDeath(this.context.channel.id);
        }, resultTime);
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
    getUserBets() {
        this.canBet = true;
        setTimeout(function() {
            this.canBet = false;
        }, betTime);
    }
    
    /**
     * Handles all the aspects of spinning the roulette wheel.
     *
     * Includes displaying the spinning animation, picking the random
     * landed number, calculating the winning bets, calculating users'
     * earnings after betting, and displaying the image of the landed number.
     */
    async spin() {
        let message = await this.context.channel.send("spinning gif");
      
        let landedNumber = Math.floor(Math.random() * 37);
        let winningBets = betUtil.getWinningBets(landedNumber);
        for (let player of Object.keys(this.playerBets)) {
            this.playerBets[player].calculatePayOut();
        }
        
        message.edit("image of a stationary roulette wheel with a ball on one");
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
      
        if (!(userID in this.playerBets)) {
            this.playerBets[userID] = new betUtil.Bet();
        }
        this.playerBets[userID].addBet(betGroup, betAmount);
        return true;
    }
}