import React from 'react';

const BookstoreInventoryContent: React.FC = () => {
  return (
    <div className="prose prose-invert max-w-none">
      <div>
        <p className="text-muted-foreground">
          Design a Bookstore inventory system where books can be added to the inventory, sold to customers, and the current inventory can be retrieved.
        </p>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Methods</h3>
        <div className="space-y-4 text-muted-foreground">
          <div>
            <code className="text-sm">Bookstore(inventory)</code>
            <p className="mt-1">
              Initializes the bookstore with an inventory. The inventory is represented as a dictionary where the keys are book titles and the values are the number of copies available.
            </p>
          </div>
          <div>
            <code className="text-sm">void addBook(title, quantity)</code>
            <p className="mt-1">
              Adds the specified quantity of books with the given title to the inventory.
            </p>
          </div>
          <div>
            <code className="text-sm">boolean sellBook(title)</code>
            <p className="mt-1">
              Sells one copy of the book with the given title. Returns true if the sale is successful, false if no stock is available.
            </p>
          </div>
          <div>
            <code className="text-sm">Object getInventory()</code>
            <p className="mt-1">
              Returns the current state of the inventory as a dictionary, where the keys are book titles and the values are the quantities available.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Example</h3>
        <pre className="bg-secondary p-4 rounded-md whitespace-pre-wrap break-words overflow-x-auto">
          <code>
{`// Initialize bookstore with some inventory
const bookstore = new Bookstore({ "Book A": 5, "Book B": 2, "Book C": 0 });

bookstore.addBook("Book A", 3);
bookstore.sellBook("Book A");  // returns true
bookstore.sellBook("Book B");  // returns true
bookstore.sellBook("Book C");  // returns false (no stock)
bookstore.getInventory();  // returns { "Book A": 7, "Book B": 1, "Book C": 0 }`}
          </code>
        </pre>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Constraints</h3>
        <ul className="space-y-2 text-muted-foreground list-disc pl-4">
          <li>0 ≤ quantity ≤ 1000</li>
          <li>At most 1000 calls will be made to sellBook and addBook</li>
        </ul>
      </div>
    </div>
  );
};

export default BookstoreInventoryContent;
