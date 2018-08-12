from errors import InsufficientFundError, ItemNotFoundError, ItemInShopError
import item


class Shop:
    ''' Class representing shops (sell and buy items to/from users)

        Attributes:
            - Dictionary of item default display names to (ITEM_CONSTRUCTOR(), price)
            - Currency type (string)
    '''

    def __init__(self, items_dict, currency, display_name):
        '''Initialize a Shop object, where items_dict is a dictionary of
        item names to (item class name, price) tuples'''

        self.shop_items = items_dict
        self.currency = currency
        self.display_name = display_name

    def sell_to_user(self, user, item_name, number=1):
        ''' Method used when a user tries to purchase an item from the shop.'''
        # Check if item is actually in the shop
        try:
            self.shop_items[item_name]
        except KeyError:
            raise ItemNotFoundError

        price = self.shop_items[item_name][1] * number

        # Check if user has sufficient funds
        if user.inventory.currencies[self.currency] < price:
            raise InsufficientFundError

        # Subtract price from user and give them the item with the count of how many they bought
        user.inventory.currencies[self.currency] -= price
        user.inventory.add_items(self.shop_items[item_name][0](number))

    def add_item(self, item):
        if item.default_display_name in self.shop_items.keys():
            raise ItemInShopError
