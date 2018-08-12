from errors import UserAlreadyExistsError, UnsupportedShopCurrencyError, ItemAlreadyExistsError


class Economy:
    ''' Represents users, shops, currencies, item types, and businesses

    '''

    def __init__(self):
        self.users = {}  # user-id to user
        self.shops = {}  # shop name to shop
        self.currencies = []  # list of currencies
        self.items = {}  # item default_display_name to item's class
        # business name to business (may be a Casino or other thing)
        self.other_businesses = {}
        # TODO: add_business() method

    def add_user(self, user):
        ''' Adds a user to the economy, giving them all the current currencies
        that the economy supports. '''
        if user.user_id in self.users:
            raise UserAlreadyExistsError
        self.users[user.user_id] = user
        for currency in self.currencies:
            user.inventory.currencies[currency] = 0

    def add_shop(self, shop):
        ''' Adds a shop to the economy, ensuring that the currency used by the
        shop is one supported by the economy. '''
        if shop.currency not in self.currencies:
            raise UnsupportedShopCurrencyError
        self.shops[shop.display_name] = shop

    def add_currency(self, currency):
        ''' Use this command when adding a new currency. Updates all users in
        the economy and gives them 0 of the currency.'''

        if currency not in self.currencies:
            self.currencies.append(currency)
            for user in self.users.values():
                if currency not in user.inventory.currencies:
                    user.inventory.currencies[currency] = 0

    def add_item(self, item):
        ''' Use this command when adding a new item. Adds the item's default_display_name
        as the key and the class and the value.'''
        if item.default_display_name in self.items:
            raise ItemAlreadyExistsError
        self.items[item.default_display_name] = item

    def update_all_users_currencies(self):
        ''' Use this only when new currencies are added to the economy, and
        something went wrong, leading many users to not have the same currency
        slots as others. Gives every current user in the economy the new currencies.

        Slower than the add_currency command. Use add_currency correctly every time
        and this method should rarely be needed.
        '''
        for currency in self.currencies:
            for user in self.users:
                if currency not in user.inventory.currencies:
                    user.inventory.currencies[currency] = 0
