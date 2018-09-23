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
        this.payIn = 0; // amount total in bets for the round
        this.profit = 0; // amount profited from bets, (payOut = payIn + profit)
        this.bets = {}; // bet category, ex: "0", "evens", to bet cash amount
    }
    
    /**
     * Adds a certain value bet on a group.
     *
     * @param  string   betGroup   The bet group on the roulette table.
     * @param  integer  betAmount  The amount to be bet on that group.
     */
    addBet(betGroup, betAmount) {
        if(betGroup in this.bets) {
            this.bets[betGroup] += betAmount;
        } else {
            this.bets[betGroup] = betAmount;
        }
        this.payIn += betAmount;
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
