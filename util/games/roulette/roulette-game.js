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
        this.channelID; // ID of the text channel, used to request deletion at the end of game
        this.spinning; // boolean - if the roulette wheel is spinning (calculating bets)
    }
  
    /**
     * Starts a roulette game and runs the lifetime of the game.
     *
     * @param  Message  context  The discord message of the game start command origin.
     */
    async start(context) {
        this.channelID = context.channel.id;
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
}