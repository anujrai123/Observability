const express = require('express');
const client = require('prom-client');
const bodyParser = require('body-parser');
const os = require('os');

const app = express();
app.use(bodyParser.json());

// ------------------------------
// Auto location detection
// ------------------------------
const DEFAULT_LOCATION = process.env.LOCATION || 'unknown';

// ------------------------------
// Prometheus Registry
// ------------------------------
const register = new client.Registry();
client.collectDefaultMetrics({ register });

// ------------------------------
// Metrics
// ------------------------------
const totalTests = new client.Counter({
  name: 'playwright_tests_total',
  help: 'Total tests executed',
  labelNames: ['suite', 'location', 'status'],
  registers: [register],
});

const testDuration = new client.Histogram({
  name: 'playwright_test_duration_seconds',
  help: 'Test duration',
  labelNames: ['suite', 'location'],
  buckets: [0.5, 1, 2, 5, 10],
  registers: [register],
});

const testRunning = new client.Gauge({
  name: 'playwright_test_running',
  help: 'Number of running tests per suite',
  labelNames: ['suite'],
  registers: [register],
});

// ------------------------------
// In-memory state
// ------------------------------
const runningCount = new Map();

// ------------------------------
// API: Start suite
// ------------------------------
app.post('/start', (req, res) => {
  const { suite } = req.body;

  if (!suite) return res.status(400).send('suite required');

  const current = runningCount.get(suite) || 0;
  const updated = current + 1;

  runningCount.set(suite, updated);
  testRunning.set({ suite }, updated);

  console.log(`START → ${suite}, running: ${updated}`);

  res.send('suite started');
});

// ------------------------------
// API: End suite
// ------------------------------
app.post('/end', (req, res) => {
  const { suite } = req.body;

  if (!suite) return res.status(400).send('suite required');

  const current = runningCount.get(suite) || 0;
  const updated = Math.max(0, current - 1);

  runningCount.set(suite, updated);
  testRunning.set({ suite }, updated);

  console.log(`END → ${suite}, running: ${updated}`);

  res.send('suite ended');
});

// ------------------------------
// API: Record test result
// ------------------------------
app.post('/update', (req, res) => {
  const { suite, status, duration, location } = req.body;

  if (!suite || !status) {
    return res.status(400).send('suite and status required');
  }

  // auto location fallback
  const finalLocation =
  location && location.trim() !== ''
    ? location
    : 'unknown';

  console.log('UPDATE →', {
    suite,
    status,
    duration,
    finalLocation,
  });

  // increment counter
  totalTests.inc({
    suite,
    location: finalLocation,
    status,
  });

  // record duration
  if (duration !== undefined) {
    testDuration.observe(
      { suite, location: finalLocation },
      duration
    );
  }

  res.send('metric recorded');
});

// ------------------------------
// Prometheus endpoint
// ------------------------------
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// ------------------------------
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Aggregator running on port ${PORT}`);
});