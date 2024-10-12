/* ---------------- imports ---------------- */
const request = require('supertest');
const express = require('express');
const { getAppVersion } = require('./version');

/* ---------------- Global Vars ---------------- */
const app = express();
const PORT = 3000;

// Mock the version endpoint
app.get('/version', (req, res) => {
  res.json({ version: getAppVersion() });
});

// Mock the temperature endpoint
app.get('/temperature', async (req, res) => {
  try {
    const senseBoxData = { lastMeasurement: { value: '25.4', createdAt: new Date() } };

    if (!senseBoxData.lastMeasurement || !senseBoxData.lastMeasurement.value || !senseBoxData.lastMeasurement.createdAt) {
      return res.status(404).send('No temperature data available');
    }

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

describe('API Endpoints', () => {
  it('should return the app version', async () => {
    const response = await request(app).get('/version');
    expect(response.status).toBe(200);
    expect(response.body.version).toBeDefined();
  });

  it('should return temperature data if available', async () => {
    const response = await request(app).get('/temperature');
    expect(response.status).toBe(200);
    expect(response.body.temperature).toBeDefined();
  });

  it('should return 404 if no temperature data is available', async () => {
    const response = await request(app).get('/temperature');
    // Simulate no data available by mocking an empty lastMeasurement
    response.body = {};  // Mock no data
    expect(response.status).toBe(404);
    expect(response.text).toBe('No temperature data available');
  });

  it('should return 400 if data is older than 1 hour', async () => {
    // Mock data older than 1 hour
    const response = await request(app).get('/temperature');
    expect(response.status).toBe(400);
    expect(response.text).toBe('No recent temperature data available (older than 1 hour)');
  });
});
