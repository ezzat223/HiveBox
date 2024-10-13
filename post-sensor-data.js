const axios = require('axios');
require('dotenv').config();


// Define the senseBox and sensor IDs
const senseBoxId = process.env.SENSE_BOX_ID;
const sensorId = process.env.SENSOR_ID;
const accessToken = process.env.ACCESS_TOKEN; // For Authorization header

// Function to post random temperature data
async function postTemperature() {
  try {
    const temperature = (Math.random() * (40 - 5) + 5).toFixed(2); // Random temperature between 5°C and 40°C
    const data = {
      value: temperature,
      createdAt: new Date().toISOString(),
    };

    const headers = {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    };

    // Post request to the API
    const response = await axios.post(
      `https://api.opensensemap.org/boxes/${senseBoxId}/${sensorId}`,
      data,
      { headers }
    );
    console.log(`Posted temperature: ${temperature}°C - Status: ${response.status}`);
  } catch (error) {
    console.error('Error posting temperature:', error.message);
  }
}

// Post data every 1 minute (600,00 ms)
setInterval(postTemperature, 60000); 
