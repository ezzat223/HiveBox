/* ---------------- imports ---------------- */
const express = require('express');
const axios = require('axios');
const client = require('prom-client');
const { getAppVersion } = require('./version');
require('dotenv').config();

/* ---------------- Global Vars ---------------- */
const app = express();
const PORT = 3000;
const senseBoxId = process.env.SENSE_BOX_ID;
const sensorId = process.env.SENSOR_ID;



/* ---------------- Prometheus ---------------- */
// Create a Registry which registers all metrics
const register = new client.Registry()

// Add a default label which is added to all metrics
register.setDefaultLabels({
    app: 'HiveBox-app'
})

// Enable the collection of defaule metrics
client.collectDefaultMetrics({ register })


/**
 * Version Endpoint
 */
app.get('/version', (req, res) => {
  res.json({ version: getAppVersion() });
});

/**
 * Function to fetch SenseBox sensor data
 */
async function fetchSenseBoxData() {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const now = new Date().toISOString();

  try {
    const response = await axios.get(`https://api.opensensemap.org/boxes/${senseBoxId}/data/${sensorId}?from-date=${oneHourAgo}&to-date=${now}&format=json`);
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

    if (!senseBoxData || senseBoxData.length === 0) {
      return res.status(404).send('No temperature data available within the last hour');
    }

    // Calculate the average temperature
    const totalTemperature = senseBoxData.reduce((sum, m) => sum + parseFloat(m.value), 0);
    const averageTemperature = totalTemperature / senseBoxData.length;

    // Set status based on average temperature
    let status = 'Unknown';
    if (averageTemperature < 10) {
      status = 'Too Cold';
    } else if (averageTemperature >= 11 && averageTemperature <= 36) {
      status = 'Good';
    } else if (averageTemperature > 37) {
      status = 'Too Hot';
    }

    res.json({
      averageTemperature: averageTemperature.toFixed(2),
      status: status,
    });
  } catch (error) {
    res.status(500).send('Error fetching temperature data: ' + error.message);
  }
});

/**
 * metrics Endpoint
 */
app.get('/metrics', async function (req, res) {
  // Return all metrics in the Prometheus exposition format
  res.set('Content-Type', register.contentType);
  let metrics = await register.metrics();
  res.send(metrics);
})

/**
 * App
 */
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
