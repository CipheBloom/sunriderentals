import type { VehicleData } from '@/lib/api';
import { Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface MobileScootyCardProps {
  scooty: VehicleData;
}

export function MobileScootyCard({ scooty }: MobileScootyCardProps) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const isRider = user?.isRider || false;
  const displayPrice = isRider && scooty.riderPricePerDay 
    ? scooty.riderPricePerDay 
    : scooty.pricePerDay;

  // Convert daily price to weekly price (multiply by 7)
  const weeklyPrice = displayPrice * 7;

  const handleCardClick = () => {
    navigate(`/scooty/${scooty.id}`);
  };

  const renderRating = () => {
    const rating = scooty.rating || 4.5;
    return (
      <div className="flex items-center gap-1 bg-blue-400 border-2 border-black px-2 py-1 transition-transform duration-300 hover:scale-105">
        <Star className="w-3 h-3 fill-black text-black transition-colors duration-300 hover:text-yellow-500" />
        <span className="text-xs font-black text-black">{rating}</span>
      </div>
    );
  };

  return (
    <div 
      onClick={handleCardClick}
      className="bg-white border-4 border-black cursor-pointer hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 hover:-translate-y-1 transform hover:scale-105 animate-fadeInUp"
    >
      {/* Product Image */}
      <div className="aspect-square bg-blue-100 relative border-b-4 border-black overflow-hidden">
        <img
          src={scooty.image}
          alt={scooty.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(scooty.name)}&size=200&background=bfdbfe&color=000000`;
          }}
        />
        {scooty.isNew && (
          <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-black px-2 py-1 border-2 border-black animate-bounce">
            NEW
          </div>
        )}
      </div>
      
      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-black text-lg text-black mb-2 line-clamp-1 transition-colors duration-300 hover:text-blue-600">
          {scooty.name}
        </h3>
        
        <div className="flex items-center justify-between mb-2">
          <div className="bg-blue-600 text-white font-black text-lg px-2 py-1 transition-transform duration-300 hover:scale-105">
            {weeklyPrice}$/WEEK
          </div>
          {renderRating()}
        </div>
      </div>
    </div>
  );
}
