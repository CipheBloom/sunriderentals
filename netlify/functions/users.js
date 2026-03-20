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
    // Return sample user data for demonstration
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
