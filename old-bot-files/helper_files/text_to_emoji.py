'''
Contains necessary tools to easily convert a string into the
same string written in Discord emojis instead.
'''

# dictionary to translate regular characters into emoji characters
translations = {"a": ":regional_indicator_a:",
                "b": ":b:",
                "c": ":regional_indicator_c:",
                "d": ":regional_indicator_d:",
                "e": ":regional_indicator_e:",
                "f": ":regional_indicator_f:",
                "g": ":regional_indicator_g:",
                "h": ":regional_indicator_h:",
                "i": ":regional_indicator_i:",
                "j": ":regional_indicator_j:",
                "k": ":regional_indicator_k:",
                "l": ":regional_indicator_l:",
                "m": ":regional_indicator_m:",
                "n": ":regional_indicator_n:",
                "o": ":regional_indicator_o:",
                "p": ":regional_indicator_p:",
                "q": ":regional_indicator_q:",
                "r": ":regional_indicator_r:",
                "s": ":regional_indicator_s:",
                "t": ":regional_indicator_t:",
                "u": ":regional_indicator_u:",
                "v": ":regional_indicator_v:",
                "w": ":regional_indicator_w:",
                "x": ":regional_indicator_x:",
                "y": ":regional_indicator_y:",
                "z": ":regional_indicator_z:",
                " ": "         ",
                "!": ":exclamation:",
                "?": ":question:",
                "0": ":zero:",
                "1": ":one:",
                "2": ":two:",
                "3": ":three:",
                "4": ":four:",
                "5": ":five:",
                "6": ":six:",
                "7": ":seven:",
                "8": ":eight:",
                "9": ":nine:"}


def wordsToEmoji(words):

        # Takes a String and converts every available character to a
        # Discord emoji character, then returns that String)
        #
        # Parameter(s) :
        # String to be converted to Emoji string
        #
        # Return :
        # the same string typed in emoji characters instead

    return_emoji = ""
    for character in words:
        try:
            # translate string to emoji and add to new string
            return_emoji += translations[character.lower()]
        except KeyError:
            # if it is not a supported character, just add the character,
            # and inform the user
            return_emoji += character
    return return_emoji
