const pidusage = require('pidusage');

async function getSystemMetrics() {
  const stat = await pidusage(process.pid);

  return {
    cpu: stat.cpu,
    memory: stat.memory / 1024 / 1024, // MB
  };
}

module.exports = { getSystemMetrics };