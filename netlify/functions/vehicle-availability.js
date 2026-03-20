const mongoose = require('mongoose');

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI;

let isConnected = false;

const connectDB = async () => {
  if (!isConnected && MONGO_URI) {
    try {
      await mongoose.connect(MONGO_URI);
      isConnected = true;
      console.log('✅ MongoDB Connected');
    } catch (error) {
      console.error('❌ MongoDB Connection Error:', error);
      return false;
    }
  }
  return isConnected;
};

// Vehicle Schema
const VehicleSchema = new mongoose.Schema({
  id: String,
  name: String,
  category: String,
  pricePerDay: Number,
  image: String,
  description: String,
  features: [String],
  specs: {
    engine: String,
    power: String,
    mileage: String,
    fuelCapacity: String,
  },
  available: { type: Boolean, default: true },
  riderPricePerDay: Number,
  createdAt: { type: Date, default: Date.now },
});

const Vehicle = mongoose.model('Vehicle', VehicleSchema);

exports.handler = async (event, context) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  };
  
  // Handle OPTIONS request for CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }
  
  try {
    const dbConnected = await connectDB();
    
    // Extract vehicleId from path
    let vehicleId = null;
    
    // Method 1: From path parameters (Netlify)
    if (event.pathParameters && event.pathParameters.vehicleId) {
      vehicleId = event.pathParameters.vehicleId;
    }
    
    // Method 2: From path (parse manually)
    if (!vehicleId && event.path) {
      const pathParts = event.path.split('/');
      // Handle /vehicles/{id}/availability
      const availabilityIndex = pathParts.indexOf('availability');
      if (availabilityIndex > 0) {
        vehicleId = pathParts[availabilityIndex - 1];
      } else {
        vehicleId = pathParts[pathParts.length - 1];
      }
    }
    
    console.log('🔍 Vehicle ID extracted:', vehicleId);
    console.log('🔍 Full event path:', event.path);
    console.log('🔍 Path parameters:', event.pathParameters);
    
    if (!vehicleId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Vehicle ID is required' }),
      };
    }
    
    // Handle PUT request - Update vehicle availability
    if (event.httpMethod === 'PUT') {
      const { available } = JSON.parse(event.body);
      
      if (!dbConnected) {
        // Return mock response if MongoDB not connected
        console.log('📝 Updating vehicle availability (mock - no MongoDB)');
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            id: vehicleId,
            available: available,
            updatedAt: new Date().toISOString(),
            message: `Vehicle availability updated to ${available ? 'available' : 'unavailable'} (mock)`
          }, null, 2),
        };
      }
      
      // Update vehicle availability in MongoDB
      const vehicle = await Vehicle.findOneAndUpdate(
        { id: vehicleId },
        { available, updatedAt: new Date() },
        { new: true, upsert: false }
      );
      
      if (!vehicle) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Vehicle not found' }),
        };
      }
      
      console.log('✅ Vehicle availability updated in MongoDB:', vehicle.id, '→', available ? 'available' : 'unavailable');
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(vehicle.toObject(), null, 2),
      };
    }
    
    // Handle GET request - Get single vehicle
    if (event.httpMethod === 'GET') {
      if (!dbConnected) {
        // Return mock vehicle for demonstration
        const mockVehicle = {
          id: vehicleId,
          name: 'Honda Activa 6G',
          category: 'scooter',
          pricePerDay: 380,
          image: 'https://images.unsplash.com/photo-1589216532372-1c2a367900d9?w=800&auto=format&fit=crop',
          description: 'Premium scooter with elegant design and refined performance.',
          features: ['LED Headlamp', 'Digital Instrument Cluster', 'External Fuel Cap', 'Large Under-seat Storage'],
          specs: {
            engine: '124 cc',
            power: '8.8 PS',
            mileage: '55 kmpl',
            fuelCapacity: '5.3 L'
          },
          available: true,
          riderPricePerDay: 450,
          createdAt: new Date('2024-03-15T10:30:00Z')
        };
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(mockVehicle, null, 2),
        };
      }
      
      // Get vehicle from MongoDB
      const vehicle = await Vehicle.findOne({ id: vehicleId }).lean();
      
      if (!vehicle) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Vehicle not found' }),
        };
      }
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(vehicle, null, 2),
      };
    }
    
    // Handle unsupported methods
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
    
  } catch (error) {
    console.error('❌ Error in vehicle availability function:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: error.message,
        stack: error.stack 
      }),
    };
  }
};
