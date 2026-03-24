import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Bike, IndianRupee, Plus, Ban } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { bookingAPI, type BookingData } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

export function Dashboard() {
  const { isAuthenticated, user } = useAuth();
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch bookings from MongoDB
  useEffect(() => {
    if (user) {
      const fetchBookings = async () => {
        try {
          setIsLoading(true);
          const userBookings = await bookingAPI.getByUser(user.id);
          setBookings(userBookings);
        } catch (error) {
          console.error('❌ Failed to fetch bookings:', error);
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchBookings();
    }
  }, [user]);

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    
    try {
      await bookingAPI.update(bookingId, { status: 'cancelled' });
      console.log('✅ Booking cancelled in MongoDB');
      
      // Refresh bookings
      if (user) {
        const userBookings = await bookingAPI.getByUser(user.id);
        setBookings(userBookings);
      }
    } catch (error) {
      console.error('❌ Failed to cancel booking:', error);
      alert('Failed to cancel booking. Please try again.');
    }
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-blue-100 py-8 px-4 md:px-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-black">My Bookings</h1>
            <p className="text-black font-medium mt-1">Manage your scooter rentals</p>
          </div>
          <Link to="/scooty">
            <Button className="font-black">
              <Plus className="w-4 h-4 mr-2" />
              New Booking
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-black text-black">Total Bookings</CardTitle>
              <div className="w-8 h-8 border-2 border-black bg-blue-100 flex items-center justify-center">
                <Calendar className="h-4 w-4 text-black" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-black">{bookings.length}</div>
            </CardContent>
          </Card>
          
          <Card className="border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-black text-black">Active Rentals</CardTitle>
              <div className="w-8 h-8 border-2 border-black bg-green-100 flex items-center justify-center">
                <Bike className="h-4 w-4 text-black" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-black">{bookings.filter(b => b.status === 'confirmed').length}</div>
            </CardContent>
          </Card>
          
          <Card className="border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-black text-black">Total Spent</CardTitle>
              <div className="w-8 h-8 border-2 border-black bg-purple-100 flex items-center justify-center">
                <IndianRupee className="h-4 w-4 text-black" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-black">₹{bookings.filter(b => b.status !== 'cancelled').reduce((sum, b) => sum + (b.totalPrice || 0), 0)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Bookings List */}
        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <CardHeader>
            <CardTitle className="font-black text-black">Recent Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mx-auto"></div>
                <p className="text-black mt-4 font-bold">Loading bookings...</p>
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex p-4 border-4 border-black bg-blue-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-4">
                  <Bike className="h-8 w-8 text-black" />
                </div>
                <p className="text-black font-bold text-lg">No bookings yet</p>
                <p className="text-black font-medium mt-2">Start your adventure today!</p>
                <Link to="/scooty">
                  <Button className="mt-4 font-black">
                    Browse Scooters
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div key={booking.id} className="flex items-center gap-4 p-4 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <div className="w-16 h-12 bg-blue-100 border-2 border-black flex items-center justify-center">
                      <Bike className="w-6 h-6 text-black" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-black">{booking.vehicleName || 'Unknown Vehicle'}</p>
                      <p className="text-sm text-black font-medium">
                        {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right flex flex-col items-end gap-2">
                      <p className="font-bold text-black">₹{booking.totalPrice}</p>
                      <Badge 
                        variant={
                          booking.status === 'confirmed' ? 'default' :
                          booking.status === 'pending' ? 'secondary' :
                          booking.status === 'cancelled' ? 'destructive' :
                          'outline'
                        }
                        className="font-bold"
                      >
                        {booking.status}
                      </Badge>
                      {booking.status === 'confirmed' || booking.status === 'pending' && (
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleCancelBooking(booking.id)}
                        >
                          <Ban className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
