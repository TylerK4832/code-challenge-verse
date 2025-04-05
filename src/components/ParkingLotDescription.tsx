import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Separator } from '@/components/ui/separator';

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
    <div className="space-y-6">
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
        <div>
          <h3 className="text-lg font-semibold mb-2">Overview</h3>
          <p className="text-muted-foreground">
            Design a system for a parking lot with three types of parking spaces: big, medium, and small.
            The system should efficiently manage a fixed number of slots for each size and handle parking requests based on vehicle size.
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
              <code className="text-sm">addCar(int carType)</code>
              <p className="mt-1">
                Checks whether there is a parking space of carType for the car that wants to enter the parking lot. carType can be of three kinds: big, medium, or small, which are represented by 1, 2, and 3 respectively. A car can only park in a parking space of its carType. If there is no space available, return false, else park the car in that size space and return true.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Example</h3>
          <pre className="bg-secondary p-4 rounded-md whitespace-pre-wrap break-words overflow-x-auto">
            <code>
{`// Initialize parking system with 2 big spots, 2 medium spots, and 1 small spot
const parkingSystem = new ParkingSystem(2, 2, 1);

parkingSystem.addCar(1);  // returns true (parks a big car)
parkingSystem.addCar(2);  // returns true (parks a medium car)
parkingSystem.addCar(3);  // returns true (parks a small car)
parkingSystem.addCar(1);  // returns true (parks another big car)
parkingSystem.addCar(3);  // returns false (no small spots left)
parkingSystem.addCar(2);  // returns true (parks another medium car)
parkingSystem.addCar(2);  // returns false (no medium spots left)`}
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
    </div>
  );
};

export default ParkingLotDescription;