import { useState, useEffect } from 'react';
import { MobileScootyCard } from '@/components/MobileScootyCard';
import { Button } from '@/components/ui/button';
import { vehicleAPI, type VehicleData } from '@/lib/api';
import { Zap, RefreshCw, Bike } from 'lucide-react';

export function ScootyPage() {
  const [scooty, setScooty] = useState<VehicleData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'popular' | 'new'>('popular');

  useEffect(() => {
    loadScootys();
  }, []);

  const loadScootys = async () => {
    try {
      setLoading(true);
      setError('');
      const vehicles = await vehicleAPI.getAvailable();
      console.log('🔍 Loaded vehicles:', vehicles);
      setScooty(vehicles);
    } catch (error) {
      console.error('❌ Error loading vehicles:', error);
      setError('Failed to load vehicles. Please try again.');
      setScooty([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredscooty = scooty;

  // Separate popular and new models
  const popularModels = filteredscooty.filter(s => s.rating && s.rating >= 4.5).slice(0, 6);
  const newModels = filteredscooty.filter(s => s.isNew || (s.year && s.year >= 2024)).slice(0, 6);
  
  // Fallback: if no popular or new models, show all vehicles
  const displayModels = activeTab === 'popular' 
    ? (popularModels.length > 0 ? popularModels : filteredscooty.slice(0, 6))
    : (newModels.length > 0 ? newModels : filteredscooty.slice(0, 6));

  // Debug logging
  console.log('🔍 Debug info:', {
    totalScooty: scooty.length,
    filteredScooty: filteredscooty.length,
    popularModels: popularModels.length,
    newModels: newModels.length,
    activeTab,
    displayModels: displayModels.length
  });


  if (loading) {
    return (
      <div className="min-h-screen bg-blue-200 py-12">
        <div className="container px-4 md:px-6">
          <div className="flex items-center justify-center min-h-[500px]">
            <div className="text-center">
              <div className="relative mx-auto mb-6">
                <div className="w-20 h-20 border-4 border-black border-t-blue-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-blue-400 rounded-full animate-spin delay-75"></div>
              </div>
              <p className="text-black font-black text-lg bg-blue-100 px-6 py-3 border-4 border-black inline-block">LOADING AMAZING RIDES...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-blue-200 py-12">
        <div className="container px-4 md:px-6">
          <div className="text-center py-16">
            <div className="inline-flex p-4 bg-red-100 border-4 border-black mb-4">
              <Zap className="h-8 w-8 text-red-600" />
            </div>
            <p className="text-red-600 font-black mb-6 text-lg bg-red-100 px-4 py-2 border-4 border-black inline-block">{error}</p>
            <Button 
              onClick={loadScootys}
              className="bg-blue-600 hover:bg-blue-700 text-white font-black px-6 py-3 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all uppercase"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              RETRY
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-200 animate-fadeIn">
      {/* Mobile Header */}
      <div className="bg-blue-600 border-4 border-black px-4 py-3 animate-slideDown">
        <h1 className="text-xl font-black text-white">SunRide Rentals</h1>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b-4 border-black animate-slideUp">
        <div className="flex">
          <button
            onClick={() => setActiveTab('popular')}
            className={`flex-1 py-4 text-center font-black text-lg transition-all duration-300 border-r-4 border-black transform hover:scale-105 ${
              activeTab === 'popular'
                ? 'bg-blue-600 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                : 'bg-white text-black hover:bg-blue-100'
            }`}
          >
            MOST POPULAR
          </button>
          <button
            onClick={() => setActiveTab('new')}
            className={`flex-1 py-4 text-center font-black text-lg transition-all duration-300 transform hover:scale-105 ${
              activeTab === 'new'
                ? 'bg-blue-600 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                : 'bg-white text-black hover:bg-blue-100'
            }`}
          >
            NEW MODELS
          </button>
        </div>
      </div>

      {/* Product Grid */}
      <div className="px-4 py-6 pb-24">
        <div className="grid grid-cols-2 gap-4">
          {displayModels.map((scooty, index) => (
            <div key={scooty.id} className="animate-fadeInUp" style={{ animationDelay: `${index * 100}ms` }}>
              <MobileScootyCard scooty={scooty} />
            </div>
          ))}
        </div>

        {displayModels.length === 0 && !loading && !error && (
          <div className="text-center py-16 animate-bounceIn">
            <div className="inline-block p-6 bg-blue-600 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-4 animate-pulse">
              <Bike className="h-12 w-12 text-white" />
            </div>
            <p className="text-black font-black text-xl bg-blue-100 px-6 py-3 border-4 border-black inline-block mb-4">NO VEHICLES AVAILABLE</p>
            <p className="text-black font-bold mb-4">
              {scooty.length === 0 ? 'No vehicles found in database' : 
               activeTab === 'popular' ? 'No vehicles with 4.5+ rating found' : 
               'No new models (2024+) found'}
            </p>
            {scooty.length > 0 && (
              <Button 
                onClick={() => setActiveTab(activeTab === 'popular' ? 'new' : 'popular')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-black px-6 py-3 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all uppercase"
              >
                {activeTab === 'popular' ? 'VIEW NEW MODELS' : 'VIEW POPULAR MODELS'}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
