exports.handler = async (event, context) => {
  console.log('🔧 Simple test function called');
  console.log('Path:', event.path);
  
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
  
  // Return empty arrays for admin endpoints
  if (event.path.includes('/bookings')) {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify([], null, 2),
    };
  }
  
  if (event.path.includes('/users')) {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify([], null, 2),
    };
  }
  
  if (event.path.includes('/rider-applications')) {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify([], null, 2),
    };
  }
  
  // Default response for other endpoints
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      message: 'Simple test working',
      timestamp: new Date().toISOString()
    }, null, 2),
  };
};
