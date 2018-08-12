class InsufficientFundError(Exception):
    ''' When a user does not have enough of a currency to do something. '''
    pass


class ItemNotFoundError(Exception):
    ''' When a requested item is not an item in the requested object. '''
    pass


class UnsupportedShopCurrencyError(Exception):
    ''' When a shop is created and trying to be placed in the economy but
    its currency is not supported. '''
    pass


class DuplicateNameError(Exception):
    ''' When attempting to rename an item but the same name is already taken by
    an item of a different type in the same inventory'''
    pass


class UserAlreadyExistsError(Exception):
    ''' When adding a user to an economy but that user's id already exists'''
    pass


class ItemInShopError(Exception):
    ''' When attempting to add an item to a shop but that item is already in the shop'''
    pass

class NewItemDuplicateNameError(Exception):
    ''' When a purchased/traded item has the same display_name of an item in the
    current inventory but is not the same type of item. '''
    pass

class ItemAlreadyExistsError(Exception):
    ''' When adding an item to an economy but an item with the same default_display_name already exists.'''
    pass
