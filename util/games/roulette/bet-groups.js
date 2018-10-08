/**
 * Defines groups of numbers that fit certain roulette bet groups.
 *
 * Every group contains certain numbers that fulfill its condition. These are used 
 * to find which bets are successful for certain numbers and which aren't.
 *
 * @author Jude Markabawi, Stanley Wang.
 * @license See the LICENSE file for details.
 */

const odd = {
    name: "odd",
    multiplier: 1,
    values: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 35]
};
const even = {
    name: "even",
    multiplier: 1,
    values: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36]
};
const red = {
    name: "red",
    multiplier: 1,
    values: [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]
};
const black = {
    name: "black",
    multiplier: 1,
    values: [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35]
};
const one_to_18 = {
    name: "1-18",
    multiplier: 1,
    values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]
};
const nineteen_to_36 = {
    name: "19-36",
    multiplier: 1,
    values: [19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36]
};
const first_12 = {
    name: "first12",
    multiplier: 2,
    values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
};
const second_12 = {
    name: "second12",
    multiplier: 2,
    values: [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]
};
const third_12 = {
    name: "third12",
    multiplier: 2,
    values: [25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36]
};
const first_column = {
    name: "firstcolumn",
    multiplier: 2,
    values: [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34]
};
const second_column = {
    name: "secondcolumn",
    multiplier: 2,
    values: [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35]
};
const third_column = {
    name: "thirdcolumn",
    multiplier: 2,
    values: [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36]
};
const basket = {
    name: "basket",
    multiplier: 8,
    values: [0, 1, 2, 3]
};
exports.groupCollections = [odd, even, red, black, one_to_18, nineteen_to_36, first_12, second_12, third_12,
                           first_column, second_column, third_column, basket];
