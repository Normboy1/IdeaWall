import { useState, useRef, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';
import Note from './components/Note.tsx';
import NoteForm from './components/NoteForm.tsx';
import { playSuccessSound } from './utils/sounds';

// Import Confetti dynamically to avoid SSR issues
const Confetti = () => {
  const [ConfettiComponent, setConfettiComponent] = useState<React.ComponentType<any> | null>(null);
  
  useEffect(() => {
    import('react-confetti').then(module => {
      setConfettiComponent(() => module.default);
    });
  }, []);
  
  if (!ConfettiComponent) return null;
  
  return (
    <ConfettiComponent
      width={window.innerWidth}
      height={window.innerHeight}
      recycle={false}
      numberOfPieces={500}
      gravity={0.2}
    />
  );
};

// Simple client-side only wrapper
const ClientOnly = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  return mounted ? <>{children}</> : null;
};

interface NoteType {
  id: string;
  title: string;
  description: string;
  position: { x: number; y: number };
  rotation: number;
  color: string;
}

const colors = ['#FF9AA2', '#FFB7B2', '#FFDAC1', '#E2F0CB', '#B5EAD7', '#C7CEEA'];

const AppContainer = styled.div`
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  padding-bottom: 200px;
  background-color: #f0f2f5;
  background-image: 
    linear-gradient(rgba(255, 255, 255, 0.8) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.8) 1px, transparent 1px),
    linear-gradient(rgba(0, 0, 0, 0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 0, 0, 0.02) 1px, transparent 1px),
    linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
  background-size: 100px 100px, 100px 100px, 20px 20px, 20px 20px, 100% 100%;
  background-position: -1px -1px, -1px -1px, 0 0, 0 0, 0 0;
  
  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 50% 50%, rgba(255,255,255,0.8) 0%, rgba(240,242,245,0.8) 100%);
    pointer-events: none;
    z-index: -1;
  }
  
  @media (max-width: 768px) {
    padding-bottom: 0;
    background-size: 50px 50px, 50px 50px, 10px 10px, 10px 10px, 100% 100%;
  }
`;

const Wall = styled(motion.div)`
  flex: 1;
  position: relative;
  overflow-y: auto;
  padding: 2rem;
  margin-bottom: 200px; /* Space for the form */
  
  @media (max-width: 768px) {
    padding: 1rem;
    margin-bottom: 180px;
  }
  flex-wrap: wrap;
  gap: 1rem;
  align-content: flex-start;
  overflow: auto;
  padding: 1rem;
`;

const Title = styled.h1`
  text-align: center;
  color: #333;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  text-align: center;
  color: #666;
  margin-bottom: 2rem;
`;

const FormWrapper = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  padding: 2rem 1rem;
  background: linear-gradient(transparent, rgba(255, 255, 255, 0.8));
  z-index: 100;
  pointer-events: none;
  box-sizing: border-box;
  
  & > * {
    pointer-events: auto;
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
  }
  
  @media (max-width: 768px) {
    padding: 1.5rem 1rem;
  }
`;

const WaterGunButton = styled(motion.button)`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background: none;
  border: none;
  font-size: 3rem;
  cursor: pointer;
  z-index: 100;
  padding: 0.5rem;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s ease;
  
  &:hover {
    transform: scale(1.1);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

function App() {
  const [notes, setNotes] = useState<NoteType[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isShootingMode, setIsShootingMode] = useState(false);
  const [shotNoteId, setShotNoteId] = useState<string | null>(null);
  const confettiTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (confettiTimeoutRef.current) {
        clearTimeout(confettiTimeoutRef.current);
      }
    };
  }, []);

  const addNote = useCallback((title: string, description: string) => {
    const newNote: NoteType = {
      id: uuidv4(),
      title,
      description,
      position: {
        x: Math.random() * 60 + 20, // Random x position (20-80%)
        y: Math.random() * 60 + 10, // Random y position (10-70%)
      },
      rotation: (Math.random() * 20) - 10, // Random rotation between -10 and 10 degrees
      color: colors[Math.floor(Math.random() * colors.length)],
    };
    
    setNotes(prevNotes => [...prevNotes, newNote]);
    
    // Show confetti and play success sound
    setShowConfetti(true);
    playSuccessSound();
    
    // Hide confetti after animation
    if (confettiTimeoutRef.current) {
      clearTimeout(confettiTimeoutRef.current);
    }
    confettiTimeoutRef.current = setTimeout(() => {
      setShowConfetti(false);
    }, 4000);
  }, []);

  const removeNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
  };
  
  const updateNoteColor = (id: string, newColor: string) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, color: newColor } : note
    ));
  };

  const handleShootNote = (noteId: string) => {
    if (!isShootingMode) return;
    
    setShotNoteId(noteId);
    setTimeout(() => {
      removeNote(noteId);
      setShotNoteId(null);
    }, 500);
  };

  const toggleShootingMode = () => {
    setIsShootingMode(!isShootingMode);
  };

  return (
    <AppContainer>
      <ClientOnly>
        {showConfetti && <Confetti />}
      </ClientOnly>
      <Title>Idea Wall</Title>
      <Subtitle>
        {isShootingMode 
          ? 'Click on a note to shoot it down! 🔫' 
          : 'Throw your ideas onto the wall. Click the water gun to remove notes.'}
      </Subtitle>
      
      <Wall>
        <AnimatePresence>
          {notes.map((note) => (
            <Note
              key={note.id}
              note={note}
              isShootingMode={isShootingMode}
              isBeingShot={shotNoteId === note.id}
              onClick={() => handleShootNote(note.id)}
              onColorChange={updateNoteColor}
            />
          ))}
        </AnimatePresence>
      </Wall>
      
      <FormWrapper>
        <NoteForm onAddNote={addNote} />
      </FormWrapper>
      
      <WaterGunButton
        onClick={toggleShootingMode}
        initial={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={isShootingMode ? { rotate: 90 } : { rotate: 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        title={isShootingMode ? 'Exit shooting mode' : 'Remove notes (shooting mode)'}
      >
        {isShootingMode ? '🎯' : '🔫'}
      </WaterGunButton>
    </AppContainer>
  );
}

export default App;
