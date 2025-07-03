import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { NoteType } from './types';

type NotesState = {
  notes: NoteType[];
  isShootingMode: boolean;
};

type NotesAction =
  | { type: 'ADD_NOTE'; payload: Omit<NoteType, 'id' | 'position' | 'rotation' | 'color'> }
  | { type: 'REMOVE_NOTE'; payload: string }
  | { type: 'UPDATE_NOTE'; payload: { id: string; updates: Partial<NoteType> } }
  | { type: 'SET_SHOOTING_MODE'; payload: boolean };

const initialState: NotesState = {
  notes: [],
  isShootingMode: false,
};

const NotesContext = createContext<{
  state: NotesState;
  dispatch: React.Dispatch<NotesAction>;
} | undefined>(undefined);

function notesReducer(state: NotesState, action: NotesAction): NotesState {
  switch (action.type) {
    case 'ADD_NOTE': {
      const newNote: NoteType = {
        id: uuidv4(),
        ...action.payload,
        position: {
          x: Math.random() * (window.innerWidth - 300) + 50,
          y: Math.random() * (window.innerHeight - 300) + 50,
        },
        rotation: Math.random() * 20 - 10,
        color: `hsl(${Math.random() * 360}, 70%, 80%)`,
      };
      return { ...state, notes: [...state.notes, newNote] };
    }
    case 'REMOVE_NOTE':
      return { ...state, notes: state.notes.filter(note => note.id !== action.payload) };
    case 'UPDATE_NOTE':
      return {
        ...state,
        notes: state.notes.map(note =>
          note.id === action.payload.id ? { ...note, ...action.payload.updates } : note
        ),
      };
    case 'SET_SHOOTING_MODE':
      return { ...state, isShootingMode: action.payload };
    default:
      return state;
  }
}

export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(notesReducer, initialState, () => {
    const saved = localStorage.getItem('idea-wall-notes');
    return saved ? JSON.parse(saved) : initialState;
  });

  // Persist notes to localStorage
  useEffect(() => {
    localStorage.setItem('idea-wall-notes', JSON.stringify(state));
  }, [state]);

  return (
    <NotesContext.Provider value={{ state, dispatch }}>
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (context === undefined) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};
