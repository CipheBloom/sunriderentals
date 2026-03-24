import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { vehicleAPI, type VehicleData } from '@/lib/api';
import { ArrowLeft, Star, Heart, Share2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export function ScootyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [scooty, setScooty] = useState<VehicleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState('black');

  useEffect(() => {
    if (id) {
      loadScooty(id);
    }
  }, [id]);

  const loadScooty = async (scootyId: string) => {
    try {
      setLoading(true);
      const vehicles = await vehicleAPI.getAvailable();
      const vehicle = vehicles.find(v => v.id === scootyId);
      setScooty(vehicle || null);
    } catch (error) {
      console.error('Error loading vehicle:', error);
    } finally {
      setLoading(false);
    }
  };

  const isRider = user?.isRider || false;
  const displayPrice = isRider && scooty?.riderPricePerDay 
    ? scooty.riderPricePerDay 
    : scooty?.pricePerDay || 0;

  // Convert daily price to weekly price
  const weeklyPrice = displayPrice * 7;

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!scooty) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Vehicle not found</p>
          <Button onClick={() => navigate('/scooty')} variant="outline">
            Back to Vehicles
          </Button>
        </div>
      </div>
    );
  }

  const renderRating = () => {
    const rating = scooty.rating || 4.5;
    return (
      <div className="flex items-center gap-2 bg-blue-400 border-4 border-black px-3 py-2 inline-block">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-5 h-5 ${
              i < Math.floor(rating)
                ? 'fill-black text-black'
                : 'text-black'
            }`}
          />
        ))}
        <span className="font-black text-black ml-2">{rating}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-blue-200">
      {/* Header */}
      <div className="bg-blue-600 border-b-4 border-black px-4 py-3 flex items-center">
        <button onClick={() => navigate('/scooty')} className="mr-3">
          <ArrowLeft className="w-6 h-6 text-blue-200" />
        </button>
        <h1 className="text-lg font-black text-white flex-1">PRODUCT DETAILS</h1>
        <button className="p-2 bg-blue-300 border-2 border-black -translate-y-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <Heart className="w-5 h-5 text-black" />
        </button>
        <button className="p-2 bg-blue-300 border-2 border-black -translate-y-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ml-2">
          <Share2 className="w-5 h-5 text-black" />
        </button>
      </div>

      {/* Product Image */}
      <div className="bg-blue-100 aspect-square relative border-b-4 border-black">
        <img
          src={scooty.image}
          alt={scooty.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(scooty.name)}&size=400&background=bfdbfe&color=000000`;
          }}
        />
      </div>

      {/* Product Info */}
      <div className="px-4 py-6">
        <h2 className="text-2xl font-black text-black mb-3">{scooty.name}</h2>
        
        {/* Rating */}
        <div className="mb-6">
          {renderRating()}
        </div>

        {/* Description */}
        <div className="bg-white border-4 border-black p-4 mb-6">
          <p className="text-black font-medium leading-relaxed">
            {scooty.description}
          </p>
        </div>

        {/* Color Selection */}
        <div className="mb-6">
          <h3 className="text-lg font-black text-black mb-3 bg-blue-300 inline-block px-3 py-1 border-2 border-black">COLOR</h3>
          <div className="flex gap-4">
            <button
              onClick={() => setSelectedColor('black')}
              className={`w-12 h-12 border-4 border-black transition-all ${
                selectedColor === 'black' ? 'shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-1' : ''
              }`}
              style={{ backgroundColor: 'black' }}
            />
            <button
              onClick={() => setSelectedColor('blue')}
              className={`w-12 h-12 border-4 border-black transition-all ${
                selectedColor === 'blue' ? 'shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-1' : ''
              }`}
              style={{ backgroundColor: '#3b82f6' }}
            />
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mb-6">
          <h3 className="text-lg font-black text-black mb-4 bg-blue-300 inline-block px-3 py-1 border-2 border-black">REVIEWS</h3>
          <div className="space-y-3">
            <div className="bg-white border-4 border-black p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-blue-600 border-2 border-black"></div>
                <span className="font-black text-black">JOHN D.</span>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-black text-black" />
                  ))}
                </div>
              </div>
              <p className="text-black font-medium">Great bike! Smooth ride and excellent condition.</p>
            </div>
            <div className="bg-white border-4 border-black p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-blue-600 border-2 border-black"></div>
                <span className="font-black text-black">SARAH M.</span>
                <div className="flex gap-1">
                  {[...Array(4)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-black text-black" />
                  ))}
                  <Star className="w-4 h-4 text-black" />
                </div>
              </div>
              <p className="text-black font-medium">Very comfortable for daily commuting.</p>
            </div>
          </div>
        </div>

        {/* Specifications */}
        <div className="mb-24">
          <h3 className="text-lg font-black text-black mb-4 bg-blue-300 inline-block px-3 py-1 border-2 border-black">SPECIFICATIONS</h3>
          <div className="bg-white border-4 border-black">
            <div className="flex justify-between py-4 px-4 border-b-4 border-black">
              <span className="font-black text-black">ENGINE</span>
              <span className="font-black text-black">{scooty.specs.engine}</span>
            </div>
            <div className="flex justify-between py-4 px-4 border-b-4 border-black">
              <span className="font-black text-black">WEIGHT</span>
              <span className="font-black text-black">{scooty.specs.weight || 'N/A'}</span>
            </div>
            <div className="flex justify-between py-4 px-4">
              <span className="font-black text-black">MAX SPEED</span>
              <span className="font-black text-black">{scooty.specs.maxSpeed || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-blue-600 border-t-4 border-black px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-black text-blue-200">{weeklyPrice}$/WEEK</div>
            <div className="text-sm font-bold text-blue-100">BEST PRICE GUARANTEED</div>
          </div>
          <Button
            onClick={() => {
              if (isAuthenticated) {
                navigate('/dashboard');
              } else {
                navigate('/login');
              }
            }}
            className="bg-blue-300 hover:bg-blue-400 text-black font-black text-lg px-6 py-4 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all"
          >
            ADD TO CART
          </Button>
        </div>
      </div>
    </div>
  );
}
