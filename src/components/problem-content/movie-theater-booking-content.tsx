// MovieTheaterBookingContent.tsx

import React from 'react';

const MovieTheaterBookingContent: React.FC = () => {
  return (
    <div className="prose prose-invert max-w-none">
      <div>
        <p className="text-muted-foreground">
          Design a movie theater booking system that manages seating arrangements in a theater.
          The system should support booking individual seats, canceling bookings, and booking a block of adjacent seats.
          It must ensure that bookings respect seat availability and contiguity constraints.
        </p>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Methods</h3>
        <div className="space-y-4 text-muted-foreground">
          <div>
            <code className="text-sm">MovieTheaterBooking(int rows, int seatsPerRow)</code>
            <p className="mt-1">
              Initializes the movie theater with the specified number of rows and seats per row.
              All seats start as available.
            </p>
          </div>
          <div>
            <code className="text-sm">bool bookSeat(int row, int seat)</code>
            <p className="mt-1">
              Books a specific seat if it is available.
              Returns true if the booking is successful, otherwise returns false.
            </p>
          </div>
          <div>
            <code className="text-sm">bool cancelBooking(int row, int seat)</code>
            <p className="mt-1">
              Cancels the booking for the specified seat.
              Returns true if successful, or false if the seat was not booked.
            </p>
          </div>
          <div>
            <code className="text-sm">
              list/Vector&lt;pair&gt;/List&lt;int[]&gt; bookAdjacentSeats(int numSeats)
            </code>
            <p className="mt-1">
              Attempts to book a contiguous block of adjacent seats in the same row.
              Returns a list of booked seat positions (each position includes the row and seat number).
              If no such block is available, returns an empty list.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Example</h3>
        <pre className="bg-secondary p-4 rounded-md whitespace-pre-wrap break-words overflow-x-auto">
          <code>
{`// Initialize a theater with 3 rows and 5 seats per row
const theater = new MovieTheaterBooking(3, 5);

theater.bookSeat(1, 3);      // returns true
theater.bookSeat(1, 3);      // returns false (seat already booked)
theater.cancelBooking(1, 3); // returns true
theater.bookAdjacentSeats(3); // might return [[1,1], [1,2], [1,3]] if a contiguous block is available`}
          </code>
        </pre>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Constraints</h3>
        <ul className="space-y-2 text-muted-foreground list-disc pl-4">
          <li>1 ≤ rows, seatsPerRow ≤ 100</li>
          <li>Row and seat numbers are 1-indexed.</li>
          <li>Adjacent booking only considers seats within the same row.</li>
          <li>At most 5000 operations will be performed.</li>
        </ul>
      </div>
    </div>
  );
};

export default MovieTheaterBookingContent;
