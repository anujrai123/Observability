const axios = require('axios');

const LOKI_URL = 'http://localhost:3100/loki/api/v1/push';

let lastTs = 0;

// Generate safe, monotonic nanosecond timestamp
function getTimestamp() {
  const now = Number(BigInt(Date.now()) * 1000000n);

  if (now <= lastTs) {
    lastTs += 1;
    return String(lastTs);
  }

  lastTs = now;
  return String(now);
}

async function pushToLoki(log) {
  try {
    const payload = {
      streams: [
        {
          stream: {
            suite: log.suite || 'unknown',
            location: log.location || 'unknown',
            run_id: log.run_id || 'unknown'
          },
          values: [
            [getTimestamp(), JSON.stringify(log)]
          ]
        }
      ]
    };

    await axios.post(LOKI_URL, payload, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 5000
    });

    // ✅ Correct logging based on status
    if (log.status === 'failure') {
      console.error('❌ Test Failed:', log.test_name, log.error);
    } else {
      console.log('✅ Test Passed:', log.test_name);
    }

  } catch (err) {
    console.error('🚨 Loki push failed:', err.message);
  }
}

module.exports = { pushToLoki };