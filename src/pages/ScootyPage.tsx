import { useState, useEffect } from 'react';
import { ScootyCard } from '@/components/ScootyCard';
import { Button } from '@/components/ui/button';
import { vehicleAPI, type VehicleData } from '@/lib/api';
import { Zap, Filter, RefreshCw, Bike } from 'lucide-react';

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
      <div className="min-h-screen bg-blue-100 py-12">
        <div className="container px-4 md:px-6">
          <div className="flex items-center justify-center min-h-[500px]">
            <div className="text-center">
              <div className="relative mx-auto mb-6">
                <div className="w-20 h-20 border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"></div>
              </div>
              <p className="text-black text-lg font-bold">Loading amazing rides...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-blue-100 py-12">
        <div className="container px-4 md:px-6">
          <div className="text-center py-16">
            <div className="inline-flex p-4 border-4 border-black bg-red-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-4">
              <Zap className="h-8 w-8 text-black" />
            </div>
            <p className="text-black mb-6 text-lg font-bold">{error}</p>
            <Button 
              onClick={loadScootys}
              className="bg-blue-500 text-black hover:bg-blue-400 font-black"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-100">
      {/* Hero Header */}
      <div className="bg-white relative overflow-hidden py-12 md:py-24 border-b-4 border-black">
        <div className="relative z-10 container px-4 md:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 md:px-4 py-2 border-4 border-black bg-blue-500 text-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-4">
            <Bike className="w-4 h-4" />
            <span className="text-sm md:text-base">Our Fleet</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-black mb-4 px-2">
            Choose Your <span className="text-blue-600">Perfect Ride</span>
          </h1>
          <p className="text-black text-base md:text-lg lg:text-xl max-w-2xl mx-auto font-medium px-4">
            Browse our premium collection of scooters and bikes ready for your next adventure
          </p>
        </div>
      </div>

      <div className="container py-8 md:py-12 px-4 md:px-6 -mt-6 md:-mt-8 relative z-20">
        <div className="flex flex-col space-y-6 md:space-y-8">
          {/* Category Filter */}
          <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-4 md:p-6">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-black" />
              <span className="font-black text-black text-sm md:text-base">Filter by Category</span>
            </div>
            <div className="flex flex-wrap gap-2 md:gap-3">
              {categories.map((category, index) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="font-bold text-sm md:text-base slide-in-left btn-press"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {category === 'all' ? 'All Scooters' : category.charAt(0).toUpperCase() + category.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between px-2">
            <p className="text-black font-bold text-sm md:text-base">
              Showing <span className="font-black">{filteredscooty.length}</span> {filteredscooty.length === 1 ? 'scooter' : 'scooters'}
            </p>
          </div>

          {/* Scooty Grid */}
          <div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredscooty.map((scooty, index) => (
              <div key={scooty.id} className="group fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <ScootyCard scooty={scooty} />
              </div>
            ))}
          </div>

          {filteredscooty.length === 0 && (
            <div className="text-center py-12 md:py-16 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <div className="inline-flex p-4 border-4 border-black bg-blue-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-4">
                <Bike className="h-6 w-6 md:h-8 md:w-8 text-black" />
              </div>
              <p className="text-black text-base md:text-lg font-bold">No scooters available in this category.</p>
              <Button 
                variant="outline" 
                className="mt-4 font-bold text-sm md:text-base"
                onClick={() => setSelectedCategory('all')}
              >
                View All Scooters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
