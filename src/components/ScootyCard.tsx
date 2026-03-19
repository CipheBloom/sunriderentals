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
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <CardHeader className="p-0">
          <div className="relative">
            <img
              src={scooty.image}
              alt={scooty.name}
              className="w-full h-48 object-cover"
            />
            <div className="absolute top-2 right-2">
              <Badge variant="secondary" className="bg-white/90">
                {isRider && scooty.riderPricePerDay ? (
                  <span>
                    <span className="line-through text-gray-400 text-xs">₹{scooty.pricePerDay}</span>
                    <span className="text-green-600 ml-1">₹{scooty.riderPricePerDay}/day</span>
                  </span>
                ) : (
                  `₹${scooty.pricePerDay}/day`
                )}
              </Badge>
            </div>
            {isRider && (
              <div className="absolute top-2 left-2">
                <Badge className="bg-green-600 text-white">Rider Price</Badge>
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="p-4">
          <CardTitle className="text-lg mb-2">{scooty.name}</CardTitle>
          <p className="text-gray-600 text-sm mb-4">
            {scooty.description}
          </p>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-2 text-sm">
              <Gauge className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{scooty.specs.engine}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Fuel className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{scooty.specs.mileage}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-lg font-bold text-blue-600">
                ₹{displayPrice}
              </span>
              {isRider && scooty.riderPricePerDay && (
                <span className="text-xs text-green-600">Rider discount applied!</span>
              )}
            </div>
            <Badge variant={scooty.available ? 'default' : 'secondary'}>
              {scooty.available ? 'Available' : 'Unavailable'}
            </Badge>
          </div>
        </CardContent>
        
        <CardFooter className="p-4 pt-0">
          <Button 
            onClick={handleBookClick}
            disabled={!scooty.available}
            className="w-full"
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
