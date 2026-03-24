import type { VehicleData } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Fuel, Gauge } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { BookingDialog } from './BookingDialog';
import { useState } from 'react';

interface ScootyCardProps {
  scooty: VehicleData;
}

export function ScootyCard({ scooty }: ScootyCardProps) {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const isRider = user?.isRider || false;
  const displayPrice = isRider && scooty.riderPricePerDay 
    ? scooty.riderPricePerDay 
    : scooty.pricePerDay;

  const handleBookClick = () => {
    if (isAuthenticated) {
      setIsBookingOpen(true);
    } else {
      navigate('/login');
    }
  };

  return (
    <>
      <Card className="overflow-hidden bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 hover-lift">
        <CardHeader className="p-0">
          <div className="relative">
            <img
              src={scooty.image}
              alt={scooty.name}
              className="w-full h-40 md:h-48 object-cover border-b-4 border-black"
            />
            <div className="absolute top-2 right-2">
              <Badge variant="secondary" className="bg-blue-100 text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-xs md:text-sm">
                {isRider && scooty.riderPricePerDay ? (
                  <span>
                    <span className="line-through text-black text-xs">₹{scooty.pricePerDay}</span>
                    <span className="text-black ml-1 font-bold">₹{scooty.riderPricePerDay}/day</span>
                  </span>
                ) : (
                  `₹${scooty.pricePerDay}/day`
                )}
              </Badge>
            </div>
            {isRider && (
              <div className="absolute top-2 left-2">
                <Badge className="bg-green-500 text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-xs md:text-sm">Rider Price</Badge>
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="p-3 md:p-4">
          <CardTitle className="text-base md:text-lg mb-2 font-black text-black">{scooty.name}</CardTitle>
          <p className="text-black text-sm mb-4 font-medium line-clamp-2">
            {scooty.description}
          </p>
          
          <div className="grid grid-cols-2 gap-3 md:gap-4 mb-4">
            <div className="flex items-center gap-2 text-xs md:text-sm border-2 border-black bg-blue-100 p-2">
              <Gauge className="h-4 w-4 text-black" />
              <span className="font-bold text-black">{scooty.specs.engine}</span>
            </div>
            <div className="flex items-center gap-2 text-xs md:text-sm border-2 border-black bg-blue-100 p-2">
              <Fuel className="h-4 w-4 text-black" />
              <span className="font-bold text-black">{scooty.specs.mileage}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-base md:text-lg font-black text-black">
                ₹{displayPrice}
              </span>
              {isRider && scooty.riderPricePerDay && (
                <span className="text-xs text-black font-bold">Rider discount applied!</span>
              )}
            </div>
            <Badge variant={scooty.available ? 'default' : 'secondary'} className="font-bold text-xs md:text-sm">
              {scooty.available ? 'Available' : 'Unavailable'}
            </Badge>
          </div>
        </CardContent>
        
        <CardFooter className="p-3 md:p-4 pt-0">
          <Button 
            onClick={handleBookClick}
            disabled={!scooty.available}
            className="w-full font-black text-sm md:text-base btn-press"
          >
            {scooty.available ? 'Book Now' : 'Unavailable'}
          </Button>
        </CardFooter>
      </Card>
      
      <BookingDialog 
        bike={{...scooty, pricePerDay: displayPrice}} 
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)} 
      />
    </>
  );
}
