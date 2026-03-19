import { useState, useEffect } from 'react';
import { ScootyCard } from '@/components/ScootyCard';
import { Button } from '@/components/ui/button';
import { vehicleAPI, type VehicleData } from '@/lib/api';

export function ScootyPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [scooty, setScooty] = useState<VehicleData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadScootys();
  }, []);

  const loadScootys = async () => {
    try {
      setLoading(true);
      setError('');
      const vehicles = await vehicleAPI.getAvailable();
      setScooty(vehicles);
    } catch (error) {
      console.error('❌ Error loading vehicles:', error);
      setError('Failed to load vehicles. Please try again.');
      setScooty([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredscooty = selectedCategory === 'all' 
    ? scooty 
    : scooty.filter((s: VehicleData) => s.category === selectedCategory);

  const categories = ['all', ...new Set(scooty.map((s: VehicleData) => s.category))];

  if (loading) {
    return (
      <div className="container py-8 px-4 md:px-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading vehicles...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-8 px-4 md:px-6">
        <div className="text-center py-12">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={loadScootys}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 px-4 md:px-6">
      <div className="flex flex-col space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Our Scooters</h1>
          <p className="text-gray-500">
            Choose from our wide selection of premium scooters for rent
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category === 'all' ? 'All Scooters' : category.charAt(0).toUpperCase() + category.slice(1)}
            </Button>
          ))}
        </div>

        {/* Scooty Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredscooty.map((scooty) => (
            <ScootyCard key={scooty.id} scooty={scooty} />
          ))}
        </div>

        {filteredscooty.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No scooters available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}
