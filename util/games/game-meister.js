/**
 * Defines the GameMeister class.
 *
 * There should only be 1 Game Meister running while the bot is alive.
 * The Game Meister watches over all active instances of games and ensures that there aren't 
 * multiple running games in the same channel. Since every channel has a unique id
 * across Discord, there is no need to keep track of guilds seperately.
 *
 * @author Jude Markabawi, Stanley Wang.
 * @license See the LICENSE file for details.
 */

class GameMeister {
    /** 
     * Creates a Game Meister. 
    */
    constructor() {
        this.games = {}; // channel id to game
    }
    
    /**
     * Requests to start a game in a certain channel.
     *
     * If there is no game running in that channel, creates a new game
     * of the specified type in that channel, starts it, and return true.
     * Returns false and does not create game if the channel already has a game.
     *
     * @param  Game    game        The type of game desired to be started.
     * @param  String  channel_id  The id of the channel the game request was made.
     *
     * @return  boolean  Whether the game request was successful.
    */
    requestGame(game, channel_id) {
        if (channel_id in this.games) {
            return false;
        } else {
            this.games[channel_id] = game;
            game.start();
            return true;
        }
    }
}

/**
 * Create the bot's Game Meister in memory. 
 */

exports.gameMeister = new GameMeister();