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
     * @param  Game  game  The type of game desired to be started.
     *
     * @return  boolean  Whether the game request was successful.
     */
    async requestGame(game) {
        let channelID = game.context.channel.id;
        if (this.hasGame(channelID)) {
            return false;
        } else {
            this.games[channelID] = game;
            game.start();
            return true;
        }
    }
    
    /**
     * Deletes a Game from the Meister.
     *
     * @param  String  channelID  Channel ID of the game to be destroyed.
     */
    async requestDeath(channelID) {
        if (channelID in this.games) {
            delete this.games[channelID];
        }
    }
    
    /**
     * Checks if there is a game running in the specified channel.
     *
     * @param  String  channelID  The type of game desired to be started.
     *
     * @return  boolean  If there is a game in the channel.
     */
    async hasGame(channelID) {
        if (channelID in this.games) {
            return true;
        }
    }
}

/**
 * Create the bot's Game Meister in memory. 
 */

exports.gameMeister = new GameMeister();