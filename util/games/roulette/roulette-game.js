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
            // etc
        // GET BETS
            // etc
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
        this.context.channel.send("Welcome to the Roulette Game! Get ready to bet!");
    }
    
    /**
     * Allows bets to be added for a period of time, then stops it.
     */
    async getUserBets() {
        this.canBet = true;
        
    }
    
    /**
     * Adds the bet of a user to the bets list.
     *
     * @param  String   userID    ID of the user adding a bet.
     * @param  String   betGroup  Type of roulette bet the user is betting on.
     * @param  integer  amount    Amount of money betting on that group.
     *
     * @return  boolean  If the bet was successfully added or not.
     */
    async addBet(userID, betGroup, amount) {
        if (!this.canBet) {
            return false;
        }
        
        // check user funds
        // add the bet
        return true;
    }
    
}