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
      <div className="container py-12 text-center bg-blue-200 min-h-screen">
        <p className="text-black font-black mb-4">You are not approved as a rider yet.</p>
        {isChecking ? (
          <p className="text-sm text-black font-bold bg-blue-100 px-4 py-2 border-4 border-black inline-block">Checking application status...</p>
        ) : (
          <>
            <Link to="/rider-apply" className="text-blue-600 hover:text-blue-700 font-black border-2 border-transparent hover:border-blue-300 px-2 py-1 transition-all">
              APPLY TO BECOME A RIDER
            </Link>
            <p className="text-sm text-black font-bold mt-4">
              Already approved? <button onClick={() => window.location.reload()} className="text-blue-600 hover:text-blue-700 border-2 border-transparent hover:border-blue-300 px-1 transition-all">REFRESH PAGE</button>
            </p>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="container py-8 px-4 md:px-6 bg-blue-200 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-4xl font-black text-black">RIDER DASHBOARD</h1>
          <span className="inline-flex items-center px-3 py-1 text-sm font-black bg-blue-600 text-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <Bike className="w-4 h-4 mr-1" />
            RIDER
          </span>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-black text-black">TOTAL DELIVERIES</CardTitle>
              <div className="p-2 bg-blue-600 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <Bike className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-black">0</div>
              <p className="text-xs text-black font-bold">Completed deliveries</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-black text-black">EARNINGS</CardTitle>
              <div className="p-2 bg-blue-600 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <DollarSign className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-black">₹0</div>
              <p className="text-xs text-black font-bold">Total earnings</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-black text-black">RATING</CardTitle>
              <div className="p-2 bg-blue-600 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <Star className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-black">5.0</div>
              <p className="text-xs text-black font-bold">Average rating</p>
            </CardContent>
          </Card>
        </div>

        {/* Welcome Message */}
        <Card className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <CardHeader>
            <CardTitle className="text-2xl font-black text-black">WELCOME, {user.name}!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-black font-bold">
              You are now an approved rider for SunRide Rentals. You can start accepting delivery requests 
              and earning money. Your rider dashboard will show delivery requests and earnings here.
            </p>
            <div className="mt-4 p-4 bg-blue-100 border-4 border-black">
              <p className="text-sm text-black font-black">
                <strong>STATUS:</strong> Approved Rider
              </p>
              <p className="text-sm text-black font-black">
                <strong>APPLICATION STATUS:</strong> Confirmed
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
