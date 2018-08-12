import math


def max_length_split(long_string, MAX_LENGTH):
    '''Generator method. Splits a string of length > MAX_LENGTH into smaller pieces into a list

    The generator yield individual pieces that are all length = MAX_LENGTH, then
    the final piece with is length <= MAX_LENGTH

    Parameter:
        - The String to be split

    Return:
        - Pieces of the string
        '''
    # number of split strings to be in the List, not including the last one
    num_splits = math.floor(len(long_string) / MAX_LENGTH)

    # index of the current CHARACTER in the long_string string
    character_index = 0

    # yields all the string pieces of length MAX_LENGTH
    for i in range(0, num_splits):
        # yields a substring of the long_string string (in order of appearance)
        mini_string = long_string[character_index:(
            character_index + MAX_LENGTH)]
        character_index += MAX_LENGTH
        yield mini_string

    # yields remaining characters (guaranteed they are <= MAX_LENGTH)
    # if len(long_string < MAX_LENGTH) the method will end up here and skip the previous loop
    yield long_string[character_index:]
