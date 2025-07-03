import { configureStore } from '@reduxjs/toolkit';
import type { Middleware } from '@reduxjs/toolkit';
import notesReducer from '../features/notes/notesSlice';
import waterGunReducer from '../features/water-gun/waterGunSlice';
import { loadNotesFromStorage, saveNotesToStorage } from '../utils/localStorage';

// Load persisted notes from localStorage if available
const preloadedState = {
  notes: {
    notes: loadNotesFromStorage(),
    isShootingMode: false,
  },
  waterGun: {
    isShootingMode: false,
  }
};

// Create middleware to save notes to localStorage on state changes
const localStorageMiddleware: Middleware = ({ getState }) => next => (action: unknown) => {
  const result = next(action);
  
  // Save to localStorage after any action - to ensure we catch everything
  const state = getState();
  if (state && state.notes && Array.isArray(state.notes.notes)) {
    console.log(`Middleware: Action type ${(action as any).type} triggered save`); 
    saveNotesToStorage(state.notes.notes);
  }
  
  return result;
};

export const store = configureStore({
  reducer: {
    notes: notesReducer,
    waterGun: waterGunReducer,
  },
  preloadedState,
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware().concat(localStorageMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
