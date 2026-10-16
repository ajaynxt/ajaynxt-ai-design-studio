/**
 * Automated test suite for Cloud Run Multi-Provider AI Gateway
 */

const test = require('node:test');
const assert = require('node:assert/strict');
const app = require('../src/server');
const providerRegistry = require('../src/services/provider-registry');
const budget = require('../src/services/budget');

test('Gateway Health Check Endpoint', async (t) => {
  const server = app.listen(0);
  const port = server.address().port;

  const res = await fetch(`http://localhost:${port}/api/v1/health`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.status, 'healthy');
  assert.equal(data.service, 'ajaynxt-ai-studio-gateway');

  server.close();
});

test('Gateway Providers Status Endpoint reports accurate provider states', async (t) => {
  const server = app.listen(0);
  const port = server.address().port;

  const res = await fetch(`http://localhost:${port}/api/v1/providers/status`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.ok(data.count >= 5);
  assert.ok(Array.isArray(data.providers));

  const providerIds = data.providers.map(p => p.id);
  assert.ok(providerIds.includes('gemini'));
  assert.ok(providerIds.includes('nvidia_nim'));
  assert.ok(providerIds.includes('photoroom'));
  assert.ok(providerIds.includes('cloud_vision'));
  assert.ok(providerIds.includes('hugging_face'));

  // Verify that licenses and cost details are reported
  for (const p of data.providers) {
    assert.ok(p.state === 'CONFIGURED' || p.state === 'UNCONFIGURED');
    assert.ok(p.license);
    assert.ok(p.costStructure);
  }

  server.close();
});

test('Budget Controller tracks spend and warning limits', async (t) => {
  const status = budget.getBudgetStatus();
  assert.equal(typeof status.monthlyLimitUSD, 'number');
  assert.equal(typeof status.currentSpendUSD, 'number');
  assert.ok(status.status === 'HEALTHY' || status.status === 'WARNING');
});

test('Explicit Provider Routing prevents silent fallback to paid provider', async (t) => {
  assert.throws(
    () => {
      // Trying to use unconfigured Photoroom without fallback flag should throw explicit error
      providerRegistry.resolveProvider('photoroom', 'background_removal', false);
    },
    /currently UNCONFIGURED|Silent fallback is disabled/
  );
});

test('AI Refine Brief validates request payload', async (t) => {
  const server = app.listen(0);
  const port = server.address().port;

  // Post without prompt
  const res = await fetch(`http://localhost:${port}/api/v1/ai/refine-brief`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({})
  });

  assert.equal(res.status, 400);
  const data = await res.json();
  assert.equal(data.error, 'INVALID_ARGUMENT');

  server.close();
});
