import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import type { NoteType, Position } from './types';

interface NotesState {
  notes: NoteType[];
  isShootingMode: boolean;
  isCloudSynced: boolean;
  syncError: string | null;
}

// Define action payload types
interface AddNotePayload {
  title: string;
  description: string;
  position: Position;
  color: string;
  rotation?: number; // Optional rotation in degrees
}

interface UpdateNotePayload {
  id: string;
  updates: Partial<Omit<NoteType, 'id' | 'createdAt' | 'updatedAt'>>;
}

interface MoveNotePayload {
  id: string;
  position: Position;
}

const initialState: NotesState = {
  notes: [],
  isShootingMode: false,
  isCloudSynced: false,
  syncError: null,
};

const notesSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    addNote: {
      reducer(state, action: PayloadAction<NoteType>) {
        state.notes.push(action.payload);
      },
      prepare(note: AddNotePayload) {
        return {
          payload: {
            ...note,
            id: uuidv4(),
            content: note.description, // Map description to content for compatibility
            size: { width: 250, height: 200 }, // Default size
            rotation: note.rotation ?? Math.floor(Math.random() * 10) - 5, // Random rotation between -5 and 5 degrees
            createdAt: Date.now(),
            updatedAt: Date.now(),
          },
        };
      },
    },
    updateNote(state, action: PayloadAction<UpdateNotePayload>) {
      const { id, updates } = action.payload;
      const noteIndex = state.notes.findIndex(note => note.id === id);
      if (noteIndex !== -1) {
        state.notes[noteIndex] = {
          ...state.notes[noteIndex],
          ...updates,
          updatedAt: Date.now(),
        };
      }
    },
    deleteNote(state, action: PayloadAction<string>) {
      state.notes = state.notes.filter(note => note.id !== action.payload);
    },
    moveNote(state, action: PayloadAction<MoveNotePayload>) {
      const { id, position } = action.payload;
      const note = state.notes.find(note => note.id === id);
      if (note) {
        note.position = position;
        note.updatedAt = Date.now();
      }
    },
    toggleShootingMode(state) {
      state.isShootingMode = !state.isShootingMode;
    },
    resetBoard(state) {
      state.notes = [];
      state.isShootingMode = false;
    },
    // Cloud sync actions
    setNotesFromCloud(state, action: PayloadAction<NoteType[]>) {
      state.notes = action.payload;
      state.isCloudSynced = true;
      state.syncError = null;
    },
    setSyncError(state, action: PayloadAction<string>) {
      state.syncError = action.payload;
      state.isCloudSynced = false;
    },
    clearSyncError(state) {
      state.syncError = null;
    },
    setCloudSyncStatus(state, action: PayloadAction<boolean>) {
      state.isCloudSynced = action.payload;
    },
  },
});

export const { 
  addNote, 
  updateNote, 
  deleteNote, 
  moveNote, 
  toggleShootingMode, 
  resetBoard,
  setNotesFromCloud,
  setSyncError,
  clearSyncError,
  setCloudSyncStatus
} = notesSlice.actions;

export default notesSlice.reducer;
