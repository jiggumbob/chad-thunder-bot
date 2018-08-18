exports.run = async (client, message, args) => {
  const cheerio = require("cheerio"),
        fetch = require("node-fetch"),
        querystring = require("querystring");

  var cutArgs = message.content.substr(message.content.indexOf(" ") + 1);
  
  let searchUrl = `https://www.google.com/search?q=${encodeURIComponent(cutArgs)}`;
  message.channel.send(searchUrl);
  
  const res = await fetch(searchUrl);
  const json = await res.json();
  message.channel.send(json);
  
    
  
//   // We will now use snekfetch to crawl Google.com. Snekfetch uses promises so we will
//   // utilize that for our try/catch block.
//   return snekfetch.get(searchUrl).then((result) => {
//     // Cheerio lets us parse the HTML on our google result to grab the URL.
//     let $ = cheerio.load(result.body.file);
    
//     // This is allowing us to grab the URL from within the instance of the page (HTML)
//     let googleData = $('.r').first().find('a').first().attr('href');

//     // Now that we have our data from Google, we can send it to the channel.
//     googleData = querystring.parse(googleData.replace('/url?', ''));

//     // If no results are found, we catch it and return 'No results are found!'
//   }).catch((err) => {
//     message.channel.send('No results found.');
//   });        
}



