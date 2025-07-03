import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, useAnimation } from 'framer-motion';

interface NoteProps {
  note: {
    id: string;
    title: string;
    description: string;
    position: { x: number; y: number };
    rotation: number;
    color: string;
  };
  isShootingMode: boolean;
  isBeingShot: boolean;
  onClick: () => void;
  onColorChange?: (id: string, color: string) => void;
}

// Crumpled paper texture
const crumpleTexture = `
  linear-gradient(45deg, transparent 48%, rgba(255,255,255,0.3) 50%, transparent 52%),
  linear-gradient(-45deg, transparent 48%, rgba(255,255,255,0.3) 50%, transparent 52%),
  linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px, transparent 5px, rgba(0,0,0,0.05) 6px, transparent 6px, transparent 10px),
  linear-gradient(0deg, rgba(0,0,0,0.05) 1px, transparent 1px, transparent 5px, rgba(0,0,0,0.05) 6px, transparent 6px, transparent 10px)
`;

const NoteContainer = styled(motion.div)<{ $color: string }>`
  position: absolute;
  padding: 1.8rem 2rem;
  border-radius: 8px;
  cursor: grab;
  width: 260px;
  min-height: 220px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 
    2px 2px 5px rgba(0, 0, 0, 0.2),
    inset 0 0 15px rgba(0, 0, 0, 0.1);
  background: ${props => props.$color};
  background-image: ${crumpleTexture};
  background-size: 10px 10px, 10px 10px, 20px 20px, 20px 20px;
  transform-origin: center;
  touch-action: none;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-family: 'Comic Sans MS', 'Marker Felt', 'Comic Sans', cursive, sans-serif;
  font-size: 0.9rem;
  word-break: break-word;
  border: 1px solid rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 
      3px 3px 8px rgba(0, 0, 0, 0.25),
      inset 0 0 20px rgba(0, 0, 0, 0.15);
    z-index: 10;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      transparent 0%,
      rgba(255, 255, 255, 0.3) 25%,
      rgba(255, 255, 255, 0.2) 50%,
      rgba(0, 0, 0, 0.1) 100%
    );
    border-radius: 2px;
    pointer-events: none;
    opacity: 0.8;
  }
`;

const NoteContent = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const NoteTitle = styled.h3`
  margin: 0 0 1rem 0;
  font-size: 1.5rem;
  color: #222;
  font-family: 'Comic Sans MS', 'Comic Sans', cursive;
  word-break: break-word;
  line-height: 1.3;
`;

const NoteDescription = styled.p`
  margin: 0;
  color: #444;
  font-size: 1.1rem;
  line-height: 1.5;
  font-family: 'Comic Sans MS', 'Comic Sans', cursive;
  word-break: break-word;
  flex-grow: 1;
`;

const TargetOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
`;

const TargetDot = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(255, 50, 50, 0.2);
  border: 2px solid rgba(255, 50, 50, 0.8);
  position: relative;
  
  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    border: 1px solid rgba(255, 50, 50, 0.6);
  }
  
  &::before {
    width: 36px;
    height: 36px;
  }
  
  &::after {
    width: 48px;
    height: 48px;
  }
`;

const ColorPickerContainer = styled(motion.div)`
  position: absolute;
  top: 5px;
  right: 5px;
  z-index: 5;
  background: white;
  padding: 5px;
  border-radius: 4px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const ColorSwatch = styled.div<{ $color: string; $active?: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: ${props => props.$color};
  cursor: pointer;
  border: 2px solid ${props => props.$active ? '#333' : 'transparent'};
  transition: transform 0.2s;
  
  &:hover {
    transform: scale(1.1);
  }
`;

const ColorPickerButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid rgba(0, 0, 0, 0.2);
  background: currentColor;
  cursor: pointer;
  padding: 0;
  z-index: 2;
  transition: transform 0.2s;
  
  &:hover {
    transform: scale(1.2);
  }
`;

const colorOptions = [
  '#FF9AA2', // Light red
  '#FFB7B2', // Light orange
  '#FFDAC1', // Light peach
  '#E2F0CB', // Light green
  '#B5EAD7', // Mint
  '#C7CEEA', // Light purple
  '#F8B195', // Salmon
  '#F67280', // Coral
  '#C06C84', // Dusty rose
  '#6C5B7B', // Muted purple
  '#355C7D', // Navy blue
  '#2A363B'  // Dark gray
];

const Note: React.FC<NoteProps> = ({ 
  note, 
  isShootingMode, 
  isBeingShot, 
  onClick, 
  onColorChange 
}) => {
  const controls = useAnimation();
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [hasLanded, setHasLanded] = useState(false);
  const { id, title, description, position, rotation, color } = note;
  
  const handleColorChange = (newColor: string) => {
    if (onColorChange) {
      onColorChange(id, newColor);
    }
  };

  // Handle throwing and landing animation when note is first rendered
  useEffect(() => {
    const animateThrowAndLand = async () => {
      // Start from throw position (bottom of screen)
      await controls.start({
        y: window.innerHeight * 1.5,
        x: Math.random() * 200 - 100, // Random horizontal offset
        scale: 1.2,
        rotate: Math.random() * 60 - 30, // Random initial rotation
        opacity: 0.8,
        transition: { duration: 0 }
      });
      
      // Animate throw up
      await controls.start({
        y: -100,
        scale: 1.1,
        rotate: rotation,
        opacity: 1,
        transition: {
          type: 'spring',
          damping: 10,
          stiffness: 150,
          mass: 0.8
        }
      });
      
      // Animate landing
      await controls.start({
        y: 0,
        scale: 1,
        rotate: rotation,
        transition: {
          type: 'spring',
          damping: 20,
          stiffness: 200,
          mass: 1
        }
      });
      
      // Crumple effect
      await controls.start({
        scale: [1, 1.05, 0.95, 1],
        rotate: [rotation, rotation + 5, rotation - 3, rotation],
        transition: {
          duration: 0.3,
          times: [0, 0.3, 0.8, 1]
        }
      });
      
      setHasLanded(true);
    };
    
    if (!hasLanded) {
      animateThrowAndLand();
    }
  }, [controls, rotation, hasLanded]);

  // Handle shooting animation
  useEffect(() => {
    if (isBeingShot) {
      controls.start({
        y: '100vh',
        rotate: 360,
        opacity: 0,
        scale: 0.5,
        transition: { 
          duration: 0.5, 
          ease: 'easeIn',
          scale: { duration: 0.3 },
          opacity: { duration: 0.4 }
        },
      });
    }
  }, [isBeingShot, controls]);

  return (
    <NoteContainer
      $color={color}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        cursor: isShootingMode ? 'crosshair' : 'grab',
        zIndex: isShootingMode ? 20 : 1,
        pointerEvents: isBeingShot ? 'none' : 'auto',
      }}
      drag={!isShootingMode}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.1}
      dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
      animate={controls}
      onClick={isShootingMode ? onClick : undefined}
      whileHover={!isShootingMode ? { 
        scale: 1.05, 
        zIndex: 10,
        boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
      } : {}}
      whileTap={!isShootingMode ? { 
        scale: 0.98,
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
      } : {}}
      initial={{
        x: '-50%',
        y: '-50%',
        left: '50%',
        top: '50%',
        transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
        backgroundColor: color,
        cursor: isShootingMode ? 'crosshair' : 'grab',
        zIndex: isShootingMode ? 20 : 1,
        pointerEvents: isBeingShot ? 'none' : 'auto',
        boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
      }}
      exit={{ 
        opacity: 0, 
        scale: 0.5,
        y: '100vh',
        rotate: 360
      }}
    >
      {!isShootingMode && (
        <ColorPickerButton 
          style={{ color: color }}
          onClick={(e) => {
            e.stopPropagation();
            setShowColorPicker(!showColorPicker);
          }}
          title="Change color"
        />
      )}
      
      {showColorPicker && !isShootingMode && (
        <ColorPickerContainer
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          onClick={(e) => e.stopPropagation()}
        >
          {colorOptions.map((colorOption) => (
            <ColorSwatch
              key={colorOption}
              $color={colorOption}
              $active={color === colorOption}
              onClick={() => {
                handleColorChange(colorOption);
                setShowColorPicker(false);
              }}
            />
          ))}
        </ColorPickerContainer>
      )}
      
      <NoteContent>
        <NoteTitle>{title}</NoteTitle>
        <NoteDescription>{description}</NoteDescription>
      </NoteContent>
      
      {isShootingMode && (
        <TargetOverlay>
          <TargetDot />
        </TargetOverlay>
      )}
    </NoteContainer>
  );
};

export default Note;
