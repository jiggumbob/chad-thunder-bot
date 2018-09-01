var mysql = require("mysql");

module.exports = (client) => {
    console.log("Ready to serve in " + client.channels.size + " channels on " + client.guilds.size + " servers," + 
 " for a total of " + client.users.size + " users.");
    client.user.setActivity("Use " + process.env.PREFIX + "help");
  

//     connection.connect();
//     try {
//         // connection.query(sql_create_user_items, function (error, results, fields) {
//         //     if (error) throw error;
//         //     console.log(results);
//         // });
//     } catch(e) {
//         console.log(e);
//     } finally {
//         console.log();
//     }
  
//     connection.end();

}