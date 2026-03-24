import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Bike,
  Calendar,
  IndianRupee,
  LogOut,
  CheckCircle,
  Clock,
  Ban,
  Check,
  Search,
  Plus,
  Trash2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { VehicleEditDialog } from '@/components/VehicleEditDialog';
import { adminAPI, type AdminStats, type BookingData, type UserData, type VehicleData, type RiderApplicationData } from '@/lib/api';

const statusConfig = {
  confirmed: { color: 'bg-green-100 text-black border-2 border-black', icon: CheckCircle },
  pending: { color: 'bg-yellow-100 text-black border-2 border-black', icon: Clock },
  active: { color: 'bg-blue-100 text-black border-2 border-black', icon: CheckCircle },
  completed: { color: 'bg-gray-100 text-black border-2 border-black', icon: CheckCircle },
  cancelled: { color: 'bg-red-100 text-black border-2 border-black', icon: Ban },
};

export function AdminDashboardPage() {
  const navigate = useNavigate();
  const { logout, isAdminAuthenticated } = useAdminAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [users, setUsers] = useState<UserData[]>([]);
  const [vehicles, setVehicles] = useState<VehicleData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [riderApplications, setRiderApplications] = useState<RiderApplicationData[]>([]);
  const [editingVehicle, setEditingVehicle] = useState<VehicleData | null>(null);
  const [isVehicleDialogOpen, setIsVehicleDialogOpen] = useState(false);
  const [isNewVehicle, setIsNewVehicle] = useState(false);

  useEffect(() => {
    if (!isAdminAuthenticated) {
      navigate('/admin/login');
      return;
    }
    loadData();
  }, [isAdminAuthenticated, navigate]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Load each endpoint sequentially
      const statsData = await adminAPI.getStats();
      setStats(statsData);
      
      const bookingsData = await adminAPI.getAllBookings();
      setBookings(bookingsData);
      
      const usersData = await adminAPI.getAllUsers();
      setUsers(usersData);
      
      const vehiclesData = await adminAPI.getAllVehicles();
      setVehicles(vehiclesData);
      
      const riderAppsData = await adminAPI.getAllRiderApplications();
      setRiderApplications(riderAppsData);
      
    } catch (error) {
      console.error('❌ Failed to load admin data:', error);
      console.error('❌ Error details:', error instanceof Error ? error.message : String(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateBookingStatus = async (bookingId: string, status: string) => {
    try {
      await adminAPI.updateBookingStatus(bookingId, status);
      // Refresh bookings
      const updatedBookings = await adminAPI.getAllBookings();
      setBookings(updatedBookings);
      // Refresh stats
      const updatedStats = await adminAPI.getStats();
      setStats(updatedStats);
    } catch (error) {
      console.error('❌ Failed to update booking status:', error);
      alert('Failed to update status');
    }
  };

  const handleToggleVehicleAvailability = async (vehicleId: string, currentAvailable: boolean) => {
    try {
      await adminAPI.updateVehicleAvailability(vehicleId, !currentAvailable);
      const updatedVehicles = await adminAPI.getAllVehicles();
      setVehicles(updatedVehicles);
    } catch (error) {
      console.error('❌ Failed to update vehicle availability:', error);
      alert('Failed to update availability');
    }
  };

  const handleEditVehicle = (vehicle: VehicleData) => {
    setEditingVehicle(vehicle);
    setIsNewVehicle(false);
    setIsVehicleDialogOpen(true);
  };

  const handleAddNewVehicle = () => {
    setEditingVehicle(null);
    setIsNewVehicle(true);
    setIsVehicleDialogOpen(true);
  };

  const handleSaveVehicle = async (vehicle: VehicleData) => {
    try {
      if (isNewVehicle) {
        await adminAPI.createVehicle(vehicle);
      } else {
        await adminAPI.updateVehicle(vehicle.id, vehicle);
      }
      const updatedVehicles = await adminAPI.getAllVehicles();
      setVehicles(updatedVehicles);
      const updatedStats = await adminAPI.getStats();
      setStats(updatedStats);
    } catch (error) {
      console.error('❌ Failed to save vehicle:', error);
      alert('Failed to save vehicle');
    }
  };

  const handleDeleteVehicle = async (vehicleId: string) => {
    if (!confirm('Are you sure you want to delete this vehicle?')) return;
    try {
      await adminAPI.deleteVehicle(vehicleId);
      const updatedVehicles = await adminAPI.getAllVehicles();
      setVehicles(updatedVehicles);
      const updatedStats = await adminAPI.getStats();
      setStats(updatedStats);
    } catch (error) {
      console.error('❌ Failed to delete vehicle:', error);
      alert('Failed to delete vehicle');
    }
  };

  const handleUpdateRiderApplicationStatus = async (appId: string, status: string, adminNotes?: string) => {
    try {
      await adminAPI.updateRiderApplicationStatus(appId, status, adminNotes);
      // Refresh applications and users to get updated status
      const updatedApps = await adminAPI.getAllRiderApplications();
      setRiderApplications(updatedApps);
      
      // Also refresh users to get updated rider status (backend handles this automatically)
      const updatedUsers = await adminAPI.getAllUsers();
      setUsers(updatedUsers);
    } catch (error) {
      console.error('❌ Failed to update rider application status:', error);
      alert('Failed to update status');
    }
  };

  const handleDeleteRiderApplication = async (appId: string) => {
    if (!confirm('Are you sure you want to delete this application?')) return;
    try {
      await adminAPI.deleteRiderApplication(appId);
      const updatedApps = await adminAPI.getAllRiderApplications();
      setRiderApplications(updatedApps);
    } catch (error) {
      console.error('❌ Failed to delete rider application:', error);
      alert('Failed to delete application');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const filteredBookings = bookings.filter((b) =>
    b.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.vehicleName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.userId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.userEmail?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUsers = users.filter((u) =>
    u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isAdminAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-blue-100">
      {/* Header */}
      <header className="bg-white border-b-4 border-black shadow-[0_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 border-4 border-black bg-blue-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-black" />
            </div>
            <div>
              <h1 className="text-xl font-black text-black">Admin Dashboard</h1>
              <p className="text-sm font-bold text-black">SunRide Rentals Management</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout} className="gap-2 font-bold">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 max-w-3xl mb-6 border-4 border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <TabsTrigger value="overview" className="font-black text-black hover:bg-blue-100">Overview</TabsTrigger>
            <TabsTrigger value="bookings" className="font-black text-black hover:bg-blue-100">Bookings</TabsTrigger>
            <TabsTrigger value="users" className="font-black text-black hover:bg-blue-100">Users</TabsTrigger>
            <TabsTrigger value="vehicles" className="font-black text-black hover:bg-blue-100">Vehicles</TabsTrigger>
            <TabsTrigger value="riders" className="font-black text-black hover:bg-blue-100">Riders</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mx-auto"></div>
                <p className="text-black font-bold mt-4">Loading...</p>
              </div>
            ) : stats ? (
              <>
                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Card className="border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-black text-black">Total Bookings</CardTitle>
                      <div className="w-8 h-8 border-2 border-black bg-blue-100 flex items-center justify-center">
                        <Calendar className="h-4 w-4 text-black" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-black text-black">{stats.totalBookings}</div>
                    </CardContent>
                  </Card>
                  <Card className="border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-black text-black">Total Users</CardTitle>
                      <div className="w-8 h-8 border-2 border-black bg-green-100 flex items-center justify-center">
                        <Users className="h-4 w-4 text-black" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-black text-black">{stats.totalUsers}</div>
                    </CardContent>
                  </Card>
                  <Card className="border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-black text-black">Total Revenue</CardTitle>
                      <div className="w-8 h-8 border-2 border-black bg-yellow-100 flex items-center justify-center">
                        <IndianRupee className="h-4 w-4 text-black" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-black text-black">₹{stats.totalRevenue?.toLocaleString()}</div>
                    </CardContent>
                  </Card>
                  <Card className="border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-black text-black">Active Rentals</CardTitle>
                      <div className="w-8 h-8 border-2 border-black bg-purple-100 flex items-center justify-center">
                        <Bike className="h-4 w-4 text-black" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-black text-black">{stats.activeBookings}</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Status Breakdown */}
                <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                  <CardHeader>
                    <CardTitle className="font-black text-black">Booking Status Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-4 border-4 border-black bg-yellow-100">
                        <p className="text-sm font-bold text-black">Pending</p>
                        <p className="text-2xl font-black text-black">{stats.pendingBookings}</p>
                      </div>
                      <div className="p-4 border-4 border-black bg-green-100">
                        <p className="text-sm font-bold text-black">Confirmed</p>
                        <p className="text-2xl font-black text-black">{stats.activeBookings}</p>
                      </div>
                      <div className="p-4 border-4 border-black bg-gray-100">
                        <p className="text-sm font-bold text-black">Completed</p>
                        <p className="text-2xl font-black text-black">{stats.completedBookings}</p>
                      </div>
                      <div className="p-4 border-4 border-black bg-red-100">
                        <p className="text-sm font-bold text-black">Cancelled</p>
                        <p className="text-2xl font-black text-black">{stats.cancelledBookings}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Bookings */}
                <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="font-black text-black">Recent Bookings</CardTitle>
                    <Button variant="outline" size="sm" onClick={() => setActiveTab('bookings')} className="font-bold">
                      View All
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {bookings.slice(0, 5).map((booking) => {
                        const statusKey = booking.status || 'pending';
                        const status = statusConfig[statusKey as keyof typeof statusConfig] || statusConfig.pending;
                        return (
                          <div key={booking.id} className="flex items-center justify-between p-3 border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            <div>
                              <p className="font-bold text-black">{booking.vehicleName || 'Unknown'}</p>
                              <p className="text-sm font-medium text-black">{booking.userName || booking.userId}</p>
                              <p className="text-sm font-medium text-black">
                                {new Date(booking.startDate).toLocaleDateString()} - ₹{booking.totalPrice}
                              </p>
                            </div>
                            <Badge className={status.color}>
                              {booking.status}
                            </Badge>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : null}
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings">
            <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-black text-black">All Bookings</CardTitle>
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-black" />
                  <Input
                    placeholder="Search bookings..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64"
                  />
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mx-auto"></div>
                    <p className="text-black font-bold mt-4">Loading...</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredBookings.map((booking) => {
                      const statusKey = booking.status || 'pending';
                      const status = statusConfig[statusKey as keyof typeof statusConfig] || statusConfig.pending;
                      const StatusIcon = status.icon;
                      
                      return (
                        <div key={booking.id} className="p-4 border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-black text-black">{booking.vehicleName || 'Unknown Vehicle'}</h3>
                                <Badge className={status.color}>
                                  <StatusIcon className="w-3 h-3 mr-1" />
                                  {booking.status}
                                </Badge>
                              </div>
                              <p className="text-sm font-medium text-black">Booking ID: {booking.id}</p>
                              <p className="text-sm font-medium text-black">
                                Dates: {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                              </p>
                              <p className="text-sm font-medium text-black">Price: ₹{booking.totalPrice}</p>
                              <div className="mt-2 p-2 border-2 border-black bg-blue-100">
                                <p className="text-sm font-black text-black">Customer Details</p>
                                <p className="text-sm font-medium text-black"><span className="font-bold">Name:</span> {booking.userName || 'Unknown'}</p>
                                <p className="text-sm font-medium text-black"><span className="font-bold">Email:</span> {booking.userEmail || 'Unknown'}</p>
                                <p className="text-sm font-medium text-black"><span className="font-bold">Phone:</span> {booking.userPhone || 'Not provided'}</p>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {booking.status !== 'confirmed' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="font-black"
                                  onClick={() => handleUpdateBookingStatus(booking.id, 'confirmed')}
                                >
                                  <Check className="w-4 h-4 mr-1" />
                                  Confirm
                                </Button>
                              )}
                              {booking.status !== 'completed' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="font-black"
                                  onClick={() => handleUpdateBookingStatus(booking.id, 'completed')}
                                >
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Complete
                                </Button>
                              )}
                              {booking.status !== 'cancelled' && (
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  className="font-black"
                                  onClick={() => handleUpdateBookingStatus(booking.id, 'cancelled')}
                                >
                                  <Ban className="w-4 h-4 mr-1" />
                                  Cancel
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-black text-black">All Users</CardTitle>
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-black" />
                  <Input
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64"
                  />
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mx-auto"></div>
                    <p className="text-black font-bold mt-4">Loading...</p>
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {filteredUsers.map((user) => (
                      <div key={user.id} className="p-4 border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-black text-black">{user.name}</h3>
                              {user.isRider && (
                                <Badge className="bg-green-100 text-black border-2 border-black">Rider</Badge>
                              )}
                            </div>
                            <p className="text-sm font-medium text-black">{user.email}</p>
                            <p className="text-sm font-medium text-black">Phone: {user.phone || 'Not provided'}</p>
                            <p className="text-sm font-medium text-black">
                              Joined: {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex flex-col gap-2">
                            <Button
                              size="sm"
                              variant={user.isRider ? 'destructive' : 'default'}
                              className="font-black"
                              onClick={() => {
                                adminAPI.updateUserRiderStatus(user.id, !user.isRider).then(() => {
                                  loadData();
                                });
                              }}
                            >
                              {user.isRider ? 'Remove Rider' : 'Make Rider'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Vehicles Tab */}
          <TabsContent value="vehicles">
            <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-black text-black">Vehicle Management</CardTitle>
                <Button onClick={handleAddNewVehicle} className="gap-2 font-black">
                  <Plus className="w-4 h-4" />
                  Add New Vehicle
                </Button>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mx-auto"></div>
                    <p className="text-black font-bold mt-4">Loading...</p>
                  </div>
                ) : (
                  <div className="grid gap-3 md:grid-cols-2">
                    {vehicles.map((vehicle) => (
                      <div key={vehicle.id} className="p-4 border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <h3 className="font-black text-black">{vehicle.name}</h3>
                              <Badge className={vehicle.available ? 'bg-green-100 text-black border-2 border-black' : 'bg-red-100 text-black border-2 border-black'}>
                                {vehicle.available ? 'Available' : 'Not Available'}
                              </Badge>
                            </div>
                            <p className="text-sm font-medium text-black">₹{vehicle.pricePerDay}/day</p>
                            <p className="text-sm font-medium text-black mt-1">{vehicle.description?.slice(0, 100)}...</p>
                          </div>
                          <div className="flex flex-col gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="font-black"
                              onClick={() => handleEditVehicle(vehicle)}
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant={vehicle.available ? 'destructive' : 'default'}
                              className="font-black"
                              onClick={() => handleToggleVehicleAvailability(vehicle.id, vehicle.available)}
                            >
                              {vehicle.available ? 'Unavailable' : 'Available'}
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              className="font-black"
                              onClick={() => handleDeleteVehicle(vehicle.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Rider Applications Tab */}
          <TabsContent value="riders">
            <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-black text-black">Rider Applications</CardTitle>
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-black" />
                  <Input
                    placeholder="Search applications..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64"
                  />
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mx-auto"></div>
                    <p className="text-black font-bold mt-4">Loading...</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {riderApplications
                      .filter((app) =>
                        app.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        app.userEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        app.city?.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .map((app) => (
                        <div key={app.id} className="p-4 border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <h3 className="font-black text-black">{app.fullName}</h3>
                                <Badge className={
                                  app.status === 'approved' ? 'bg-green-100 text-black border-2 border-black' :
                                  app.status === 'rejected' ? 'bg-red-100 text-black border-2 border-black' :
                                  'bg-yellow-100 text-black border-2 border-black'
                                }>
                                  {app.status || 'pending'}
                                </Badge>
                              </div>
                              <p className="text-sm font-medium text-black">Application ID: {app.id}</p>
                              <p className="text-sm font-medium text-black">Age: {app.age} | City: {app.city}</p>
                              <p className="text-sm font-medium text-black">Vehicle: {app.vehicleType} | License: {app.hasLicense ? 'Yes' : 'No'}</p>
                              {app.licenseNumber && (
                                <p className="text-sm font-medium text-black">License #: {app.licenseNumber}</p>
                              )}
                              <p className="text-sm font-medium text-black">Experience: {app.experience || 'Not specified'}</p>
                              <p className="text-sm font-medium text-black">Work Area: {app.preferredWorkArea || 'Not specified'}</p>
                              <p className="text-sm font-medium text-black">Availability: {app.availability || 'Not specified'}</p>
                              {app.additionalInfo && (
                                <p className="text-sm font-medium text-black mt-2">Additional Info: {app.additionalInfo}</p>
                              )}
                              <div className="mt-2 p-2 border-2 border-black bg-blue-100">
                                <p className="text-sm font-black text-black">Applicant Contact</p>
                                <p className="text-sm font-medium text-black"><span className="font-bold">Email:</span> {app.userEmail || 'Unknown'}</p>
                                <p className="text-sm font-medium text-black"><span className="font-bold">Phone:</span> {app.userPhone || 'Not provided'}</p>
                              </div>
                              <div className="mt-2 p-2 border-2 border-black bg-yellow-100">
                                <p className="text-sm font-black text-black">Identification Documents</p>
                                <p className="text-sm font-medium text-black"><span className="font-bold">Aadhar:</span> {app.aadharNumber || 'Not provided'}</p>
                                <p className="text-sm font-medium text-black"><span className="font-bold">PAN:</span> {app.panNumber || 'Not provided'}</p>
                              </div>
                              {app.adminNotes && (
                                <div className="mt-2 p-2 border-2 border-black bg-gray-100">
                                  <p className="text-sm font-black text-black">Admin Notes:</p>
                                  <p className="text-sm font-medium text-black">{app.adminNotes}</p>
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col gap-2">
                              {app.status !== 'approved' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="font-black"
                                  onClick={() => {
                                    const notes = prompt('Add admin notes (optional):') || '';
                                    handleUpdateRiderApplicationStatus(app.id!, 'approved', notes);
                                  }}
                                >
                                  <Check className="w-4 h-4 mr-1" />
                                  Approve
                                </Button>
                              )}
                              {app.status !== 'rejected' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="font-black"
                                  onClick={() => {
                                    const notes = prompt('Add rejection reason (optional):') || '';
                                    handleUpdateRiderApplicationStatus(app.id!, 'rejected', notes);
                                  }}
                                >
                                  <Ban className="w-4 h-4 mr-1" />
                                  Reject
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="destructive"
                                className="font-black"
                                onClick={() => handleDeleteRiderApplication(app.id!)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    {riderApplications.length === 0 && (
                      <div className="text-center py-8 border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <p className="text-black font-bold">No rider applications yet</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Vehicle Edit Dialog */}
        <VehicleEditDialog
          vehicle={editingVehicle}
          isOpen={isVehicleDialogOpen}
          onClose={() => setIsVehicleDialogOpen(false)}
          onSave={handleSaveVehicle}
          isNew={isNewVehicle}
        />
      </main>
    </div>
  );
}
