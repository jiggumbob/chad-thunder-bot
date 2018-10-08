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

exports.Bet = class Bet {
    constructor() {
        this.payIn = 0; // amount total in bets for the round
        this.payOut = 0; // amount to actually be payed to the user
        this.bets = {}; // bet category, ex: "0", "evens", to bet cash amount
    }
    
    /**
     * Adds a certain value bet on a group.
     *
     * @param  string   betGroup   The bet group on the roulette table.
     * @param  integer  betAmount  The amount to be bet on that group.
     */
    addBet(betGroup, betAmount) {
        if (betGroup in this.bets) {
            this.bets[betGroup] += betAmount;
        } else {
            this.bets[betGroup] = betAmount;
        }
        this.payIn += betAmount;
    }
  
    /**
     * Calculates how much to pay the user based on their bets and the 
     * winning requirements.
     *
     * @param  Array  winningBets  Names of all winning betting groups.
     */
    calculatePayOut(winningBets) {
        let payOut = 0;
        console.log(winningBets);
        for (let betGroup of Object.keys(this.bets)) {
            for (let winGroup of winningBets) {
                if (betGroup == winGroup.name) {
                    payOut += this.bets[betGroup] * winGroup.multiplier + this.bets[betGroup];
                }
            }
        }
        this.payOut = payOut;
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
exports.getWinningBets = async function getWinningBets(landedNumber) {
    // add the group of just betting on the number itself
    let winningBets = [{
        name: landedNumber.toString(),
        multiplier: 35
    }];
    // loop through all possible betting groups and add the ones that contain this number to array
    for (let group of betGroups.groupCollections) {
        if (group.values.includes(landedNumber)) {
            winningBets.push(group);
        }
    }
    return winningBets;
}
