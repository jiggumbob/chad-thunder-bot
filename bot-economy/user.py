import inventory


class User:
    '''Represents the users/members of an economy.

        Attributes:
            - User ID: unique to every user (in this case the discord user id)
            - Inventory
    '''

    def __init__(self, user_id):
        self.user_id = user_id
        self.inventory = inventory.Inventory()
