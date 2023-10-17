const jwt = require('jsonwebtoken');

const apiKey = 'YOUR_ZOOM_API_KEY';
const apiSecret = 'YOUR_ZOOM_API_SECRET';

// Payload for the JWT token
const payload = {
  iss: apiKey,
  exp: Date.now() + 3600, // 1 hour expiration time
};

// Generate the JWT token
const token = jwt.sign(payload, apiSecret);

console.log('SDK Token:', token);
