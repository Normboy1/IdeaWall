export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface NoteType {
  id: string;
  title: string;
  content: string;
  description: string;
  position: Position;
  size: Size;
  rotation: number;
  color: string;
  createdAt: number;
  updatedAt: number;
  isDeleting?: boolean;
  deleteDirection?: 'heaven' | 'hell';
}

export interface NoteProps {
  id: string;
  title: string;
  content: string;
  color: string;
  onUpdate: (id: string, updates: Partial<NoteType>) => void;
  onDelete: (id: string) => void;
  isShooting: boolean;
}

export interface NoteFormProps {
  onSubmit: (title: string, content: string, color: string) => void;
}

export interface AddNotePayload {
  title: string;
  content: string;
  description: string;
  position: Position;
  size: Size;
  rotation: number;
  color: string;
}

export type UpdateNotePayload = {
  id: string;
  updates: Partial<Omit<NoteType, 'id'>>;
};
