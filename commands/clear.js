exports.run = (client, message, args) => {
  
  // Check if the user has enough permissions
  if (!message.channel.permissionsFor(message.member).has("MANAGE_MESSAGES")) {
    message.channel.sendMessage("Sorry, you don't have the permission to execute the command \""+message.content+"\"");
    return;
  }
  
  //checks if there is a number after
  if (isNaN(args[0])) {
    message.channel.send("Use a number as an argument.");
    return;
  }
    
  message.channel.bulkDelete(+args[0] + 1); // one extra to delete the user's message
}


