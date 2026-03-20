import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, MapPin, Edit2, Camera, LogOut, Bike, Calendar, IndianRupee, Ban } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { userAPI, bookingAPI, riderApplicationAPI, type BookingData, type RiderApplicationData } from '@/lib/api';

export function ProfilePage() {
  const { user, isAuthenticated, logout, getAvatarUrl } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [riderApplication, setRiderApplication] = useState<RiderApplicationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const phoneInputRef = React.useRef<HTMLInputElement>(null);

  // Load user data and bookings from MongoDB
  useEffect(() => {
    if (user) {
      // Set initial values from user context
      setPhone(user.phone || '');
      setAddress(user.address || '');
      
      // Fetch bookings from MongoDB
      const fetchBookings = async () => {
        try {
          const userBookings = await bookingAPI.getByUser(user.id);
          setBookings(userBookings);
        } catch (error) {
          console.error('❌ Failed to fetch bookings:', error);
        }
      };
      
      // Fetch rider application status
      const fetchRiderApplication = async () => {
        try {
          // Get user's own application
          const application = await riderApplicationAPI.getByUserId(user.id);
          setRiderApplication(application || null);
        } catch (error) {
          console.error('❌ Failed to fetch rider application:', error);
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchBookings();
      fetchRiderApplication();
    }
  }, [user]);

  // Focus phone input when editing starts
  useEffect(() => {
    if (isEditing && phoneInputRef.current) {
      setTimeout(() => {
        phoneInputRef.current?.focus();
        // Open keyboard on mobile devices
        phoneInputRef.current?.click();
      }, 100);
    }
  }, [isEditing]);

  if (!isAuthenticated) {
    return (
      <div className="container py-12 text-center">
        <p className="text-gray-500 mb-4">Please sign in to view your profile</p>
        <Button onClick={() => navigate('/login')}>Sign In</Button>
      </div>
    );
  }

  const handleSaveProfile = async () => {
    if (user) {
      setIsLoading(true);
      try {
        await userAPI.update(user.id, {
          phone,
          address
        });
        console.log('✅ Profile updated in MongoDB');
        setIsEditing(false);
      } catch (error) {
        console.error('❌ Failed to update profile:', error);
        alert('Failed to save profile. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

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

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const totalSpent = bookings.filter(b => b.status !== 'cancelled').reduce((sum, b) => sum + (b.totalPrice || 0), 0);
  const activeBookings = bookings.filter(b => b.status === 'confirmed').length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-8 px-4 md:px-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Header - Modern Glassmorphism */}
        <Card className="overflow-hidden border-0 shadow-xl shadow-slate-200/50 bg-white">
          <div className="h-32 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"></div>
          <CardContent className="p-6 -mt-16">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Profile Image */}
              <div className="relative">
                <div className="p-1 rounded-full bg-white shadow-xl">
                  <img
                    src={getAvatarUrl()}
                    alt={user?.name}
                    className="w-32 h-32 rounded-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || '')}&size=128&background=f97316&color=fff`;
                    }}
                  />
                </div>
                <button className="absolute bottom-2 right-2 p-2.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 shadow-lg transition-all hover:scale-110">
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              {/* User Info */}
              <div className="flex-1 text-center md:text-left pt-2 md:pt-16">
                <div className="flex items-center justify-center md:justify-start gap-3 flex-wrap">
                  <h1 className="text-2xl font-bold text-slate-900">{user?.name}</h1>
                  {user?.isRider ? (
                    <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30">
                      <Bike className="w-4 h-4 mr-1.5" />
                      Rider
                    </span>
                  ) : riderApplication ? (
                    <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold shadow-lg ${
                      riderApplication.status === 'pending' 
                        ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-amber-500/30'
                        : riderApplication.status === 'rejected'
                        ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-red-500/30'
                        : 'bg-gradient-to-r from-slate-400 to-slate-500 text-white'
                    }`}>
                      <Bike className="w-4 h-4 mr-1.5" />
                      {riderApplication.status === 'pending' && 'Pending'}
                      {riderApplication.status === 'rejected' && 'Rejected'}
                      {riderApplication.status === 'approved' && 'Approved'}
                    </span>
                  ) : null}
                </div>
                <div className="flex items-center justify-center md:justify-start gap-2 mt-2 text-slate-500">
                  <Mail className="w-4 h-4" />
                  <span>{user?.email}</span>
                </div>
                <div className="flex gap-3 mt-4 justify-center md:justify-start">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setIsEditing(!isEditing)}
                    className="border-2 border-slate-200 hover:border-blue-400 hover:text-blue-600 rounded-xl"
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 rounded-xl"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats - Modern Gradient Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-0 shadow-lg shadow-blue-200/50 overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-blue-500 to-blue-600"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Total Bookings</CardTitle>
              <div className="p-2 rounded-lg bg-blue-50">
                <Bike className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{bookings.length}</div>
              <p className="text-xs text-slate-500 mt-1">All time bookings</p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg shadow-emerald-200/50 overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-emerald-500 to-teal-600"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Active Rentals</CardTitle>
              <div className="p-2 rounded-lg bg-emerald-50">
                <Calendar className="h-4 w-4 text-emerald-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{activeBookings}</div>
              <p className="text-xs text-slate-500 mt-1">Currently active</p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg shadow-purple-200/50 overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-purple-500 to-violet-600"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Total Spent</CardTitle>
              <div className="p-2 rounded-lg bg-purple-50">
                <IndianRupee className="h-4 w-4 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">₹{totalSpent}</div>
              <p className="text-xs text-slate-500 mt-1">Lifetime spending</p>
            </CardContent>
          </Card>
        </div>

        {/* Profile Details */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Phone Number</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      ref={phoneInputRef}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="flex-1 p-2 border rounded-md"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Address</label>
                  <div className="flex items-start gap-2 mt-1">
                    <MapPin className="w-4 h-4 text-gray-400 mt-2" />
                    <textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Enter your address"
                      rows={3}
                      className="flex-1 p-2 border rounded-md"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                  onClick={handleSaveProfile} 
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{phone || 'Not added'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="font-medium">{address || 'Not added'}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Bookings */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-gray-500 text-center py-4">Loading bookings...</p>
            ) : bookings.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No bookings yet</p>
            ) : (
              <div className="space-y-3">
                {bookings.slice(0, 3).map((booking) => {
                  const canCancel = booking.status === 'confirmed' || booking.status === 'pending';
                  return (
                    <div key={booking.id} className="flex items-center gap-4 p-3 bg-muted rounded-lg">
                      <div className="w-16 h-12 bg-gray-200 rounded flex items-center justify-center">
                        <Bike className="w-6 h-6 text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{booking.vehicleName || 'Unknown Vehicle'}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right flex flex-col items-end gap-1">
                        <p className="font-semibold">₹{booking.totalPrice}</p>
                        <span className={`text-xs px-2 py-1 rounded ${
                          booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {booking.status}
                        </span>
                        {canCancel && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 h-6 px-2 text-xs"
                            onClick={() => handleCancelBooking(booking.id)}
                          >
                            <Ban className="h-3 w-3 mr-1" />
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
