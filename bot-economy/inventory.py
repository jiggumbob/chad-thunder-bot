from errors import ItemNotFoundError, DuplicateNameError, NewItemDuplicateNameError


class Inventory:

    '''Represents a collection of belongings and currencies.

        Attributes:
            - Dictionary of currency name to currency amount
            - Dictionary of item name to <Item> object

    '''

    def __init__(self):
        self.currencies = {}
        self.items = {}

    def add_items(self, *args):
        ''' Add arbitrary number of items.

        If an item to be added is already
        in the inventory, then the number of uses of the to-be-added item is added
        to the number of uses in the item already in the inventory.

        '''

        for item in args:
            # if an item of the same name is in the inventory, but is not the same type, raise an error
            if item.display_name in self.items and type(item) != type(self.items[item.display_name]):
                raise NewItemDuplicateNameError
            # if an item of the same name is in the inventory, but is the same type, add count
            elif item.display_name in self.items and type(item) == type(self.items[item.display_name]):
                self.items[item.display_name].count += item.count
            else:
                self.items[item.display_name] = item

    def rename_item(self, current_name, new_name):
        ''' Renames an item in the user's inventory.

        If an item in the inventory already has the desired name change, then a
        DuplicateNameError is raised, unless that item is the same type of item
        as the current one. In that case, the items are automatically merged because
        they are the same item type and have the same display name.

        '''
        if current_name not in self.items:
            raise ItemNotFoundError

        if new_name in self.items and type(self.items[new_name]) != type(self.items[current_name]):
            raise DuplicateNameError
        # removes the item from the inventory, renames, and re-adds
        # automatically merges identical named-identical item types
        current_item = self.items.pop(current_name)
        current_item.display_name = new_name
        self.add_items(current_item)

    def use_item(self, item_name):
        ''' Uses an item, and removes it from the inventory if the count is below 1.'''

        if item_name not in self.items:
            raise ItemNotFoundError

        # use item and remove if it has no more uses
        current_item = self.items[item_name]
        current_item.use()
        if current_item.count < 1:
            self.items.pop(item_name)
