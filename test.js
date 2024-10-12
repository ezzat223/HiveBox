const axios = require('axios');

async function fetchSenseBoxData() {
  try {
    const response = await axios.get('https://api.opensensemap.org/boxes/670acf5c08ceb70008f66c3b/sensors/670acf5c08ceb70008f66c3c');
    const senseBoxes = response.data;

    console.log('SenseBox Data:', senseBoxes);
  } catch (error) {
    console.error('Error fetching SenseBox data:', error.message);
  }
}

fetchSenseBoxData();
