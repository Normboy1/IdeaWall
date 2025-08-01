import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { NoteType } from '../features/notes/types';

const NOTES_COLLECTION = 'notes';

export interface FirestoreNote extends Omit<NoteType, 'createdAt' | 'updatedAt'> {
  userId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export class FirestoreService {
  // Subscribe to user's notes in real-time
  static subscribeToUserNotes(
    userId: string,
    callback: (notes: NoteType[]) => void
  ): () => void {
    const notesRef = collection(db, NOTES_COLLECTION);
    const q = query(
      notesRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
      const notes: NoteType[] = snapshot.docs.map((doc) => {
        const data = doc.data() as FirestoreNote;
        return {
          ...data,
          id: doc.id,
          createdAt: data.createdAt.toMillis(),
          updatedAt: data.updatedAt.toMillis(),
        };
      });
      callback(notes);
    });
  }

  // Add a new note to Firestore
  static async addNote(userId: string, note: Omit<NoteType, 'id'>): Promise<string> {
    try {
      const notesRef = collection(db, NOTES_COLLECTION);
      const firestoreNote: Omit<FirestoreNote, 'id'> = {
        ...note,
        userId,
        createdAt: Timestamp.fromMillis(note.createdAt),
        updatedAt: Timestamp.fromMillis(note.updatedAt),
      };
      
      const docRef = await addDoc(notesRef, firestoreNote);
      return docRef.id;
    } catch (error) {
      console.error('Error adding note to Firestore:', error);
      throw error;
    }
  }

  // Update an existing note in Firestore
  static async updateNote(
    noteId: string,
    updates: Partial<Omit<NoteType, 'id' | 'createdAt'>>
  ): Promise<void> {
    try {
      const noteRef = doc(db, NOTES_COLLECTION, noteId);
      const firestoreUpdates: any = {
        ...updates,
        updatedAt: Timestamp.now(),
      };
      
      await updateDoc(noteRef, firestoreUpdates);
    } catch (error) {
      console.error('Error updating note in Firestore:', error);
      throw error;
    }
  }

  // Delete a note from Firestore
  static async deleteNote(noteId: string): Promise<void> {
    try {
      const noteRef = doc(db, NOTES_COLLECTION, noteId);
      await deleteDoc(noteRef);
    } catch (error) {
      console.error('Error deleting note from Firestore:', error);
      throw error;
    }
  }

  // Get all user notes (one-time fetch)
  static async getUserNotes(userId: string): Promise<NoteType[]> {
    try {
      const notesRef = collection(db, NOTES_COLLECTION);
      const q = query(
        notesRef,
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => {
        const data = doc.data() as FirestoreNote;
        return {
          ...data,
          id: doc.id,
          createdAt: data.createdAt.toMillis(),
          updatedAt: data.updatedAt.toMillis(),
        };
      });
    } catch (error) {
      console.error('Error fetching user notes from Firestore:', error);
      throw error;
    }
  }
}
