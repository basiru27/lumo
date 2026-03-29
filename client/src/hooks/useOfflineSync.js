import { useEffect } from 'react';
import { dequeueAll } from '../lib/offlineQueue';
import { supabase } from '../lib/supabaseClient';
import axios from 'axios';

export function useOfflineSync() {
  useEffect(() => {
    async function flush() {
      const { items, clear } = await dequeueAll();
      if (!items.length) return;
      const { data: { session } } = await supabase.auth.getSession();
      for (const { payload } of items) {
        try {
          await axios.post('/api/listings',
            { ...payload, price: parseFloat(payload.price) },
            { headers: { Authorization: `Bearer ${session?.access_token}` } }
          );
        } catch { /* skip failed */ }
      }
      clear();
    }
    window.addEventListener('online', flush);
    return () => window.removeEventListener('online', flush);
  }, []);
}
