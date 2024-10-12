/* ---------------- imports ---------------- */
const express = require('express');
const axios = require('axios');
const { getAppVersion } = require('./version');

/* ---------------- Global Vars ---------------- */
const app = express();
const PORT = 3000;

/**
 * Version Endpoint
 */
app.get('/version', (req, res) => {
  res.json({ version: getAppVersion() });
});

/**
 * Function to fetch latest SenseBox data
 */
async function fetchSenseBoxData() {
  try {
    const response = await axios.get('https://api.opensensemap.org/boxes/670acf5c08ceb70008f66c3b/sensors/670acf5c08ceb70008f66c3c?onlyValue=true');
    return response.data;  // Return the data fetched
  } catch (error) {
    throw new Error('Error fetching SenseBox data: ' + error.message);
  }
}

/**
 * Temperature Endpoint
 */
app.get('/temperature', async (req, res) => {
  try {
    const senseBoxData = await fetchSenseBoxData();
    
    if (!senseBoxData.lastMeasurement || !senseBoxData.lastMeasurement.value || !senseBoxData.lastMeasurement.createdAt) {
      return res.status(404).send('No temperature data available');
    }

    // Ensure data is no older than 1 hour
    const lastMeasurementTime = new Date(senseBoxData.lastMeasurement.createdAt);
    const currentTime = new Date();
    
    const oneHourAgo = new Date(currentTime - 60 * 60 * 1000);
    
    if (lastMeasurementTime > oneHourAgo) {
      res.json({ temperature: senseBoxData.lastMeasurement.value });
    } else {
      res.status(400).send('No recent temperature data available (older than 1 hour)');
    }
  } catch (error) {
    res.status(500).send('Error fetching temperature data: ' + error.message);
  }
});

/**
 * App
 */
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
