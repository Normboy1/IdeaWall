import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../app/store';
import { toggleShootingMode } from './waterGunSlice';

const ButtonContainer = styled.div`
  position: fixed;
  bottom: 2rem;
  right: calc(50% - 240px);
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ButtonLabel = styled.span<{ isActive: boolean }>`
  font-weight: 600;
  color: ${({ theme, isActive }) => isActive ? theme.colors.error : theme.colors.primary};
  font-size: 1rem;
  white-space: nowrap;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 6px 12px;
  border-radius: 16px;
  border: 2px solid ${({ theme, isActive }) => isActive ? theme.colors.error : theme.colors.primary};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Button = styled.button<{ isActive: boolean }>`
  background: ${({ theme, isActive }) => 
    isActive ? theme.colors.error : theme.colors.primary};
  color: white;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  outline: none;
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const WaterGunButton: React.FC = () => {
  const dispatch = useDispatch();
  const isShootingMode = useSelector((state: RootState) => state.notes.isShootingMode);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleClick = useCallback(() => {
    dispatch(toggleShootingMode());
  }, [dispatch]);

  useEffect(() => {
    if (isShootingMode) {
      const timer = setTimeout(() => {
        setShowTooltip(true);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setShowTooltip(false);
    }
  }, [isShootingMode]);

  return (
    <>
      <ButtonContainer>
        <ButtonLabel isActive={isShootingMode}>
          Take Down Idea
        </ButtonLabel>
        <Button 
          isActive={isShootingMode}
          onClick={handleClick}
          aria-label={isShootingMode ? 'Exit shooting mode' : 'Enter shooting mode'}
          title={isShootingMode ? 'Click to exit shooting mode' : 'Click to enter shooting mode'}
        >
          🔫
        </Button>
      </ButtonContainer>
      {showTooltip && (
        <div style={{
          position: 'fixed',
          bottom: '5rem',
          right: 'calc(50% - 240px)',
          background: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '0.5rem 1rem',
          borderRadius: '4px',
          fontSize: '0.9rem',
          maxWidth: '200px',
          zIndex: 1000,
        }}>
          Click on notes to delete them. Hold Shift to send to hell!
        </div>
      )}
    </>
  );
};

export default WaterGunButton;
