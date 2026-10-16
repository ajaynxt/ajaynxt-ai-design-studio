/**
 * Automated test suite for Low-Cost Cloud Run Multi-Provider AI Gateway
 * Tests ₹300 INR budget cap, atomic reservations, kill switches, and timeout reconciliation.
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

  for (const p of data.providers) {
    assert.ok(['CONFIGURED', 'UNCONFIGURED', 'DISABLED_BY_ADMIN', 'UNAVAILABLE', 'QUOTA_EXHAUSTED'].includes(p.state));
    assert.ok(p.license);
    assert.ok(p.costStructure);
  }

  server.close();
});

test('Budget Controller tracks INR 300 ceiling and INR 200 AI sub-budget', async (t) => {
  const status = budget.getBudgetStatus();
  assert.equal(status.currency, 'INR');
  assert.equal(status.monthlyBudgetINR, 300.0);
  assert.equal(status.aiSubBudgetINR, 200.0);
  assert.equal(status.safetyBufferINR, 100.0);
  assert.equal(typeof status.currentSpendINR, 'number');
  assert.ok(status.status === 'HEALTHY' || status.status === 'WARNING');
});

test('Master Kill Switch blocks paid operations by default in development', async (t) => {
  // Ensure master paid ops is false (development default)
  budget.masterPaidOpsEnabled = false;

  await assert.rejects(
    async () => {
      await budget.reserveBudget({
        userId: 'test_user',
        providerId: 'gemini_image',
        operation: 'image_generation',
        isPaid: true,
        params: { resolution: '1024x1024' }
      });
    },
    /Paid AI operations are disabled by administrator/
  );
});

test('Dynamic cost estimation scales accurately by resolution', async (t) => {
  const cost512 = budget.calculateDynamicEstimatedCostUSD({
    operation: 'image_generation',
    providerId: 'gemini_image',
    resolution: '512x512'
  });
  const cost1024 = budget.calculateDynamicEstimatedCostUSD({
    operation: 'image_generation',
    providerId: 'gemini_image',
    resolution: '1024x1024'
  });
  const cost2048 = budget.calculateDynamicEstimatedCostUSD({
    operation: 'image_generation',
    providerId: 'gemini_image',
    resolution: '2048x2048'
  });

  assert.equal(cost512, 0.015);
  assert.equal(cost1024, 0.030);
  assert.equal(cost2048, 0.060);
  assert.ok(cost2048 > cost1024 && cost1024 > cost512);
});

test('Atomic Reservation locks budget and prevents concurrent identical requests', async (t) => {
  budget.masterPaidOpsEnabled = true;
  budget.operationSwitches.image_generation = true;
  budget.providerSwitches.gemini_image = true;

  const res1 = await budget.reserveBudget({
    userId: 'user_concurrency',
    providerId: 'gemini_image',
    operation: 'image_generation',
    isPaid: true,
    params: { prompt: 'Unique Cookie Packaging Design', resolution: '1024x1024' }
  });

  assert.ok(res1.allowed);
  assert.ok(res1.requestId.startsWith('res_'));

  // Attempting concurrent identical job should reject with concurrency error
  await assert.rejects(
    async () => {
      await budget.reserveBudget({
        userId: 'user_concurrency',
        providerId: 'gemini_image',
        operation: 'image_generation',
        isPaid: true,
        params: { prompt: 'Unique Cookie Packaging Design', resolution: '1024x1024' }
      });
    },
    /concurrent identical request is already in progress/
  );

  // Clean up reservation
  await budget.reconcileBudget({
    requestId: res1.requestId,
    status: 'SUCCESS',
    actualCostUSD: 0.030
  });

  // Re-enable kill switch for safety
  budget.masterPaidOpsEnabled = false;
});

test('Timeout reconciliation holds reservation in escrow instead of assuming zero cost', async (t) => {
  budget.masterPaidOpsEnabled = true;
  budget.operationSwitches.image_generation = true;
  budget.providerSwitches.gemini_image = true;

  const res = await budget.reserveBudget({
    userId: 'timeout_user',
    providerId: 'gemini_image',
    operation: 'image_generation',
    isPaid: true,
    params: { prompt: 'Timeout test case', resolution: '1024x1024' }
  });

  const reconciliation = await budget.reconcileBudget({
    requestId: res.requestId,
    status: 'TIMEOUT',
    error: 'Connection timed out after 15s'
  });

  assert.equal(reconciliation.status, 'RECONCILIATION_REQUIRED');
  assert.ok(budget.unreconciledJobs.has(res.requestId));

  // Budget status should report unreconciled count
  const status = budget.getBudgetStatus();
  assert.ok(status.unreconciledCount >= 1);
  assert.ok(status.totalReservedUSD >= 0.030);

  // Clean up
  budget.unreconciledJobs.delete(res.requestId);
  budget.masterPaidOpsEnabled = false;
});
