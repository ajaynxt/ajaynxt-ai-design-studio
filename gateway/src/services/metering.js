/**
 * AJAYNXT AI Design Studio — Usage Metering Service
 * Computes exact token/call usage, calculates estimated costs, and writes to audit logs.
 */

const admin = require('firebase-admin');

class MeteringService {
  constructor() {
    this.localEvents = [];
    this.totalMonthlySpendUSD = 0;
  }

  getDb() {
    try {
      if (admin.apps.length > 0) {
        return admin.firestore();
      }
    } catch (e) {
      // Offline / uninitialized
    }
    return null;
  }

  async recordUsage({ userId, providerId, operation, units, estimatedCostUSD, metadata = {} }) {
    const timestamp = new Date().toISOString();
    const event = {
      eventId: 'evt_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 4),
      userId: userId || 'anonymous_dev',
      providerId: providerId,
      operation: operation,
      units: units || 1,
      estimatedCostUSD: parseFloat(estimatedCostUSD || 0),
      timestamp: timestamp,
      metadata: metadata
    };

    // Update in-memory counter
    this.totalMonthlySpendUSD += event.estimatedCostUSD;
    this.localEvents.unshift(event);
    if (this.localEvents.length > 100) this.localEvents.pop();

    // Persist to Firestore if available
    const db = this.getDb();
    if (db) {
      try {
        await db.collection('usage_events').doc(event.eventId).set(event);

        // Update user's aggregate usage
        if (userId && userId !== 'anonymous_dev') {
          const userUsageRef = db.collection('user_quotas').doc(userId);
          await db.runTransaction(async (t) => {
            const doc = await t.get(userUsageRef);
            if (!doc.exists) {
              t.set(userUsageRef, {
                totalOperations: 1,
                totalSpendUSD: event.estimatedCostUSD,
                lastOperation: timestamp
              });
            } else {
              const data = doc.data();
              t.update(userUsageRef, {
                totalOperations: (data.totalOperations || 0) + 1,
                totalSpendUSD: (data.totalSpendUSD || 0) + event.estimatedCostUSD,
                lastOperation: timestamp
              });
            }
          });
        }
      } catch (err) {
        console.warn('Firestore usage record notice:', err.message);
      }
    }

    return event;
  }

  getRecentEvents(limit = 20) {
    return this.localEvents.slice(0, limit);
  }

  getMonthlySpend() {
    return parseFloat(this.totalMonthlySpendUSD.toFixed(4));
  }
}

module.exports = new MeteringService();
