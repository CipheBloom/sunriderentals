import { useAuth } from '@/contexts/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bike, DollarSign, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { riderApplicationAPI } from '@/lib/api';

export function RiderPage() {
  const { user, isAuthenticated } = useAuth();
  const [isChecking, setIsChecking] = useState(false);

  // Check if user has been approved but isRider is not updated
  useEffect(() => {
    const checkRiderStatus = async () => {
      if (!user?.isRider && user?.id) {
        setIsChecking(true);
        try {
          const application = await riderApplicationAPI.getByUserId(user.id);
          if (application?.status === 'approved') {
            // Refresh user data to get updated isRider status
            window.location.reload();
          }
        } catch (error) {
          console.error('Failed to check rider status:', error);
        } finally {
          setIsChecking(false);
        }
      }
    };
    checkRiderStatus();
  }, [user]);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!user?.isRider) {
    return (
      <div className="min-h-screen bg-blue-100 flex items-center justify-center p-4">
        <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 text-center max-w-md">
          <div className="inline-flex p-4 border-4 border-black bg-yellow-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-4">
            <Bike className="h-8 w-8 text-black" />
          </div>
          <p className="text-black text-lg font-bold mb-4">You are not approved as a rider yet.</p>
          {isChecking ? (
            <p className="text-black font-medium">Checking application status...</p>
          ) : (
            <>
              <Link to="/rider-apply" className="inline-block px-6 py-3 border-4 border-black bg-blue-500 text-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-blue-400 transition-colors">
                Apply to become a rider
              </Link>
              <p className="text-black font-medium mt-4">
                Already approved? 
                <button onClick={() => window.location.reload()} className="ml-1 text-blue-600 font-bold underline">Refresh page</button>
              </p>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-100 py-8 px-4 md:px-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-3xl font-black text-black">Rider Dashboard</h1>
          <span className="inline-flex items-center px-4 py-1.5 border-2 border-black bg-green-500 text-black font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <Bike className="w-4 h-4 mr-1" />
            Rider
          </span>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-black text-black">Total Deliveries</CardTitle>
              <div className="w-8 h-8 border-2 border-black bg-blue-100 flex items-center justify-center">
                <Bike className="h-4 w-4 text-black" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-black">0</div>
              <p className="text-xs text-black font-medium mt-1">Completed deliveries</p>
            </CardContent>
          </Card>

          <Card className="border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-black text-black">Earnings</CardTitle>
              <div className="w-8 h-8 border-2 border-black bg-green-100 flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-black" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-black">₹0</div>
              <p className="text-xs text-black font-medium mt-1">Total earnings</p>
            </CardContent>
          </Card>

          <Card className="border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-black text-black">Rating</CardTitle>
              <div className="w-8 h-8 border-2 border-black bg-yellow-100 flex items-center justify-center">
                <Star className="h-4 w-4 text-black" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-black">5.0</div>
              <p className="text-xs text-black font-medium mt-1">Average rating</p>
            </CardContent>
          </Card>
        </div>

        {/* Welcome Message */}
        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <CardHeader>
            <CardTitle className="font-black text-black">Welcome, {user.name}!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-black font-medium leading-relaxed">
              You are now an approved rider for SunRide Rentals. You can start accepting delivery requests 
              and earning money. Your rider dashboard will show delivery requests and earnings here.
            </p>
            <div className="mt-4 p-4 border-4 border-black bg-blue-100">
              <p className="text-sm font-bold text-black">
                <strong>Status:</strong> Approved Rider
              </p>
              <p className="text-sm font-bold text-black">
                <strong>Application Status:</strong> Confirmed
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
