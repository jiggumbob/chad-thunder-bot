/**
 * Defines the GameMeister class.
 *
 * Defines GameMeister class, its functionality, and its use.
 *
 * @author Jude Markabawi, Stanley Wang.
 * @license See the LICENSE file for details.
 */

class GameMeister {
    /** 
     * Creates a Game Meister. There should only be 1 Game Meister running while the bot is alive.
     * The Game Meister watches over all active instances of games and ensures that there aren't 
     * multiple running games in the same channel. 
    */
  
    constructor() {
        this.games = {}; // channel id to game
    }
    
    /**
     * Requests to start a game in a certain channel.
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