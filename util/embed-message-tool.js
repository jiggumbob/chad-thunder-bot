/**
 * Provides a command to create embed messages in a streamlined manner.
 *
 * Ensures consistency in the design color throughout the bot messages and allows for
 * easy switching between different colors without going through tons of files. Also provides a 
 * list of emojis for use by embed messages, eliminating the need to put huge links in many files.
 *
 * @author Jude Markabawi, Stanley Wang.
 * @license See the LICENSE file for details.
 */

const Discord = require("discord.js");

const errorColor = 0xFF524C;
const normalColor = 0xFFDB1D;

exports.createMessage = function createMessage (title, description, imageName, isError) {
    let embedMessage = new Discord.RichEmbed();
    if (!(typeof title === "undefined")) {
        embedMessage.setTitle(title);
    }
    if (!(typeof description === "undefined")) {
       embedMessage.setDescription(description);
    }
    if (!(typeof imageName === "undefined")) {
       embedMessage.setThumbnail(emojis[imageName]);
    }
    if (!(typeof isError === "undefined")) {
       embedMessage.setColor(isError ? errorColor : normalColor);
    }
    
    return embedMessage;
};

const emojis = {
    "confused face" : "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/147/confused-face_1f615.png",
    "question" : "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/147/black-question-mark-ornament_2753.png",
    "entry denied" : "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/147/no-entry_26d4.png",
    "crying face" : "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/147/crying-face_1f622.png",
    "face open mouth" : "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/147/face-with-open-mouth_1f62e.png",
    "loud crying" : "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/147/loudly-crying-face_1f62d.png",
    "ping loading" : "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/147/clockwise-downwards-and-upwards-open-circle-arrows_1f503.png",
    "money with wings" : "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/147/money-with-wings_1f4b8.png",
    "bag of cash" : "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/147/money-bag_1f4b0.png",
    "smiling sunglasses" : "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/147/smiling-face-with-sunglasses_1f60e.png",
    "fearful face" : "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/147/fearful-face_1f628.png",
    "pensive" : "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/147/pensive-face_1f614.png",
    "smiling face" : "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/147/smiling-face-with-open-mouth-and-smiling-eyes_1f604.png",
    "exclamation mark": "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/154/double-exclamation-mark_203c.png",
    "crossed out bell" : "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/154/bell-with-cancellation-stroke_1f515.png",
    "musical note" : "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/154/musical-note_1f3b5.png",
    "curved arrow" : "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/154/rightwards-arrow-with-hook_21aa.png",
    "waving hand" : "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/154/waving-hand-sign_1f44b.png",
    "pause button": "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/144/twitter/154/double-vertical-bar_23f8.png",
    "play pause": "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/144/twitter/154/black-right-pointing-triangle-with-double-vertical-bar_23ef.png",
    "repeat arrow": "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/154/clockwise-rightwards-and-leftwards-open-circle-arrows_1f501.png",
    "right arrow": "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/154/black-rightwards-arrow_27a1.png",
    "eject symbol" : "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/154/eject-symbol_23cf.png"
    
};