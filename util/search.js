/**
 * Provides ability to web search and get certain terms and results back.
 *
 * @author Jude Markabawi, Stanley Wang.
 * @license See the LICENSE file for details.
 */

const rp = require("request-promise");
const cheerio = require("cheerio");
const embedUtil = require("./embed-message-tool.js");

const linkBaseSafe = "https://www.google.com/search?safe=active&q=";
const linkBase = "https://www.google.com/search?q=";

const numOfResultsToDisplay = 6; // TOTAL number of links to display
/**
 * Handles user requests to search for something..
 *
 * Uses getResults to find the results of the search then displays them to the user.
 *
 * @param  Message  context  The Discord command that initiated the bot response.
 * @param  Array    args     Arguments the user provided in their command.
 */
exports.search = async function search(context, args) {
    let term = args.join("%20"); // connect different words w/out spaces
    // no search term provided
    if (term.length == 0) {
        context.channel.send(createSearchError("No search provided!"));
        return;
    }
    
    let searchURL = (context.channel.nsfw ? linkBase : linkBaseSafe) + term;
    let links = await getResults(searchURL);
    
    // no results found
    if (links.length == 0) {
        context.channel.send(createSearchError("No results found! Sorry!"));
        return;
    }
  
    context.channel.send(links[0]);
    
    let description = "";
    let length = links.length > numOfResultsToDisplay ? numOfResultsToDisplay : links.length;
    for (let i = 1; i < length; i ++) {
        description += "**" + i + ".** " + links[i] + "\n";
    }
    description += "\n**SafeSearch " + (context.channel.nsfw ? "off" : "on") + "**";
    let message = embedUtil.createMessage("Some Other Results You May Want", description, "books", false);
    context.channel.send(message);
}

/**
 * Returns link search results and/or quick answer, if available.
 *
 * @param  String  url  URL of the search.
 *
 * @return  Array  Search result links on the first page.
 */
async function getResults(url) {
    // query webpage and load html and jquery
    let options = {
        uri: url,
        headers: {
            'User-Agent': 'Mozilla/5.0'
        }
    };
    let html = await rp(options);
    const $ = cheerio.load(html); 
  
    let links = [];
    let results = $("#search").find(".g");
    // iterate through all the search results
    results.each(function(index, element) {
        try {
            let info = element.children[0]; // information element of g
            let linkInfo = info.children[0]; // link element 

            // get only link results, not others
            if (linkInfo.name == "a" && linkInfo.attribs.href.includes("http")) {
                let untrimmedResultURL = linkInfo.attribs.href;
                let trimmedResultURL = untrimmedResultURL.replace("/url?q=", "").split("&")[0];
                links.push(trimmedResultURL);
            }
        } catch (e) {
        }
    });
    return links;
}

/**
 * Provides a unified function to create search errors.
 *
 * @param  String  description  Description of the error.
 *
 * @return  RichEmbed  Embedded error message.
 */
function createSearchError(description) {
    return embedUtil.createMessage("Search Error", description, "exclamation mark", true);
}