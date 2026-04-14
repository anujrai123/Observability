const { test, expect } = require('@playwright/test');
const { FlipkartPage } = require('../pages/pom');

const { getSystemMetrics } = require('../metrics/systemMetrics');
const { pushToLoki } = require('../metrics/lokiClient');
const { sendMetrics, startSuite, endSuite } = require('../metrics/prometheusClient');

const SUITE = 'flipkart';
const LOCATION = process.env.LOCATION || 'unknown';;
const RUN_ID = Date.now() + '-' + Math.random().toString(36).substring(2, 8);

let flipkart;
let startMetrics;
let productPage;

test.describe.configure({ mode: 'serial' });

// ------------------------------
test.beforeAll(async () => {
  await startSuite(SUITE);
});

// ------------------------------
test.afterAll(async () => {
  await endSuite(SUITE);
});

// ------------------------------
test.beforeEach(async ({ page }) => {
  startMetrics = await getSystemMetrics();
  flipkart = new FlipkartPage(page);
  await flipkart.open('https://www.flipkart.com');
});



test.afterEach(async ({}, testInfo) => {
  const endMetrics = await getSystemMetrics();
  const errorMessage = testInfo.error
    ? testInfo.error.message
    : null;

  const deltaMemory = endMetrics.memory - startMetrics.memory;
  const status = testInfo.status === 'passed' ? 'success' : 'failure';
  const duration = Number((testInfo.duration / 1000).toFixed(2));

  // Prometheus
  await sendMetrics({
    suite: SUITE,
    status,
    duration,
    location: LOCATION,
  });

  // Loki
  await pushToLoki({
    suite: SUITE,
    test_name: testInfo.title,
    location: LOCATION,
    run_id: RUN_ID,
    status,
    ...(errorMessage && { error: errorMessage }),
    duration,
    memory_mb: Number((deltaMemory < 0 ? 0 : deltaMemory).toFixed(2)),
    cpu: Number(endMetrics.cpu.toFixed(2)),
  });
}); // ✅ THIS WAS MISSING

// ------------------------------
test('Flipkart-api-assignment-test', async ({ page }) => {
        await test.step("Search for mouse", async () => {
            await flipkart.searchItem("mouse");
        });

        await test.step("Applying Filter low to High", async () => {
            await flipkart.filterL2H();
        });

        await test.step("Open Product Page", async () => {
            productPage = await flipkart.capturingEvent("ZEBRONICS");
        });

        await test.step("Product Page Confirmation", async () => {
            await expect(productPage).toHaveTitle(/ZEBRONICS/);
        });

        await test.step("Add to cart", async () => {
            await flipkart.addingCart(productPage);
        });
});