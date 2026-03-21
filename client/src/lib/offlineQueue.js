import { openDB } from 'idb';

const DB_NAME = 'gmb-offline-queue';
const STORE = 'pending-listings';

async function getDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) { db.createObjectStore(STORE, { autoIncrement: true }); }
  });
}

export async function enqueue(payload) {
  const db = await getDB();
  await db.add(STORE, { payload, timestamp: Date.now() });
}

export async function dequeueAll() {
  const db = await getDB();
  const items = await db.getAll(STORE);
  const keys = await db.getAllKeys(STORE);
  return { items, keys, clear: () => keys.forEach(k => db.delete(STORE, k)) };
}
