```tsx
import React from 'react';

const LibrarySystemContent: React.FC = () => {
  return (
    <div className="prose prose-invert max-w-none">
      <div>
        <p className="text-muted-foreground">
          Design a system for managing a library of books. The library should offer the functionality to borrow and return books. Each book has a specific quantity available in the library.
        </p>
      </div>
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Methods</h3>
        <div className="space-y-4 text-muted-foreground">
          <div>
            <code className="text-sm">LibrarySystem(dict books)</code>
            <p className="mt-1">
              Initializes the LibrarySystem with a dictionary of books and their quantities.
            </p>
          </div>
          <div>
            <code className="text-sm">bool borrowBook(str bookTitle)</code>
            <p className="mt-1">
              Borrows a book by its title if available, otherwise returns false.
            </p>
          </div>
          <div>
            <code className="text-sm">void returnBook(str bookTitle)</code>
            <p className="mt-1">
              Returns a book to the library, increasing its available quantity.
            </p>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Example</h3>
        <pre className="bg-secondary p-4 rounded-md whitespace-pre-wrap break-words overflow-x-auto">
          <code>
{`// Initialize library with 2 copies of 'BookA' and 1 copy of 'BookB'
const library = new LibrarySystem({'BookA': 2, 'BookB': 1});
library.borrowBook('BookA'); // returns true
library.borrowBook('BookA'); // returns true
library.borrowBook('BookA'); // returns false
library.borrowBook('BookB'); // returns true
library.returnBook('BookA');
library.borrowBook('BookA'); // returns true`}
          </code>
        </pre>
      </div>
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Constraints</h3>
        <ul className="space-y-2 text-muted-foreground list-disc pl-4">
          <li>0 ≤ quantity of each book ≤ 1000</li>
          <li>At most 1000 calls will be made to borrowBook and returnBook combined</li>
        </ul>
      </div>
    </div>
  );
};

export default LibrarySystemContent;
```