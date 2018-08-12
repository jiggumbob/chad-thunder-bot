from abc import ABC, abstractmethod
import errors
import json
import economy

class Item(ABC):
    ''' Represents an item with a number of uses and a specific function.

        Attributes:
            - CLASS STRING: Default display name
            - CLASS BOOLEAN: Whether or not the uses affects the count of the item (by default true)
            - Name of the item (String), player chooses
            - Count (how many of the item)
    '''
    default_display_name = "Item"
    uses_affect_count = True

    def __init__(self, count=1):
        self.display_name = self.default_display_name
        self.count = count

    def use(self):
        ''' This is the same for every item, besides the base_use(). Uses the item.

        When a player uses an item, call the Inventory method use_item(ITEM_NAME) instead
        as it updates the inventory and removes the item if the count of the item 0.
        '''
        self.base_use()
        if self.uses_affect_count:
            self.count -= 1

    @abstractmethod
    def base_use():
        ''' Every item class must implement this. This is the core functionality
        of what the item does. Do not directly call it when using the item, call use()'''
        pass


############################## JSON ##################################
# encoding items
class ItemEncoder(json.JSONEncoder):
    def default(self, object):
        if isinstance(object, Item):
            return {"default_display_name": object.default_display_name,
                    "display_name"        : object.display_name,
                    "count"               : object.count}
        # throws type error if not an item
        return json.JSONEncoder.default(self, obj)
# decoding items

def as_item(dct, economy):
    # uses_affect_count is automatically determined when the item_class is called
    item_class = economy.items[dct["default_display_name"]]
    item = item_class(dct["count"])
    item.display_name = dct["display_name"]
    return item
