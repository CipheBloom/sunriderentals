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
      <div className="container py-12 text-center">
        <p className="text-gray-500 mb-4">You are not approved as a rider yet.</p>
        {isChecking ? (
          <p className="text-sm text-gray-400">Checking application status...</p>
        ) : (
          <>
            <Link to="/rider-apply" className="text-blue-500 hover:underline">
              Apply to become a rider
            </Link>
            <p className="text-sm text-gray-400 mt-4">
              Already approved? <button onClick={() => window.location.reload()} className="text-blue-500 underline">Refresh page</button>
            </p>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="container py-8 px-4 md:px-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-3xl font-bold">Rider Dashboard</h1>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg border-2 border-green-400">
            <Bike className="w-4 h-4 mr-1" />
            Rider
          </span>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Deliveries</CardTitle>
              <Bike className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Completed deliveries</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹0</div>
              <p className="text-xs text-muted-foreground">Total earnings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5.0</div>
              <p className="text-xs text-muted-foreground">Average rating</p>
            </CardContent>
          </Card>
        </div>

        {/* Welcome Message */}
        <Card>
          <CardHeader>
            <CardTitle>Welcome, {user.name}!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              You are now an approved rider for SunRide Rentals. You can start accepting delivery requests 
              and earning money. Your rider dashboard will show delivery requests and earnings here.
            </p>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Status:</strong> Approved Rider
              </p>
              <p className="text-sm text-blue-800">
                <strong>Application Status:</strong> Confirmed
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
