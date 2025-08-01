import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '../contexts/AuthContext';
import { FirestoreService } from '../services/firestoreService';
import { 
  setNotesFromCloud, 
  setSyncError, 
  setCloudSyncStatus
} from '../features/notes/notesSlice';
import type { RootState } from '../app/store';
import type { NoteType } from '../features/notes/types';

export const useCloudSync = () => {
  const dispatch = useDispatch();
  const { currentUser } = useAuth();
  const { notes, isCloudSynced, syncError } = useSelector((state: RootState) => state.notes);

  // Subscribe to real-time updates from Firestore
  useEffect(() => {
    if (!currentUser) {
      dispatch(setCloudSyncStatus(false));
      return;
    }

    const unsubscribe = FirestoreService.subscribeToUserNotes(
      currentUser.uid,
      (cloudNotes: NoteType[]) => {
        dispatch(setNotesFromCloud(cloudNotes));
      }
    );

    return unsubscribe;
  }, [currentUser, dispatch]);

  // Sync a note to the cloud
  const syncNoteToCloud = useCallback(async (note: NoteType) => {
    if (!currentUser) return;

    try {
      // Check if note exists in cloud by looking for it in current notes
      const existingNote = notes.find(n => n.id === note.id);
      
      if (existingNote) {
        // Update existing note
        await FirestoreService.updateNote(note.id, {
          title: note.title,
          content: note.content,
          description: note.description,
          position: note.position,
          size: note.size,
          rotation: note.rotation,
          color: note.color,
        });
      } else {
        // Add new note
        const { id, ...noteWithoutId } = note;
        await FirestoreService.addNote(currentUser.uid, noteWithoutId);
        // Note: Using client-generated UUID for simplicity
      }
    } catch (error) {
      console.error('Error syncing note to cloud:', error);
      dispatch(setSyncError(error instanceof Error ? error.message : 'Sync failed'));
    }
  }, [currentUser, notes, dispatch]);

  // Delete a note from the cloud
  const deleteNoteFromCloud = useCallback(async (noteId: string) => {
    if (!currentUser) return;

    try {
      await FirestoreService.deleteNote(noteId);
    } catch (error) {
      console.error('Error deleting note from cloud:', error);
      dispatch(setSyncError(error instanceof Error ? error.message : 'Delete failed'));
    }
  }, [currentUser, dispatch]);

  // Manual sync all notes to cloud
  const syncAllNotesToCloud = useCallback(async () => {
    if (!currentUser || notes.length === 0) return;

    try {
      for (const note of notes) {
        await syncNoteToCloud(note);
      }
    } catch (error) {
      console.error('Error syncing all notes to cloud:', error);
      dispatch(setSyncError(error instanceof Error ? error.message : 'Bulk sync failed'));
    }
  }, [currentUser, notes, syncNoteToCloud, dispatch]);

  return {
    isCloudSynced,
    syncError,
    syncNoteToCloud,
    deleteNoteFromCloud,
    syncAllNotesToCloud,
  };
};
