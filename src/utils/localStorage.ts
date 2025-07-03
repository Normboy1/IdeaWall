// localStorage.ts
import type { NoteType } from '../features/notes/types';

// Keys used for localStorage
export const STORAGE_KEYS = {
  NOTES: 'idea-wall-notes',
};

/**
 * Saves notes data to localStorage
 */
export const saveNotesToStorage = (notes: NoteType[]): void => {
  try {
    if (!notes || !Array.isArray(notes)) {
      console.warn('Invalid notes data to save:', notes);
      return;
    }
    
    const jsonData = JSON.stringify(notes);
    localStorage.setItem(STORAGE_KEYS.NOTES, jsonData);
    console.log(`Saved ${notes.length} notes to localStorage`, notes);
  } catch (error) {
    console.error('Error saving notes to localStorage:', error);
  }
};

/**
 * Loads notes from localStorage
 */
export const loadNotesFromStorage = (): NoteType[] => {
  try {
    const notesData = localStorage.getItem(STORAGE_KEYS.NOTES);
    if (notesData) {
      const parsedNotes = JSON.parse(notesData);
      if (Array.isArray(parsedNotes)) {
        console.log(`Loaded ${parsedNotes.length} notes from localStorage`, parsedNotes);
        return parsedNotes;
      } else {
        console.warn('Invalid format in localStorage, expected array but got:', typeof parsedNotes);
      }
    } else {
      console.log('No notes found in localStorage');
    }
  } catch (error) {
    console.error('Error loading notes from localStorage:', error);
  }
  return [];
};
