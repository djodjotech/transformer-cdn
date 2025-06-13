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
        // Only load the state if it has selectedTransformers
        if (parsedState.selectedTransformers) {
          store.dispatch({ type: 'transformer/loadState', payload: parsedState });
        }
      } catch (error) {
        console.error('Failed to parse saved state:', error);
      }
    }

    // Listen for storage events from other tabs
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY && event.newValue) {
        try {
          const parsedState = JSON.parse(event.newValue);
          if (parsedState.selectedTransformers) {
            store.dispatch({ type: 'transformer/loadState', payload: parsedState });
          }
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
      // Only save if we have transformers and selectedTransformers
      if (state.transformer.transformers.length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.transformer));
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);
};
