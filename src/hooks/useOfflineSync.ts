import { useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { fetchLeaderboards, syncPendingItems } from '../services/sync';

export const useOfflineSync = () => {
  const { state, replacePendingSync, setLeaderboards } = useAppContext();

  useEffect(() => {
    if (!state.isOnline || state.pendingSync.length === 0) {
      return;
    }

    let cancelled = false;

    const runSync = async () => {
      const remaining = await syncPendingItems(state.pendingSync);
      if (!cancelled) {
        replacePendingSync(remaining);
      }
    };

    void runSync();

    return () => {
      cancelled = true;
    };
  }, [replacePendingSync, state.isOnline, state.pendingSync]);

  useEffect(() => {
    if (!state.isOnline || !state.isAuthenticated) {
      return;
    }

    let cancelled = false;

    const loadLeaderboards = async () => {
      const data = await fetchLeaderboards();
      if (!cancelled) {
        setLeaderboards(data.weekly, data.allTime);
      }
    };

    void loadLeaderboards();

    return () => {
      cancelled = true;
    };
  }, [setLeaderboards, state.isAuthenticated, state.isOnline]);
};
