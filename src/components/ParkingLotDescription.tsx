import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const ParkingLotDescription = () => {
  const { data: problem, isLoading } = useQuery({
    queryKey: ['problem', 'parking-lot'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('problems')
        .select('title, difficulty')
        .eq('id', 'parking-lot')
        .single();

      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return (
      <div className="p-6 animate-pulse">
        <div className="h-8 bg-muted rounded w-48 mb-4"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{problem?.title}</h1>
        <Badge className={`${
          problem?.difficulty === 'Easy' ? 'bg-green-500' :
          problem?.difficulty === 'Medium' ? 'bg-[#ffc01e] text-black' :
          'bg-red-500'
        }`}>
          {problem?.difficulty}
        </Badge>
      </div>

      <div className="prose prose-invert max-w-none">
        <p>
          Design a parking system for a parking lot with three types of parking spaces: big, medium, and small.
          The system should efficiently manage a fixed number of slots for each size and handle parking requests based on vehicle size.
        </p>

        <h3>Requirements:</h3>
        <ul>
          <li>Initialize the parking system with a fixed number of slots for each size (big, medium, small)</li>
          <li>Handle parking requests based on car size (represented by carType: 1 for big, 2 for medium, 3 for small)</li>
          <li>Cars can only park in spaces matching their size</li>
          <li>Return true if parking is successful, false if no space is available</li>
        </ul>

        <h3>Example:</h3>
        <pre className="bg-secondary p-4 rounded-md whitespace-pre-wrap break-words overflow-auto">
          <code>
{`// Initialize parking system with 2 big spots, 2 medium spots, and 1 small spot
const parkingSystem = new ParkingSystem(2, 2, 1);

// Test parking different car types
console.log(parkingSystem.addCar(1));  // returns true (parks a big car)
console.log(parkingSystem.addCar(2));  // returns true (parks a medium car)
console.log(parkingSystem.addCar(3));  // returns true (parks a small car)
console.log(parkingSystem.addCar(1));  // returns true (parks another big car)
console.log(parkingSystem.addCar(3));  // returns false (no small spots left)
console.log(parkingSystem.addCar(2));  // returns true (parks another medium car)
console.log(parkingSystem.addCar(2));  // returns false (no medium spots left)`}
          </code>
        </pre>

        <h3>Constraints:</h3>
        <ul>
          <li>0 ≤ big, medium, small ≤ 1000</li>
          <li>carType is 1, 2, or 3</li>
          <li>At most 1000 calls will be made to addCar</li>
        </ul>

        <h3>Note:</h3>
        <p>
          Focus on implementing an efficient solution that tracks available spaces for each size category.
          Consider edge cases such as attempting to park when no spaces are available or invalid car types.
        </p>
      </div>
    </div>
  );
};

export default ParkingLotDescription;