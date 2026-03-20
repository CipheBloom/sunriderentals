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
  confirmed: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
  pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  active: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
  completed: { color: 'bg-gray-100 text-gray-800', icon: CheckCircle },
  cancelled: { color: 'bg-red-100 text-red-800', icon: Ban },
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
      const [statsData, bookingsData, usersData, vehiclesData, riderAppsData] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getAllBookings(),
        adminAPI.getAllUsers(),
        adminAPI.getAllVehicles(),
        adminAPI.getAllRiderApplications(),
      ]);
      setStats(statsData);
      setBookings(bookingsData);
      setUsers(usersData);
      setVehicles(vehiclesData);
      setRiderApplications(riderAppsData);
    } catch (error) {
      console.error('❌ Failed to load admin data:', error);
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

  const handleUpdateRiderApplicationStatus = async (appId: string, userId: string, status: string, adminNotes?: string) => {
    try {
      await adminAPI.updateRiderApplicationStatus(appId, status, adminNotes);
      // If approving, also set user as rider
      if (status === 'approved') {
        await adminAPI.updateUserRiderStatus(userId, true);
        // Refresh users to get updated rider status
        const updatedUsers = await adminAPI.getAllUsers();
        setUsers(updatedUsers);
      }
      const updatedApps = await adminAPI.getAllRiderApplications();
      setRiderApplications(updatedApps);
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Admin Dashboard</h1>
              <p className="text-sm text-gray-500">SunRide Rentals Management</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout} className="gap-2">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 max-w-3xl mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
            <TabsTrigger value="riders">Riders</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {isLoading ? (
              <p className="text-center py-8">Loading...</p>
            ) : stats ? (
              <>
                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                      <Calendar className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.totalBookings}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                      <Users className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.totalUsers}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                      <IndianRupee className="h-4 w-4 text-yellow-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">₹{stats.totalRevenue?.toLocaleString()}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">Active Rentals</CardTitle>
                      <Bike className="h-4 w-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.activeBookings}</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Status Breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle>Booking Status Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-4 bg-yellow-50 rounded-lg">
                        <p className="text-sm text-yellow-700">Pending</p>
                        <p className="text-2xl font-bold text-yellow-800">{stats.pendingBookings}</p>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg">
                        <p className="text-sm text-green-700">Confirmed</p>
                        <p className="text-2xl font-bold text-green-800">{stats.activeBookings}</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700">Completed</p>
                        <p className="text-2xl font-bold text-gray-800">{stats.completedBookings}</p>
                      </div>
                      <div className="p-4 bg-red-50 rounded-lg">
                        <p className="text-sm text-red-700">Cancelled</p>
                        <p className="text-2xl font-bold text-red-800">{stats.cancelledBookings}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Bookings */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Recent Bookings</CardTitle>
                    <Button variant="outline" size="sm" onClick={() => setActiveTab('bookings')}>
                      View All
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {bookings.slice(0, 5).map((booking) => {
                        const statusKey = booking.status || 'pending';
                        const status = statusConfig[statusKey as keyof typeof statusConfig] || statusConfig.pending;
                        return (
                          <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium">{booking.vehicleName || 'Unknown'}</p>
                              <p className="text-sm text-gray-500">{booking.userName || booking.userId}</p>
                              <p className="text-sm text-gray-500">
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
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>All Bookings</CardTitle>
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-gray-400" />
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
                  <p className="text-center py-8">Loading...</p>
                ) : (
                  <div className="space-y-3">
                    {filteredBookings.map((booking) => {
                      const statusKey = booking.status || 'pending';
                      const status = statusConfig[statusKey as keyof typeof statusConfig] || statusConfig.pending;
                      const StatusIcon = status.icon;
                      
                      return (
                        <div key={booking.id} className="p-4 border rounded-lg">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold">{booking.vehicleName || 'Unknown Vehicle'}</h3>
                                <Badge className={status.color}>
                                  <StatusIcon className="w-3 h-3 mr-1" />
                                  {booking.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-500">Booking ID: {booking.id}</p>
                              <p className="text-sm text-gray-500">
                                Dates: {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                              </p>
                              <p className="text-sm text-gray-500">Price: ₹{booking.totalPrice}</p>
                              <div className="mt-2 p-2 bg-blue-50 rounded border border-blue-100">
                                <p className="text-sm font-medium text-blue-800">Customer Details</p>
                                <p className="text-sm text-gray-700"><span className="font-medium">Name:</span> {booking.userName || 'Unknown'}</p>
                                <p className="text-sm text-gray-700"><span className="font-medium">Email:</span> {booking.userEmail || 'Unknown'}</p>
                                <p className="text-sm text-gray-700"><span className="font-medium">Phone:</span> {booking.userPhone || 'Not provided'}</p>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {booking.status !== 'confirmed' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-green-600"
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
                                  className="text-blue-600"
                                  onClick={() => handleUpdateBookingStatus(booking.id, 'completed')}
                                >
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Complete
                                </Button>
                              )}
                              {booking.status !== 'cancelled' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-red-600"
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
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>All Users</CardTitle>
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-gray-400" />
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
                  <p className="text-center py-8">Loading...</p>
                ) : (
                  <div className="grid gap-3">
                    {filteredUsers.map((user) => (
                      <div key={user.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{user.name}</h3>
                              {user.isRider && (
                                <Badge className="bg-green-100 text-green-800">Rider</Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-500">{user.email}</p>
                            <p className="text-sm text-gray-500">Phone: {user.phone || 'Not provided'}</p>
                            <p className="text-sm text-gray-500">
                              Joined: {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex flex-col gap-2">
                            <Button
                              size="sm"
                              variant={user.isRider ? 'destructive' : 'default'}
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
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Vehicle Management</CardTitle>
                <Button onClick={handleAddNewVehicle} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add New Vehicle
                </Button>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <p className="text-center py-8">Loading...</p>
                ) : (
                  <div className="grid gap-3 md:grid-cols-2">
                    {vehicles.map((vehicle) => (
                      <div key={vehicle.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <h3 className="font-semibold">{vehicle.name}</h3>
                              <Badge className={vehicle.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                                {vehicle.available ? 'Available' : 'Not Available'}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-500">₹{vehicle.pricePerDay}/day</p>
                            <p className="text-sm text-gray-500 mt-1">{vehicle.description?.slice(0, 100)}...</p>
                          </div>
                          <div className="flex flex-col gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditVehicle(vehicle)}
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant={vehicle.available ? 'destructive' : 'default'}
                              onClick={() => handleToggleVehicleAvailability(vehicle.id, vehicle.available)}
                            >
                              {vehicle.available ? 'Unavailable' : 'Available'}
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
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
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Rider Applications</CardTitle>
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-gray-400" />
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
                  <p className="text-center py-8">Loading...</p>
                ) : (
                  <div className="space-y-3">
                    {riderApplications
                      .filter((app) =>
                        app.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        app.userEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        app.city?.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .map((app) => (
                        <div key={app.id} className="p-4 border rounded-lg">
                          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <h3 className="font-semibold">{app.fullName}</h3>
                                <Badge className={
                                  app.status === 'approved' ? 'bg-green-100 text-green-800' :
                                  app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                  'bg-yellow-100 text-yellow-800'
                                }>
                                  {app.status || 'pending'}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-500">Application ID: {app.id}</p>
                              <p className="text-sm text-gray-500">Age: {app.age} | City: {app.city}</p>
                              <p className="text-sm text-gray-500">Vehicle: {app.vehicleType} | License: {app.hasLicense ? 'Yes' : 'No'}</p>
                              {app.licenseNumber && (
                                <p className="text-sm text-gray-500">License #: {app.licenseNumber}</p>
                              )}
                              <p className="text-sm text-gray-500">Experience: {app.experience || 'Not specified'}</p>
                              <p className="text-sm text-gray-500">Work Area: {app.preferredWorkArea || 'Not specified'}</p>
                              <p className="text-sm text-gray-500">Availability: {app.availability || 'Not specified'}</p>
                              {app.additionalInfo && (
                                <p className="text-sm text-gray-500 mt-2">Additional Info: {app.additionalInfo}</p>
                              )}
                              <div className="mt-2 p-2 bg-blue-50 rounded border border-blue-100">
                                <p className="text-sm font-medium text-blue-800">Applicant Contact</p>
                                <p className="text-sm text-gray-700"><span className="font-medium">Email:</span> {app.userEmail || 'Unknown'}</p>
                                <p className="text-sm text-gray-700"><span className="font-medium">Phone:</span> {app.userPhone || 'Not provided'}</p>
                              </div>
                              <div className="mt-2 p-2 bg-yellow-50 rounded border border-yellow-100">
                                <p className="text-sm font-medium text-yellow-800">Identification Documents</p>
                                <p className="text-sm text-gray-700"><span className="font-medium">Aadhar:</span> {app.aadharNumber || 'Not provided'}</p>
                                <p className="text-sm text-gray-700"><span className="font-medium">PAN:</span> {app.panNumber || 'Not provided'}</p>
                              </div>
                              {app.adminNotes && (
                                <div className="mt-2 p-2 bg-gray-50 rounded">
                                  <p className="text-sm font-medium">Admin Notes:</p>
                                  <p className="text-sm text-gray-600">{app.adminNotes}</p>
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col gap-2">
                              {app.status !== 'approved' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-green-600"
                                  onClick={() => {
                                    const notes = prompt('Add admin notes (optional):') || '';
                                    handleUpdateRiderApplicationStatus(app.id!, app.userId, 'approved', notes);
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
                                  className="text-red-600"
                                  onClick={() => {
                                    const notes = prompt('Add rejection reason (optional):') || '';
                                    handleUpdateRiderApplicationStatus(app.id!, app.userId, 'rejected', notes);
                                  }}
                                >
                                  <Ban className="w-4 h-4 mr-1" />
                                  Reject
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteRiderApplication(app.id!)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    {riderApplications.length === 0 && (
                      <p className="text-center text-gray-500 py-8">No rider applications yet</p>
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
