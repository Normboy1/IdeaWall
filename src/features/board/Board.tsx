import React, { useCallback, useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import type { RootState } from '../../app/store';
import { addNote, deleteNote, updateNote } from '../notes/notesSlice';
import type { NoteType, Position } from '../notes/types';
import { Note } from '../note/Note';
import NoteForm from '../note/NoteForm';
import { useAuth } from '../../contexts/AuthContext';
import { useCloudSync } from '../../hooks/useCloudSync';

// Styled components
const BoardContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  touch-action: none;
  -webkit-overflow-scrolling: touch;
`;

const BoardContent = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #f5f5f5;
`;

interface NoteContainerProps {
  $color: string;
  $isShooting: boolean;
}

const NoteContainer = styled(motion.div).attrs<NoteContainerProps>({
  initial: { scale: 0.5, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.5, opacity: 0 },
  transition: { duration: 0.3 }
})<NoteContainerProps>`
  position: absolute;
  width: 250px;
  min-height: 200px;
  padding: 1rem;
  border-radius: 8px;
  background-color: ${props => props.$color};
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: ${props => (props.$isShooting ? 'crosshair' : 'grab')};
  touch-action: none;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  transform-origin: center;
  z-index: 1;
  
  @media (max-width: 480px) {
    width: 140px;
    min-height: 110px;
    padding: 0.5rem;
  }
  
  &:active {
    cursor: ${props => (props.$isShooting ? 'crosshair' : 'grabbing')};
    z-index: 2;
  }
`;

const EmptyState = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: #666;
  font-size: 1.2rem;
  pointer-events: none;
`;

const FormContainer = styled.div<{ $isShooting?: boolean }>`
  position: fixed;
  bottom: 1rem;
  left: 1rem;
  right: 1rem;
  transform: none;
  margin: 0 auto;
  z-index: ${props => props.$isShooting ? 1 : 10};
  background: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-width: 500px;
  width: calc(100% - 2rem);
  opacity: ${props => props.$isShooting ? 0.7 : 1};
  pointer-events: ${props => props.$isShooting ? 'none' : 'auto'};
  transition: all 0.3s ease;
  touch-action: manipulation;
  
  @media (min-width: 768px) {
    left: 50%;
    right: auto;
    transform: translateX(-50%);
    width: auto;
    min-width: 300px;
  }
`;

const DeletedNoteContainer = styled(motion.div)<{ $color: string }>`
  position: absolute;
  width: 250px;
  min-height: 200px;
  padding: 1rem;
  border-radius: 8px;
  background-color: ${props => props.$color};
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  z-index: 100;
  pointer-events: none;
`;

const HeavenIcon = styled.div`
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 24px;
`;

const HellIcon = styled.div`
  position: absolute;
  bottom: -30px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 24px;
`;

interface BoardProps {}

const Board: React.FC<BoardProps> = () => {
  const dispatch = useDispatch();
  const notes = useSelector((state: RootState) => state.notes.notes);
  const isShootingMode = useSelector((state: RootState) => state.notes.isShootingMode);
  const { currentUser } = useAuth();
  const { syncNoteToCloud, deleteNoteFromCloud } = useCloudSync();
  const [isDragging, setIsDragging] = useState(false);
  const [, setDragStart] = useState<Position>({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);

  const handleNoteAdd = useCallback(async (title: string, content: string, color: string) => {
    const newNote = {
      id: uuidv4(),
      title,
      content,
      description: content, // For backward compatibility
      color,
      position: { x: 50, y: 50 }, // Start position slightly offset from corner
      size: { width: 250, height: 200 },
      rotation: Math.random() * 10 - 5, // Random slight rotation
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    dispatch(addNote(newNote));
    
    // Sync to cloud if user is authenticated
    if (currentUser) {
      try {
        await syncNoteToCloud(newNote);
      } catch (error) {
        console.error('Failed to sync new note to cloud:', error);
      }
    }
  }, [dispatch, currentUser, syncNoteToCloud]);

  const handleNoteUpdate = useCallback(async (id: string, updates: Partial<NoteType>) => {
    dispatch(updateNote({ id, updates }));
    
    // Sync to cloud if user is authenticated
    if (currentUser) {
      try {
        const updatedNote = notes.find(note => note.id === id);
        if (updatedNote) {
          await syncNoteToCloud({ ...updatedNote, ...updates });
        }
      } catch (error) {
        console.error('Failed to sync updated note to cloud:', error);
      }
    }
  }, [dispatch, currentUser, syncNoteToCloud, notes]);

  const [deletedNotes, setDeletedNotes] = useState<Record<string, { destination: 'heaven' | 'hell', position: Position }>>({});

  const handleNoteDelete = useCallback(async (id: string) => {
    // Find the note to get its position before deletion
    const note = notes.find((n: NoteType) => n.id === id);
    if (note) {
      // 50% chance for heaven or hell
      const destination = Math.random() < 0.5 ? 'heaven' : 'hell';
      
      // Store note in deletedNotes for animation
      setDeletedNotes(prev => ({
        ...prev,
        [id]: {
          destination,
          position: { ...note.position }
        }
      }));
      
      // Delay actual deletion for animation
      setTimeout(async () => {
        dispatch(deleteNote(id));
        
        // Delete from cloud if user is authenticated
        if (currentUser) {
          try {
            await deleteNoteFromCloud(id);
          } catch (error) {
            console.error('Failed to delete note from cloud:', error);
          }
        }
        
        // Remove from deleted notes after animation completes
        setTimeout(() => {
          setDeletedNotes(prev => {
            const updated = { ...prev };
            delete updated[id];
            return updated;
          });
        }, 1000);
      }, 1000);
    } else {
      dispatch(deleteNote(id));
    }
  }, [dispatch, notes]);

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent, noteId: string) => {
    if (isShootingMode) return;
    
    setIsDragging(true);
    setActiveNoteId(noteId);
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    setDragStart({ x: clientX, y: clientY });
    
    const note = notes.find((n: NoteType) => n.id === noteId);
    if (note) {
      setDragOffset({
        x: clientX - note.position.x,
        y: clientY - note.position.y
      });
    }
  };

  const handleDragMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDragging || !activeNoteId || !boardRef.current) return;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const boardRect = boardRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - boardRect.left - dragOffset.x, boardRect.width - 250));
    const y = Math.max(0, Math.min(clientY - boardRect.top - dragOffset.y, boardRect.height - 200));
    
    handleNoteUpdate(activeNoteId, {
      position: { x, y }
    });
  }, [isDragging, activeNoteId, dragOffset, handleNoteUpdate]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    setActiveNoteId(null);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleDragMove);
      window.addEventListener('touchmove', handleDragMove as EventListener);
      window.addEventListener('mouseup', handleDragEnd);
      window.addEventListener('touchend', handleDragEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleDragMove);
      window.removeEventListener('touchmove', handleDragMove as EventListener);
      window.removeEventListener('mouseup', handleDragEnd);
      window.removeEventListener('touchend', handleDragEnd);
    };
  }, [isDragging, handleDragMove, handleDragEnd]);

  return (
    <BoardContainer>
      <BoardContent ref={boardRef} data-testid="board">
        <AnimatePresence>
          {notes.length === 0 ? (
            <EmptyState>
              <p>Add your first note to get started!</p>
            </EmptyState>
          ) : (
            notes.map((note: NoteType) => (
              <NoteContainer
                key={note.id}
                $color={note.color}
                $isShooting={isShootingMode}
                style={{
                  left: `${note.position.x}px`,
                  top: `${note.position.y}px`,
                  transform: `rotate(${note.rotation || 0}deg)`,
                  zIndex: activeNoteId === note.id ? 10 : 1,
                }}
                onMouseDown={(e) => handleDragStart(e, note.id)}
                onTouchStart={(e) => handleDragStart(e, note.id)}
              >
                <Note
                  id={note.id}
                  title={note.title}
                  content={note.content || note.description}
                  color={note.color}
                  onUpdate={handleNoteUpdate}
                  onDelete={handleNoteDelete}
                  isShooting={isShootingMode}
                />
              </NoteContainer>
            ))
          )}
        </AnimatePresence>
        
        {/* Heaven/Hell animations for deleted notes */}
        <AnimatePresence>
          {Object.entries(deletedNotes).map(([id, { destination, position }]) => {
            const note = notes.find((n) => n.id === id);
            if (!note) return null;
            
            const isHeaven = destination === 'heaven';
            return (
              <DeletedNoteContainer
                key={`deleted-${id}`}
                $color={note.color}
                initial={{
                  opacity: 1,
                  left: `${position.x}px`,
                  top: `${position.y}px`,
                  rotate: note.rotation || 0,
                }}
                animate={{
                  opacity: 0,
                  left: `${position.x}px`,
                  top: isHeaven ? '-200px' : 'calc(100vh + 200px)',
                  rotate: isHeaven ? 0 : 180,
                  scale: 0.5,
                }}
                transition={{
                  duration: 1,
                  ease: 'easeInOut'
                }}
              >
                {isHeaven ? (
                  <HeavenIcon>😇</HeavenIcon>
                ) : (
                  <HellIcon>😈</HellIcon>
                )}
                <Note
                  id={id}
                  title={note.title}
                  content={note.content || note.description}
                  color={note.color}
                  onUpdate={() => {}}
                  onDelete={() => {}}
                  isShooting={false}
                />
              </DeletedNoteContainer>
            );
          })}
        </AnimatePresence>
      </BoardContent>
      
      <FormContainer $isShooting={isShootingMode}>
        <NoteForm onSubmit={handleNoteAdd} />
      </FormContainer>
    </BoardContainer>
  );
};

export default Board;
