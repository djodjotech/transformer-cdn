import { useEffect } from 'react';
import { store } from '../store/store';

const STORAGE_KEY = 'transformer-state';

export const useLocalStorage = () => {
  useEffect(() => {
    // Load state from localStorage on initial load
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        store.dispatch({ type: 'transformer/loadState', payload: parsedState });
      } catch (error) {
        console.error('Failed to parse saved state:', error);
      }
    }

    // Listen for storage events from other tabs
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY && event.newValue) {
        try {
          const parsedState = JSON.parse(event.newValue);
          store.dispatch({ type: 'transformer/loadState', payload: parsedState });
        } catch (error) {
          console.error('Failed to parse state from storage event:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Subscribe to store changes and save to localStorage
  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      const state = store.getState();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.transformer));
    });

    return () => {
      unsubscribe();
    };
  }, []);
};
