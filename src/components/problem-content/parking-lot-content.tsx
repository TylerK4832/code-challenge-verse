
import React from 'react';

const ParkingLotContent: React.FC = () => {
  return (
    <div className="prose prose-invert max-w-none">
      <div>
        <p className="text-muted-foreground">
          Design a Lot for a parking lot with three types of parking spaces: big, medium, and small.
          The Lot should efficiently manage a fixed number of slots for each size and handle parking requests based on vehicle size.
        </p>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Methods</h3>
        <div className="space-y-4 text-muted-foreground">
          <div>
            <code className="text-sm">ParkingLot(int big, int medium, int small)</code>
            <p className="mt-1">
              Initializes object of the ParkingLot class. The number of slots for each parking space are given as part of the constructor.
            </p>
          </div>
          <div>
            <code className="text-sm">bool addCar(int carType)</code>
            <p className="mt-1">
              Checks whether there is a parking space of carType for the car that wants to enter the parking lot. carType can be of three kinds: big, medium, or small, which are represented by 1, 2, and 3 respectively. A car can only park in a parking space of its carType. If there is no space available, return false, else park the car in a space of the corresponding size and return true.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Example</h3>
        <pre className="bg-secondary p-4 rounded-md whitespace-pre-wrap break-words overflow-x-auto">
          <code>
{`// Initialize parking Lot with 2 big spots, 2 medium spots, and 1 small spot
const parkingLot = new ParkingLot(2, 2, 1);

parkingLot.addCar(1);  // returns true (parks a big car)
parkingLot.addCar(2);  // returns true (parks a medium car)
parkingLot.addCar(3);  // returns true (parks a small car)
parkingLot.addCar(1);  // returns true (parks another big car)
parkingLot.addCar(3);  // returns false (no small spots left)
parkingLot.addCar(2);  // returns true (parks another medium car)
parkingLot.addCar(2);  // returns false (no medium spots left)`}
          </code>
        </pre>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Constraints</h3>
        <ul className="space-y-2 text-muted-foreground list-disc pl-4">
          <li>0 ≤ big, medium, small ≤ 1000</li>
          <li>carType is 1, 2, or 3</li>
          <li>At most 1000 calls will be made to addCar</li>
        </ul>
      </div>
    </div>
  );
};

export default ParkingLotContent;
