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

// User Schema
const UserSchema = new mongoose.Schema({
  id: String,
  name: String,
  email: String,
  phone: String,
  picture: String,
  isRider: { type: Boolean, default: false },
  address: String,
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', UserSchema);

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
    
    // Extract userId from path
    let userId = null;
    
    // Method 1: From path parameters (Netlify)
    if (event.pathParameters && event.pathParameters.userId) {
      userId = event.pathParameters.userId;
    }
    
    // Method 2: From path (parse manually)
    if (!userId && event.path) {
      const pathParts = event.path.split('/');
      // Handle /users/{id}/rider-status
      const riderStatusIndex = pathParts.indexOf('rider-status');
      if (riderStatusIndex > 0) {
        userId = pathParts[riderStatusIndex - 1];
      } else {
        userId = pathParts[pathParts.length - 1];
      }
    }
    
    console.log('🔍 User ID extracted:', userId);
    console.log('🔍 Full event path:', event.path);
    console.log('🔍 Path parameters:', event.pathParameters);
    
    if (!userId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'User ID is required' }),
      };
    }
    
    // Handle PUT request - Update user rider status
    if (event.httpMethod === 'PUT') {
      const { isRider } = JSON.parse(event.body);
      
      if (!dbConnected) {
        // Return mock response if MongoDB not connected
        console.log('📝 Updating user rider status (mock - no MongoDB)');
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            id: userId,
            isRider: isRider,
            updatedAt: new Date().toISOString(),
            message: `User rider status updated to ${isRider ? 'rider' : 'non-rider'} (mock)`
          }, null, 2),
        };
      }
      
      // Update user rider status in MongoDB
      const user = await User.findOneAndUpdate(
        { id: userId },
        { isRider, updatedAt: new Date() },
        { new: true, upsert: false }
      );
      
      if (!user) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'User not found' }),
        };
      }
      
      console.log('✅ User rider status updated in MongoDB:', user.id, '→', isRider ? 'rider' : 'non-rider');
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(user.toObject(), null, 2),
      };
    }
    
    // Handle GET request - Get single user
    if (event.httpMethod === 'GET') {
      if (!dbConnected) {
        // Return mock user for demonstration
        const mockUser = {
          id: userId,
          name: 'John Doe',
          email: 'john.doe@example.com',
          phone: '+91 98765 43210',
          isRider: false,
          createdAt: new Date('2024-03-15T10:30:00Z')
        };
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(mockUser, null, 2),
        };
      }
      
      // Get user from MongoDB
      const user = await User.findOne({ id: userId }).lean();
      
      if (!user) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'User not found' }),
        };
      }
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(user, null, 2),
      };
    }
    
    // Handle unsupported methods
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
    
  } catch (error) {
    console.error('❌ Error in user rider status function:', error);
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
