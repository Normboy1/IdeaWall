import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { useNotes } from './NotesContext';

const Button = styled(motion.button)<{ $isActive: boolean }>`
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: 2px solid ${({ theme }) => theme.colors.white};
  background: ${({ theme, $isActive }) => 
    $isActive ? theme.colors.error : theme.colors.primary};
  color: white;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.shadows.md};
  transition: all 0.2s ease;
  position: relative;
  z-index: ${({ theme }) => theme.zIndex.docked};
  outline: none;

  &:focus-visible {
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}80;
  }

  &:hover {
    transform: scale(1.1);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }

  &:active {
    transform: scale(0.95);
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
`;

const Tooltip = styled(motion.div)`
  position: absolute;
  bottom: 100%;
  right: 0;
  margin-bottom: 1rem;
  padding: 0.5rem 1rem;
  background: ${({ theme }) => theme.colors.gray900};
  color: white;
  border-radius: 4px;
  font-size: 0.875rem;
  white-space: nowrap;
  pointer-events: none;
  
  &::after {
    content: '';
    position: absolute;
    top: 100%;
    right: 1rem;
    border-width: 6px;
    border-style: solid;
    border-color: ${({ theme }) => theme.colors.gray900} transparent transparent transparent;
  }
`;

const WaterGunButtonContainer = styled.div`
  position: relative;
`;

export const WaterGunButton: React.FC = () => {
  const { state: { isShootingMode }, dispatch } = useNotes();
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const toggleShootingMode = () => {
    dispatch({ type: 'SET_SHOOTING_MODE', payload: !isShootingMode });
    setShowTooltip(true);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      setShowTooltip(false);
    }, 2000);
  };
  
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  
  return (
    <WaterGunButtonContainer>
      <AnimatePresence>
        {showTooltip && (
          <Tooltip
            role="tooltip"
            id="shooting-mode-tooltip"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            {isShootingMode ? 'Click notes to remove them' : 'Enable shooting mode'}
          </Tooltip>
        )}
      </AnimatePresence>
      <Button
        onClick={toggleShootingMode}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        $isActive={isShootingMode}
        aria-label={isShootingMode ? 'Disable shooting mode (click notes to remove them)' : 'Enable shooting mode'}
        aria-expanded={isShootingMode}
        aria-describedby="shooting-mode-tooltip"
        aria-controls="notes-container"
        animate={{
          rotate: isShootingMode ? 360 : 0,
          scale: isShootingMode ? 1.1 : 1,
        }}
        transition={{
          rotate: { type: 'spring', stiffness: 500, damping: 30 },
          scale: { type: 'spring', stiffness: 500, damping: 30 },
        }}
        onKeyDown={(e) => {
          if (e.key === 'Escape' && isShootingMode) {
            toggleShootingMode();
          }
        }}
      >
        <span aria-hidden="true">🔫</span>
        <span className="sr-only">
          {isShootingMode ? 'Shooting mode enabled' : 'Shooting mode disabled'}
        </span>
      </Button>
    </WaterGunButtonContainer>
  );
};
