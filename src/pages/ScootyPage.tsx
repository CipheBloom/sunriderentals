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
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12">
        <div className="container px-4 md:px-6">
          <div className="flex items-center justify-center min-h-[500px]">
            <div className="text-center">
              <div className="relative mx-auto mb-6">
                <div className="w-20 h-20 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-cyan-400 rounded-full animate-spin delay-75"></div>
              </div>
              <p className="text-slate-600 text-lg font-medium">Loading amazing rides...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12">
        <div className="container px-4 md:px-6">
          <div className="text-center py-16">
            <div className="inline-flex p-4 rounded-full bg-red-50 mb-4">
              <Zap className="h-8 w-8 text-red-500" />
            </div>
            <p className="text-red-500 mb-6 text-lg">{error}</p>
            <Button 
              onClick={loadScootys}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-0.5"
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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Header */}
      <div className="bg-slate-900 relative overflow-hidden py-16 md:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-600/20 via-slate-900 to-slate-900"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.02%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')]"></div>
        
        <div className="relative z-10 container px-4 md:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-cyan-400 text-sm font-medium mb-4">
            <Bike className="w-4 h-4" />
            <span>Our Fleet</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">Perfect Ride</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto">
            Browse our premium collection of scooters and bikes ready for your next adventure
          </p>
        </div>
      </div>

      <div className="container py-12 px-4 md:px-6 -mt-8 relative z-20">
        <div className="flex flex-col space-y-8">
          {/* Category Filter */}
          <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-6">
            <div className="flex items-center gap-2 mb-4 text-slate-700">
              <Filter className="w-5 h-5" />
              <span className="font-semibold">Filter by Category</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={`
                    rounded-xl px-6 py-2.5 font-medium transition-all duration-300
                    ${selectedCategory === category 
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40' 
                      : 'border-2 border-slate-200 text-slate-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50'
                    }
                  `}
                >
                  {category === 'all' ? 'All Scooters' : category.charAt(0).toUpperCase() + category.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between">
            <p className="text-slate-600">
              Showing <span className="font-semibold text-slate-900">{filteredscooty.length}</span> {filteredscooty.length === 1 ? 'scooter' : 'scooters'}
            </p>
          </div>

          {/* Scooty Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredscooty.map((scooty) => (
              <div key={scooty.id} className="group">
                <ScootyCard scooty={scooty} />
              </div>
            ))}
          </div>

          {filteredscooty.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl shadow-lg shadow-slate-200/50">
              <div className="inline-flex p-4 rounded-full bg-slate-100 mb-4">
                <Bike className="h-8 w-8 text-slate-400" />
              </div>
              <p className="text-slate-500 text-lg">No scooters available in this category.</p>
              <Button 
                variant="outline" 
                className="mt-4 border-2 border-slate-200 hover:border-blue-400 hover:text-blue-600"
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
