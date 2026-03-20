exports.handler = async (event, context) => {
  console.log('Testing individual endpoints...');
  
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({ 
      message: 'Individual test working',
      timestamp: new Date().toISOString()
    }, null, 2),
  };
};
