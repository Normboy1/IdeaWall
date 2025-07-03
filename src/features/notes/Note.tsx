import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import styled from 'styled-components';
import { HexColorPicker } from 'react-colorful';
import type { NoteProps } from './types';

const NoteContainer = styled(motion.div)<{ $color: string }>`
  position: absolute;
  padding: 1.5rem;
  border-radius: 8px;
  cursor: grab;
  width: 260px;
  min-height: 220px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: ${({ theme }) => theme.shadows.lg};
  background: ${({ $color }) => $color};
  transform-origin: center;
  touch-action: none;
  z-index: 1;
  
  &:active {
    cursor: grabbing;
  }
  
  h3 {
    margin: 0 0 1rem;
    font-size: 1.25rem;
    color: rgba(0, 0, 0, 0.8);
    word-break: break-word;
  }
  
  p {
    margin: 0 0 1.5rem;
    font-size: 0.9375rem;
    line-height: 1.5;
    color: rgba(0, 0, 0, 0.7);
    word-break: break-word;
    flex-grow: 1;
  }
  
  .note-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: auto;
    
    button {
      background: rgba(255, 255, 255, 0.7);
      border: none;
      border-radius: 4px;
      padding: 0.25rem 0.5rem;
      font-size: 0.75rem;
      cursor: pointer;
      transition: all 0.2s ease;
      
      &:hover {
        background: rgba(255, 255, 255, 0.9);
      }
    }
  }
  
  .color-picker {
    position: absolute;
    bottom: 100%;
    left: 0;
    margin-bottom: 0.5rem;
    z-index: 10;
    background: white;
    padding: 0.5rem;
    border-radius: 8px;
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
`;



export const Note: React.FC<NoteProps> = ({
  note,
  isShootingMode,
  onClick,
  onColorChange,
}) => {
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const controls = useAnimation();
  
  const handleClick = (e?: React.MouseEvent | React.KeyboardEvent) => {
    if (isShootingMode && onClick) {
      e?.stopPropagation();
      onClick(note.id);
    }
  };
  
  const handleColorChange = (color: string) => {
    if (onColorChange) {
      onColorChange(note.id, color);
    }
  };
  
  // Animate note when it's first mounted
  useEffect(() => {
    const animateNote = async () => {
      await controls.start({
        y: [100, -20, 0],
        scale: [0.8, 1.05, 1],
        rotate: [0, Math.random() * 20 - 10],
        opacity: [0, 1],
        transition: {
          duration: 0.6,
          ease: [0.16, 1, 0.3, 1]
        }
      });
    };
    
    animateNote();
  }, [controls]);
  
  return (
    <NoteContainer
      $color={note.color}
      style={{
        left: `${note.position.x}px`,
        top: `${note.position.y}px`,
      }}
      drag
      dragMomentum={false}
      dragElastic={0.1}
      dragConstraints={{
        left: 0,
        right: window.innerWidth - 300,
        top: 0,
        bottom: window.innerHeight - 300,
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={controls}
      transition={{
        type: 'spring',
        damping: 20,
        stiffness: 100,
      }}
      whileTap={{ scale: 1.05, zIndex: 10 }}
      whileHover={{ zIndex: 10 }}
      onClick={isShootingMode ? handleClick : undefined}
      role="article"
      aria-label={`Note: ${note.title}`}
      aria-describedby={`note-${note.id}-desc`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick(e);
        }
      }}
    >
      <h3 id={`note-${note.id}-title`}>{note.title}</h3>
      <p id={`note-${note.id}-desc`}>
        {note.description}
      </p>
      <div className="note-actions">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setIsColorPickerOpen(!isColorPickerOpen);
          }}
          aria-label="Change note color"
          aria-expanded={isColorPickerOpen}
          aria-controls={`color-picker-${note.id}`}
          onKeyDown={(e) => e.stopPropagation()}
        >
          🎨
        </button>
        <small style={{ opacity: 0.6 }}>
          {new Date(note.createdAt).toLocaleDateString()}
        </small>
      </div>
      
      {isColorPickerOpen && (
        <div className="color-picker">
          <HexColorPicker 
            color={note.color} 
            onChange={handleColorChange} 
          />
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setIsColorPickerOpen(false);
            }}
            style={{ width: '100%', marginTop: '0.5rem' }}
          >
            Close
          </button>
        </div>
      )}
    </NoteContainer>
  );
};
