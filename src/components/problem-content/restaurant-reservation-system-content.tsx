import React from 'react';

const RestaurantReservationContent: React.FC = () => {
    return (
        <div className="prose prose-invert max-w-none">
            <div>
                <p className="text-muted-foreground">
                    Design a reservation system for a restaurant. The system should be able to handle table reservations, cancellations, and availability checks. Each table in the restaurant can have at most one reservation at any time.
                </p>
            </div>
            <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Methods</h3>
                <div className="space-y-4 text-muted-foreground">
                    <div>
                        <code className="text-sm">RestaurantReservation()</code>
                        <p className="mt-1">
                            Initializes the reservation system with no reservations.
                        </p>
                    </div>
                    <div>
                        <code className="text-sm">bool makeReservation(int tableId, string name)</code>
                        <p className="mt-1">
                            Attempts to reserve a table with the specified tableId for the customer with the given name. Returns true if the reservation is successful, otherwise false.
                        </p>
                    </div>
                    <div>
                        <code className="text-sm">bool cancelReservation(int tableId)</code>
                        <p className="mt-1">
                            Cancels the reservation for the specified tableId. Returns true if the cancellation is successful, otherwise false.
                        </p>
                    </div>
                    <div>
                        <code className="text-sm">bool checkAvailability(int tableId)</code>
                        <p className="mt-1">
                            Checks the availability of the table with the specified tableId. Returns true if the table is available, otherwise false.
                        </p>
                    </div>
                </div>
            </div>
            <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Example</h3>
                <pre className="bg-secondary p-4 rounded-md whitespace-pre-wrap break-words overflow-x-auto">
                    <code>
{`const restaurant = new RestaurantReservation();
restaurant.makeReservation(1, "John"); // returns true (reserves table 1 for John)
restaurant.checkAvailability(1); // returns false (table 1 is now reserved)
restaurant.cancelReservation(1); // returns true (cancels reservation for table 1)
restaurant.checkAvailability(1); // returns true (table 1 is now available)`}
                    </code>
                </pre>
            </div>
            <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Constraints</h3>
                <ul className="space-y-2 text-muted-foreground list-disc pl-4">
                    <li>0 ≤ tableId ≤ 1000</li>
                    <li>The name is a valid non-empty string</li>
                    <li>At most 1000 calls will be made to makeReservation, cancelReservation, and checkAvailability</li>
                </ul>
            </div>
        </div>
    );
};

export default RestaurantReservationContent;