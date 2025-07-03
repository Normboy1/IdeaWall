export interface NoteType {
  id: string;
  title: string;
  description: string;
  color: string;
  position: {
    x: number;
    y: number;
  };
  rotation: number;
  createdAt: number;
  updatedAt: number;
}

export interface NoteProps {
  note: NoteType;
  isShootingMode: boolean;
  onClick: (id: string) => void;
  onColorChange: (id: string, color: string) => void;
}
