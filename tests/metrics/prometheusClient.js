const axios = require('axios');

const BASE_URL = 'http://localhost:4000';  //change the port in case your container is running on a different port

async function sendMetrics({ suite, status, duration, location }) {
  try {
    await axios.post(`${BASE_URL}/update`, {
      suite,
      status,
      duration,
      location
    });
  } catch (e) {
    console.log('Prometheus update failed:', e.message);
  }
}

async function startSuite(suite) {
  await axios.post(`${BASE_URL}/start`, { suite });
}

async function endSuite(suite) {
  await axios.post(`${BASE_URL}/end`, { suite });
}

module.exports = { sendMetrics, startSuite, endSuite };
