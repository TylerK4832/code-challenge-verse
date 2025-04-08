```typescript
import React from 'react';

const TaxiDispatchContent: React.FC = () => {
  return (
    <div className="prose prose-invert max-w-none">
      <div>
        <p className="text-muted-foreground">
          Design a Taxi Dispatch System that manages a fleet of taxis. The
          system should assign taxis to locations based on availability, and
          provide methods to request a taxi and mark taxis as available once
          they finish a ride. The system aims to find the nearest available taxi
          for each request.
        </p>
      </div>
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Methods</h3>
        <div className="space-y-4 text-muted-foreground">
          <div>
            <code className="text-sm">TaxiDispatchSystem(int n_taxis)</code>
            <p className="mt-1">
              Initializes the taxi dispatch system with a specified number of
              taxis, all initially available.
            </p>
          </div>
          <div>
            <code className="text-sm">int requestTaxi(String location)</code>
            <p className="mt-1">
              Dispatches the nearest available taxi to the given location.
              Returns the ID of the taxi or -1 if no taxis are available.
            </p>
          </div>
          <div>
            <code className="text-sm">void finishRide(int taxi_id)</code>
            <p className="mt-1">
              Marks the specified taxi as available once the ride is completed.
            </p>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Example</h3>
        <pre className="bg-secondary p-4 rounded-md whitespace-pre-wrap break-words overflow-x-auto">
          <code>
            {`// Initialize the taxi dispatch system with 3 taxis
const system = new TaxiDispatchSystem(3);
system.requestTaxi("Downtown"); // returns 1
system.requestTaxi("Airport"); // returns 2
system.requestTaxi("Mall"); // returns 3
system.requestTaxi("Station"); // returns -1
system.finishRide(2);
system.requestTaxi("Beach"); // returns 2`}
          </code>
        </pre>
      </div>
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Constraints</h3>
        <ul className="space-y-2 text-muted-foreground list-disc pl-4">
          <li>0 ≤ n_taxis ≤ 1000</li>
          <li>Taxi IDs start from 1</li>
          <li>At most 10000 calls will be made to requestTaxi and finishRide</li>
        </ul>
      </div>
    </div>
  );
};

export default TaxiDispatchContent;