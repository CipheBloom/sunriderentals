import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, MapPin, Edit2, Camera, LogOut, Bike, Calendar, IndianRupee, Ban } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { bookingAPI, riderApplicationAPI, type BookingData, type RiderApplicationData } from '@/lib/api';

export function ProfilePage() {
  const { user, isAuthenticated, logout, getAvatarUrl, updateUserProfile } = useAuth();
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
          console.log('🔄 Fetching bookings for user:', user.id, 'with email:', user.email);
          const userBookings = await bookingAPI.getByUser(user.id);
          console.log('📋 Bookings fetched:', userBookings);
          console.log('📋 Bookings count:', userBookings.length);
          setBookings(userBookings);
        } catch (error) {
          console.error('❌ Failed to fetch bookings:', error);
        }
      };
      
      // Fetch rider application status
      const fetchRiderApplication = async () => {
        try {
          // Get user's own application
          console.log('🔄 Fetching rider application for user:', user.id);
          const application = await riderApplicationAPI.getByUserId(user.id);
          console.log('📄 Rider application fetched:', application);
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
        <p className="text-slate-400 mb-4">Please sign in to view your profile</p>
        <Button onClick={() => navigate('/login')}>Sign In</Button>
      </div>
    );
  }

  const handleSaveProfile = async () => {
    if (user) {
      setIsLoading(true);
      try {
        await updateUserProfile({ phone, address });
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
    <div className="min-h-screen bg-blue-100 py-8 px-4 md:px-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Header - Neobrutalism Style */}
        <Card className="overflow-hidden border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="h-32 bg-blue-500 border-b-4 border-black"></div>
          <CardContent className="p-6 -mt-16">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Profile Image */}
              <div className="relative">
                <div className="p-1 bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                  <img
                    src={getAvatarUrl()}
                    alt={user?.name}
                    className="w-32 h-32 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || '')}&size=128&background=3b82f6&color=000`;
                    }}
                  />
                </div>
                <button className="absolute bottom-2 right-2 p-2.5 bg-blue-500 text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all">
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              {/* User Info */}
              <div className="flex-1 text-center md:text-left pt-2 md:pt-16">
                <div className="flex items-center justify-center md:justify-start gap-3 flex-wrap">
                  <h1 className="text-2xl font-black text-black">{user?.name}</h1>
                  {user?.isRider ? (
                    <span className="inline-flex items-center px-4 py-1.5 border-2 border-black bg-green-500 text-black font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      <Bike className="w-4 h-4 mr-1.5" />
                      Rider
                    </span>
                  ) : riderApplication ? (
                    <span className={`inline-flex items-center px-4 py-1.5 border-2 border-black font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                      riderApplication.status === 'pending' 
                        ? 'bg-yellow-400 text-black'
                        : riderApplication.status === 'rejected'
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-400 text-black'
                    }`}>
                      <Bike className="w-4 h-4 mr-1.5" />
                      {riderApplication.status === 'pending' && 'Pending'}
                      {riderApplication.status === 'rejected' && 'Rejected'}
                      {riderApplication.status === 'approved' && 'Approved'}
                    </span>
                  ) : null}
                </div>
                <div className="flex items-center justify-center md:justify-start gap-2 mt-2 text-black font-medium">
                  <Mail className="w-4 h-4" />
                  <span>{user?.email}</span>
                </div>
                <div className="flex gap-3 mt-4 justify-center md:justify-start">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setIsEditing(!isEditing)}
                    className="font-bold"
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={handleLogout}
                    className="font-bold"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats - Neobrutalism Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <div className="h-2 bg-blue-500 border-b-2 border-black"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-black text-black">Total Bookings</CardTitle>
              <div className="w-8 h-8 border-2 border-black bg-blue-100 flex items-center justify-center">
                <Bike className="h-4 w-4 text-black" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-black">{bookings.length}</div>
              <p className="text-xs text-black font-medium mt-1">All time bookings</p>
            </CardContent>
          </Card>
          
          <Card className="border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <div className="h-2 bg-green-500 border-b-2 border-black"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-black text-black">Active Rentals</CardTitle>
              <div className="w-8 h-8 border-2 border-black bg-green-100 flex items-center justify-center">
                <Calendar className="h-4 w-4 text-black" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-black">{activeBookings}</div>
              <p className="text-xs text-black font-medium mt-1">Currently active</p>
            </CardContent>
          </Card>
          
          <Card className="border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <div className="h-2 bg-purple-500 border-b-2 border-black"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-black text-black">Total Spent</CardTitle>
              <div className="w-8 h-8 border-2 border-black bg-purple-100 flex items-center justify-center">
                <IndianRupee className="h-4 w-4 text-black" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-black">₹{totalSpent}</div>
              <p className="text-xs text-black font-medium mt-1">Lifetime spending</p>
            </CardContent>
          </Card>
        </div>

        {/* Profile Details */}
        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <CardHeader>
            <CardTitle className="font-black text-black">Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-bold text-black">Phone Number</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Phone className="w-4 h-4 text-black" />
                    <input
                      type="tel"
                      ref={phoneInputRef}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="flex-1 p-2 border-4 border-black bg-white text-black font-medium shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-bold text-black">Address</label>
                  <div className="flex items-start gap-2 mt-1">
                    <MapPin className="w-4 h-4 text-black mt-2" />
                    <textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Enter your address"
                      rows={3}
                      className="flex-1 p-2 border-4 border-black bg-white text-black font-medium shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={handleSaveProfile} 
                    disabled={isLoading}
                    className="font-bold"
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)} className="font-bold">Cancel</Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-black" />
                  <div>
                    <p className="text-sm text-black font-medium">Phone</p>
                    <p className="font-bold text-black">{phone || 'Not added'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-black mt-1" />
                  <div>
                    <p className="text-sm text-black font-medium">Address</p>
                    <p className="font-bold text-black">{address || 'Not added'}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Bookings */}
        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <CardHeader>
            <CardTitle className="font-black text-black">Recent Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="inline-flex items-center gap-3 px-4 py-3 border-4 border-black bg-blue-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <div className="w-6 h-6 border-4 border-black border-t-blue-500 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-spin"></div>
                  <p className="text-black font-bold">Loading bookings...</p>
                </div>
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-8">
                <div className="inline-flex items-center gap-3 px-4 py-3 border-4 border-black bg-yellow-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <Bike className="w-6 h-6 text-black" />
                  <p className="text-black font-bold">No bookings yet</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {bookings.slice(0, 3).map((booking) => {
                  const canCancel = booking.status === 'confirmed' || booking.status === 'pending';
                  return (
                    <div key={booking.id} className="flex items-center gap-4 p-3 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                      <div className="w-16 h-12 bg-blue-100 border-2 border-black flex items-center justify-center">
                        <Bike className="w-6 h-6 text-black" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-black">{booking.vehicleName || 'Unknown Vehicle'}</p>
                        <p className="text-sm text-black font-medium">
                          {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right flex flex-col items-end gap-1">
                        <p className="font-bold text-black">₹{booking.totalPrice}</p>
                        <span className={`text-xs px-2 py-1 border-2 border-black font-bold ${
                          booking.status === 'confirmed' ? 'bg-green-100 text-black' :
                          booking.status === 'pending' ? 'bg-yellow-100 text-black' :
                          booking.status === 'cancelled' ? 'bg-red-100 text-black' :
                          'bg-gray-100 text-black'
                        }`}>
                          {booking.status}
                        </span>
                        {canCancel && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-red-600 hover:text-red-700 h-6 px-2 text-xs font-bold"
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
