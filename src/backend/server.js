import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// MongoDB Connection
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ MongoDB Error:', err));

// Schemas
const userSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  picture: { type: String, default: '' },
  phone: { type: String, default: '' },
  address: { type: String, default: '' },
  isRider: { type: Boolean, default: false }, // Approved rider status
  riderApprovedAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const bookingSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  userId: { type: String, required: true, ref: 'User' },
  userName: { type: String, default: '' },
  userEmail: { type: String, default: '' },
  userPhone: { type: String, default: '' },
  vehicleId: { type: String, required: true },
  vehicleName: { type: String, default: '' },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  totalPrice: { type: Number, default: 0 },
  status: { type: String, default: 'pending', enum: ['pending', 'confirmed', 'active', 'completed', 'cancelled'] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Rider Application Schema
const riderApplicationSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  userId: { type: String, required: true },
  userName: { type: String, default: '' },
  userEmail: { type: String, default: '' },
  userPhone: { type: String, default: '' },
  // Personal identification
  aadharNumber: { type: String, required: true },
  panNumber: { type: String, required: true },
  // Application details
  fullName: { type: String, required: true },
  age: { type: Number, required: true },
  city: { type: String, required: true },
  vehicleType: { type: String, required: true }, // scooter, bike, bicycle
  hasLicense: { type: Boolean, default: false },
  licenseNumber: { type: String, default: '' },
  experience: { type: String, default: '' }, // years of experience
  preferredWorkArea: { type: String, default: '' },
  availability: { type: String, default: '' }, // full-time, part-time, weekends
  additionalInfo: { type: String, default: '' },
  // Status
  status: { type: String, default: 'pending', enum: ['pending', 'approved', 'rejected'] },
  adminNotes: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Booking = mongoose.model('Booking', bookingSchema);
const RiderApplication = mongoose.model('RiderApplication', riderApplicationSchema);

// === USER ROUTES ===

// GET all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single user by ID
app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findOne({ id: req.params.id });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single user by email (for login sync)
app.get('/api/users/email/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST new user
app.post('/api/users', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update user
app.put('/api/users/:id', async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE user
app.delete('/api/users/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// === BOOKING ROUTES ===

// GET all bookings
app.get('/api/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST new booking
app.post('/api/bookings', async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET user bookings
app.get('/api/bookings/:userId', async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.params.userId });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update booking
app.put('/api/bookings/:id', async (req, res) => {
  try {
    const updated = await Booking.findOneAndUpdate(
      { id: req.params.id },
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE booking
app.delete('/api/bookings/:id', async (req, res) => {
  try {
    const result = await Booking.findOneAndDelete({ id: req.params.id });
    if (!result) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json({ message: 'Booking deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// === ADMIN CREDENTIALS (Hardcoded for security) ===
const ADMIN_EMAIL = 'sunriderental21@gmail.com';
const ADMIN_PASSWORD = 'sunriderental21';

// Vehicle Schema for availability management
const vehicleSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  category: { type: String, default: 'scooter' },
  pricePerDay: { type: Number, default: 0 },
  riderPricePerDay: { type: Number, default: 0 }, // Discounted price for approved riders
  image: { type: String, default: '' },
  description: { type: String, default: '' },
  features: [{ type: String }],
  specs: {
    engine: { type: String, default: '' },
    power: { type: String, default: '' },
    mileage: { type: String, default: '' },
    fuelCapacity: { type: String, default: '' },
  },
  available: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

// === ADMIN ROUTES ===

// Admin login
app.post('/api/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      res.json({ 
        success: true, 
        message: 'Admin login successful',
        admin: { email: ADMIN_EMAIL }
      });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET all bookings with user details (Admin)
app.get('/api/admin/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    
    // Fetch all users to map with bookings (fallback)
    const users = await User.find();
    const userMap = new Map(users.map(u => [u.id, u]));
    
    // Enrich bookings with user details
    const enrichedBookings = bookings.map(booking => {
      // Use stored user details if available, otherwise lookup user
      if (booking.userName && booking.userEmail) {
        return {
          ...booking.toObject(),
          userName: booking.userName,
          userEmail: booking.userEmail,
          userPhone: booking.userPhone || 'Not provided'
        };
      }
      
      // Fallback: lookup user by userId
      const user = userMap.get(booking.userId);
      return {
        ...booking.toObject(),
        userName: user?.name || 'Unknown',
        userEmail: user?.email || 'Unknown',
        userPhone: user?.phone || 'Not provided'
      };
    });
    
    res.json(enrichedBookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET all users (Admin)
app.get('/api/admin/users', async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET all vehicles (Public - only available ones)
app.get('/api/vehicles', async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ available: true });
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET all vehicles (Admin)
app.get('/api/admin/vehicles', async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create/update vehicle (Admin)
app.post('/api/admin/vehicles', async (req, res) => {
  try {
    const vehicle = new Vehicle({ ...req.body, updatedAt: new Date() });
    await vehicle.save();
    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update vehicle details (Admin)
app.put('/api/admin/vehicles/:id', async (req, res) => {
  try {
    const updated = await Vehicle.findOneAndUpdate(
      { id: req.params.id },
      { ...req.body, updatedAt: new Date() },
      { new: true, upsert: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE vehicle (Admin)
app.delete('/api/admin/vehicles/:id', async (req, res) => {
  try {
    const result = await Vehicle.findOneAndDelete({ id: req.params.id });
    if (!result) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }
    res.json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update vehicle availability (Admin)
app.put('/api/admin/vehicles/:id/availability', async (req, res) => {
  try {
    const { available } = req.body;
    const updated = await Vehicle.findOneAndUpdate(
      { id: req.params.id },
      { available, updatedAt: new Date() },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update booking status (Admin)
app.put('/api/admin/bookings/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await Booking.findOneAndUpdate(
      { id: req.params.id },
      { status, updatedAt: new Date() },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE booking (Admin)
app.delete('/api/admin/bookings/:id', async (req, res) => {
  try {
    const result = await Booking.findOneAndDelete({ id: req.params.id });
    if (!result) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update user rider status (Admin)
app.put('/api/admin/users/:id/rider-status', async (req, res) => {
  try {
    const { isRider } = req.body;
    const updated = await User.findOneAndUpdate(
      { id: req.params.id },
      { 
        isRider, 
        riderApprovedAt: isRider ? new Date() : null,
        updatedAt: new Date() 
      },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// === RIDER APPLICATION ROUTES ===

// POST new rider application (Public - requires auth)
app.post('/api/rider-applications', async (req, res) => {
  try {
    const application = new RiderApplication({
      ...req.body,
      id: 'rider_' + Date.now(),
      createdAt: new Date(),
      updatedAt: new Date()
    });
    await application.save();
    res.json({ success: true, application });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET all rider applications (Admin)
app.get('/api/admin/rider-applications', async (req, res) => {
  try {
    const applications = await RiderApplication.find().sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update rider application status (Admin)
app.put('/api/admin/rider-applications/:id/status', async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    const updated = await RiderApplication.findOneAndUpdate(
      { id: req.params.id },
      { status, adminNotes, updatedAt: new Date() },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ error: 'Application not found' });
    }
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE rider application (Admin)
app.delete('/api/admin/rider-applications/:id', async (req, res) => {
  try {
    const result = await RiderApplication.findOneAndDelete({ id: req.params.id });
    if (!result) {
      return res.status(404).json({ error: 'Application not found' });
    }
    res.json({ message: 'Application deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET dashboard stats (Admin)
app.get('/api/admin/stats', async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalVehicles = await Vehicle.countDocuments();
    const activeBookings = await Booking.countDocuments({ status: { $in: ['confirmed', 'active'] } });
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const cancelledBookings = await Booking.countDocuments({ status: 'cancelled' });
    const completedBookings = await Booking.countDocuments({ status: 'completed' });
    
    // Calculate total revenue
    const bookings = await Booking.find({ status: { $ne: 'cancelled' } });
    const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
    
    res.json({
      totalBookings,
      totalUsers,
      totalVehicles,
      activeBookings,
      pendingBookings,
      cancelledBookings,
      completedBookings,
      totalRevenue
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Initialize default vehicles if none exist
async function initializeVehicles() {
  try {
    const count = await Vehicle.countDocuments();
    if (count === 0) {
      const defaultVehicles = [
        {
          id: '1',
          name: 'Honda Activa 6G',
          category: 'scooter',
          pricePerDay: 350,
          image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&auto=format&fit=crop',
          description: 'India\'s most trusted scooter with reliable performance and excellent fuel efficiency.',
          features: ['ESP Technology', 'Silent Start', 'External Fuel Filling', 'Telescopic Suspension'],
          specs: {
            engine: '109.51 cc',
            power: '7.79 PS',
            mileage: '45 km/l',
            fuelCapacity: '5.3 L',
          },
          available: true,
        },
        {
          id: '2',
          name: 'Suzuki Access 125',
          category: 'scooter',
          pricePerDay: 380,
          image: 'https://images.unsplash.com/photo-1589216532372-1c2a367900d9?w=800&auto=format&fit=crop',
          description: 'Premium scooter with elegant design and refined performance.',
          features: ['LED Headlamp', 'Digital Instrument Cluster', 'External Fuel Cap', 'Large Under-seat Storage'],
          specs: {
            engine: '124 cc',
            power: '8.7 PS',
            mileage: '48 km/l',
            fuelCapacity: '5 L',
          },
          available: true,
        },
        {
          id: '3',
          name: 'TVS Jupiter',
          category: 'scooter',
          pricePerDay: 360,
          image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&auto=format&fit=crop',
          description: 'Comfortable and feature-rich scooter for daily commuting.',
          features: ['iTouch Start', 'Eco Throttle', 'External Fuel Filling', 'LED Headlamp'],
          specs: {
            engine: '109.7 cc',
            power: '7.88 PS',
            mileage: '50 km/l',
            fuelCapacity: '6 L',
          },
          available: true,
        },
        {
          id: '4',
          name: 'Hero Maestro Edge',
          category: 'scooter',
          pricePerDay: 340,
          image: 'https://images.unsplash.com/photo-1589216532372-1c2a367900d9?w=800&auto=format&fit=crop',
          description: 'Stylish scooter with advanced features and smooth performance.',
          features: ['BS6 Engine', 'Mobile Charging', 'LED DRLs', 'Side Stand Indicator'],
          specs: {
            engine: '110.9 cc',
            power: '8.05 PS',
            mileage: '47 km/l',
            fuelCapacity: '5 L',
          },
          available: true,
        },
        {
          id: '5',
          name: 'Honda Dio',
          category: 'scooter',
          pricePerDay: 370,
          image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&auto=format&fit=crop',
          description: 'Sporty and stylish scooter for the young generation.',
          features: ['LED Headlamp', 'Digital Meter', 'External Fuel Filling', 'Telescopic Suspension'],
          specs: {
            engine: '109.51 cc',
            power: '7.79 PS',
            mileage: '48 km/l',
            fuelCapacity: '5.3 L',
          },
          available: true,
        },
      ];
      
      await Vehicle.insertMany(defaultVehicles);
      console.log('✅ Default vehicles initialized');
    }
  } catch (error) {
    console.error('❌ Error initializing vehicles:', error);
  }
}

// Auto-complete bookings that have passed their end date
async function autoCompleteBookings() {
  try {
    const now = new Date();
    // Find bookings where endDate has passed and status is not cancelled or completed
    const bookingsToComplete = await Booking.find({
      endDate: { $lt: now },
      status: { $nin: ['completed', 'cancelled'] }
    });

    if (bookingsToComplete.length > 0) {
      for (const booking of bookingsToComplete) {
        await Booking.findOneAndUpdate(
          { id: booking.id },
          { status: 'completed', updatedAt: new Date() },
          { new: true }
        );
        console.log(`✅ Auto-completed booking: ${booking.id}`);
      }
      console.log(`✅ Auto-completed ${bookingsToComplete.length} bookings`);
    }
  } catch (error) {
    console.error('❌ Error auto-completing bookings:', error);
  }
}

// Run auto-complete every hour
setInterval(autoCompleteBookings, 60 * 60 * 1000);

// Call initialize after MongoDB connection
mongoose.connection.once('open', () => {
  initializeVehicles();
  // Run auto-complete once on startup
  autoCompleteBookings();
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
