import { openDB } from 'idb';

self.addEventListener('sync', event => {
  if (event.tag === 'sync-listings') {
    event.waitUntil(syncPendingListings());
  }
});

async function syncPendingListings() {
  const db = await openDB('gmb-offline-queue', 1);
  const items = await db.getAll('pending-listings');
  const keys = await db.getAllKeys('pending-listings');

  for (let i = 0; i < items.length; i++) {
    const { payload } = items[i];
    try {
      await fetch('/api/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${payload.token}`
        },
        body: JSON.stringify(payload)
      });
      await db.delete('pending-listings', keys[i]);
    } catch {
      // Will retry on next sync event
    }
  }
}
