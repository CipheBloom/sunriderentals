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
  googleId: String,
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
    
    // Handle PUT request - Update user
    if (event.httpMethod === 'PUT') {
      const userData = JSON.parse(event.body);
      
      if (!dbConnected) {
        // Return mock response if MongoDB not connected
        console.log('📝 Updating user (mock - no MongoDB)');
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            ...userData,
            updatedAt: new Date().toISOString()
          }, null, 2),
        };
      }
      
      // Update user in MongoDB
      const user = await User.findOneAndUpdate(
        { id: userData.id },
        userData,
        { new: true, upsert: false }
      );
      
      if (!user) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'User not found' }),
        };
      }
      
      console.log('✅ User updated in MongoDB:', user.id);
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(user.toObject(), null, 2),
      };
    }
    
    // Handle DELETE request - Delete user
    if (event.httpMethod === 'DELETE') {
      const userId = event.pathParameters?.userId || 
                   event.path?.split('/').pop();
      
      if (!dbConnected) {
        // Return mock response if MongoDB not connected
        console.log('📝 Deleting user (mock - no MongoDB)');
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ 
            message: 'User deleted successfully (mock)',
            id: userId
          }, null, 2),
        };
      }
      
      // Delete user from MongoDB
      const result = await User.deleteOne({ id: userId });
      
      if (result.deletedCount === 0) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'User not found' }),
        };
      }
      
      console.log('✅ User deleted from MongoDB:', userId);
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          message: 'User deleted successfully',
          id: userId
        }, null, 2),
      };
    }
    
    // Handle GET request - Get all users
    if (event.httpMethod === 'GET') {
      if (!dbConnected) {
        // Return sample user data only if MongoDB not connected
        console.log('📝 Returning sample users (no MongoDB connection)');
        const sampleUsers = [
          {
            id: 'google_123456',
            name: 'John Doe',
            email: 'john.doe@example.com',
            phone: '+91 98765 43210',
            isRider: false,
            createdAt: new Date('2024-03-15T10:30:00Z')
          },
          {
            id: 'google_789012',
            name: 'Jane Smith',
            email: 'jane.smith@example.com',
            phone: '+91 87654 32109',
            isRider: true,
            createdAt: new Date('2024-03-10T14:15:00Z')
          },
          {
            id: 'google_345678',
            name: 'Mike Johnson',
            email: 'mike.j@example.com',
            phone: '+91 76543 21098',
            isRider: false,
            createdAt: new Date('2024-03-12T09:45:00Z')
          },
          {
            id: 'google_901234',
            name: 'Sarah Williams',
            email: 'sarah.w@example.com',
            phone: '+91 65432 10987',
            isRider: true,
            createdAt: new Date('2024-03-08T16:20:00Z')
          }
        ];
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(sampleUsers, null, 2),
        };
      }
      
      // Get real users from MongoDB
      console.log('🔍 Fetching real users from MongoDB');
      const users = await User.find().lean();
      console.log(`✅ Found ${users.length} users in database`);
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(users, null, 2),
      };
    }
    
    // Handle POST request - Create new user
    if (event.httpMethod === 'POST') {
      const userData = JSON.parse(event.body);
      
      if (!dbConnected) {
        // Return mock response if MongoDB not connected
        console.log('📝 Creating user (mock - no MongoDB)');
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            ...userData,
            id: userData.id || `user_${Date.now()}`,
            createdAt: new Date().toISOString(),
            isRider: userData.isRider || false
          }, null, 2),
        };
      }
      
      // Create user in MongoDB
      const user = new User({
        ...userData,
        createdAt: new Date(),
      });
      
      await user.save();
      console.log('✅ User created in MongoDB:', user.id);
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(user.toObject(), null, 2),
      };
    }
    
    // Handle unsupported methods
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
    
  } catch (error) {
    console.error('❌ Error in users function:', error);
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
