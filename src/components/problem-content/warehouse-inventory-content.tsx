import React from 'react';

const WarehouseInventoryContent: React.FC = () => {
  return (
    <div className="prose prose-invert max-w-none">
      <div>
        <p className="text-muted-foreground">
          Design a system for managing a warehouse inventory. The warehouse should allow addition and removal of various items, with the capability to query the current inventory. The implementation should ensure accurate tracking of item quantities after each transaction.
        </p>
      </div>
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Methods</h3>
        <div className="space-y-4 text-muted-foreground">
          <div>
            <code className="text-sm">Warehouse()</code>
            <p className="mt-1">
              Initializes the warehouse inventory system with no items.
            </p>
          </div>
          <div>
            <code className="text-sm">bool addItem(string itemType, int quantity)</code>
            <p className="mt-1">
              Adds the specified quantity of the given item type to the warehouse. Returns true if the addition is successful.
            </p>
          </div>
          <div>
            <code className="text-sm">bool removeItem(string itemType, int quantity)</code>
            <p className="mt-1">
              Removes the specified quantity of the given item type from the warehouse. If the item is not available in the desired quantity, returns false.
            </p>
          </div>
          <div>
            <code className="text-sm">dict getInventory()</code>
            <p className="mt-1">
              Returns the current state of the inventory as a dictionary with item types as keys and their quantities as values.
            </p>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Example</h3>
        <pre className="bg-secondary p-4 rounded-md whitespace-pre-wrap break-words overflow-x-auto">
          <code>
            {`// Initialize warehouse
const warehouse = new Warehouse();
warehouse.addItem("apple", 10); // returns true
warehouse.removeItem("apple", 5); // returns true
warehouse.getInventory(); // returns {"apple": 5}
warehouse.removeItem("banana", 1); // returns false`}
          </code>
        </pre>
      </div>
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Constraints</h3>
        <ul className="space-y-2 text-muted-foreground list-disc pl-4">
          <li>0 ≤ quantity ≤ 10^4</li>
          <li>Item names are unique strings of lowercase alphabetic characters</li>
          <li>At most 10^3 calls will be made to addItem and removeItem</li>
        </ul>
      </div>
    </div>
  );
};

export default WarehouseInventoryContent;