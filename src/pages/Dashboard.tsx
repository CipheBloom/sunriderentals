import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar, Bike, IndianRupee, Clock, CheckCircle, XCircle, AlertCircle, Ban } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { bookingAPI, type BookingData } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const statusConfig = {
  confirmed: { color: 'bg-blue-300 text-black', icon: CheckCircle },
  pending: { color: 'bg-blue-200 text-black', icon: Clock },
  completed: { color: 'bg-blue-400 text-black', icon: CheckCircle },
  cancelled: { color: 'bg-red-100 text-red-600', icon: XCircle },
};

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
    <div className="container py-8 px-4 md:px-6 bg-blue-200 min-h-screen">
      <div className="flex flex-col space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-black">MY BOOKINGS</h1>
            <p className="text-black font-bold text-lg bg-blue-100 p-3 border-4 border-black inline-block">
              Manage your bike rentals and view your booking history
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-black text-black">TOTAL BOOKINGS</CardTitle>
              <div className="p-2 bg-blue-600 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <Bike className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-black">{bookings.length}</div>
            </CardContent>
          </Card>
          <Card className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-black text-black">ACTIVE RENTALS</CardTitle>
              <div className="p-2 bg-blue-600 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <Calendar className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-black">
                {bookings.filter(b => b.status === 'confirmed').length}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-black text-black">TOTAL SPENT</CardTitle>
              <div className="p-2 bg-blue-600 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <IndianRupee className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-black">
                ₹{bookings.filter(b => b.status !== 'cancelled').reduce((sum, b) => sum + (b.totalPrice || 0), 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bookings List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-black text-black bg-blue-300 inline-block px-4 py-2 border-4 border-black">RECENT BOOKINGS</h2>
          
          {isLoading ? (
            <Card className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <CardContent className="py-8 text-center">
                <p className="text-black font-black text-lg">Loading bookings...</p>
              </CardContent>
            </Card>
          ) : bookings.length === 0 ? (
            <Card className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <CardContent className="py-8 text-center">
                <AlertCircle className="mx-auto h-12 w-12 text-black mb-4" />
                <p className="text-black font-black text-xl mb-4">NO BOOKINGS FOUND</p>
                <a href="/scooty">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white font-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all uppercase">
                    BROWSE SCOOTERS
                  </Button>
                </a>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {bookings.map((booking) => {
                const statusKey = booking.status || 'pending';
                const status = statusConfig[statusKey as keyof typeof statusConfig] || statusConfig.pending;
                const StatusIcon = status.icon;
                const canCancel = booking.status === 'confirmed' || booking.status === 'pending';
                
                return (
                  <Card key={booking.id} className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="w-full md:w-32 h-24 bg-blue-100 border-4 border-black flex items-center justify-center">
                          <Bike className="w-8 h-8 text-black" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-black text-lg text-black">{booking.vehicleName || 'Unknown Vehicle'}</h3>
                            <Badge className={`${status.color} border-2 border-black font-black`}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {statusKey.charAt(0).toUpperCase() + statusKey.slice(1)}
                            </Badge>
                          </div>
                          <p className="text-sm text-black font-bold">
                            Booking ID: #{booking.id.toUpperCase()}
                          </p>
                          <div className="flex flex-wrap gap-4 text-sm">
                            <span className="flex items-center gap-1 text-black font-bold">
                              <Calendar className="h-4 w-4 text-black" />
                              {format(new Date(booking.startDate), 'PP')} - {format(new Date(booking.endDate), 'PP')}
                            </span>
                            <span className="flex items-center gap-1 text-black font-bold">
                              <IndianRupee className="h-4 w-4 text-black" />
                              {booking.totalPrice ?? 0}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          {canCancel && (
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleCancelBooking(booking.id)}
                              className="bg-red-500 hover:bg-red-600 text-white font-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all uppercase"
                            >
                              <Ban className="h-4 w-4 mr-2" />
                              CANCEL
                            </Button>
                          )}
                          {booking.status?.toLowerCase() === 'cancelled' && (
                            <span className="text-sm text-red-600 font-black bg-red-100 px-2 py-1 border-2 border-black">CANCELLED</span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
