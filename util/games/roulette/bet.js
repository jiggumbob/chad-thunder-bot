/**
 * Defines the Bet class and functions related to its use.
 *
 * The Bet class is used to manage user's bets on numbers, colors, evens, etc. in roulette
 * and make sure that earnings and losses are correctly accounted for when gambling.
 *
 * @author Jude Markabawi, Stanley Wang.
 * @license See the LICENSE file for details.
 */

const betGroups = require("./bet-groups.js");

class Bet {
    constructor() {
        this.earning = 0; // return off of bets after spinning the wheel (includes initial bets)
        this.bets = {} // bet category, ex: "00", "evens", to bet cash amount
    }
}

/**
 * Gets all the possible betting groups that would have been 
 * a winner for the landed roulette number.
 *
 * @param  integer  landedNumber  The number the roulette spin landed on.
 *
 * @return  Array  String array of the names of all winning betting groups.
 */
async function getWinningBets(landedNumber) {
    let winningBets = [landedNumber];
        // loop through all possible betting groups and add the ones that contain this number to array
        for (let group of betGroups.groupCollections) {
            if (landedNumber in group.values) {
                winningBets.push(group.name)
            }
        }
    return winningBets;
}
