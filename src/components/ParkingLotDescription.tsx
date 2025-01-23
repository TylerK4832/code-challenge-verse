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
          Design and implement a parking lot system that can efficiently manage multiple levels of parking spaces for different types of vehicles.
          The system should handle parking and retrieval of vehicles while maintaining optimal space utilization.
        </p>

        <h3>Requirements:</h3>
        <ul>
          <li>The parking lot should have multiple levels, each with multiple parking spots</li>
          <li>The system should support different types of vehicles (Motorcycle, Car, Bus)</li>
          <li>Each vehicle type requires different parking space sizes</li>
          <li>The system should be able to find the nearest available parking spot for a given vehicle</li>
          <li>Implement parking fee calculation based on duration of parking</li>
        </ul>

        <h3>Example:</h3>
        <pre className="bg-secondary p-4 rounded-md whitespace-pre-wrap break-words overflow-auto">
          <code>
{`Input: 
parkingLot.parkVehicle(new Car("ABC-123"))
parkingLot.parkVehicle(new Motorcycle("XYZ-789"))
parkingLot.removeVehicle("ABC-123")

Output:
"Parked car ABC-123 on Level 1, Spot 3"
"Parked motorcycle XYZ-789 on Level 1, Spot 1"
"Vehicle ABC-123 removed. Fee: $15"`}
          </code>
        </pre>

        <h3>Constraints:</h3>
        <ul>
          <li>1 ≤ number of levels ≤ 5</li>
          <li>1 ≤ spots per level ≤ 100</li>
          <li>Vehicle IDs are unique strings</li>
          <li>Parking duration is measured in hours</li>
          <li>The system should handle concurrent parking operations efficiently</li>
        </ul>

        <h3>Note:</h3>
        <p>
          Focus on object-oriented design principles and ensure your implementation is extensible for future requirements.
          Consider edge cases such as full parking lots, invalid vehicle types, and error handling.
        </p>
      </div>
    </div>
  );
};

export default ParkingLotDescription;