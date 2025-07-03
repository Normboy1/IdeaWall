import React, { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

const toastAnimation = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const ToastContainer = styled.div<{ type: ToastType }>`
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  background: ${({ theme, type }) => {
    switch (type) {
      case 'success': return theme.colors.success;
      case 'error': return theme.colors.error;
      case 'warning': return theme.colors.warning;
      default: return theme.colors.primary;
    }
  }};
  color: white;
  box-shadow: ${({ theme }) => theme.shadows.lg};
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  animation: ${toastAnimation} 0.3s ease-out forwards;
  max-width: 320px;
  
  @media (max-width: 480px) {
    left: 1rem;
    right: 1rem;
    max-width: none;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.25rem;
  margin-left: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.8;
  
  &:hover {
    opacity: 1;
  }
`;

export const Toast: React.FC<ToastProps> = ({ 
  message, 
  type = 'info', 
  onClose, 
  duration = 3000 
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success': return '✓';
      case 'error': return '✕';
      case 'warning': return '⚠';
      default: return 'ℹ';
    }
  };

  return (
    <ToastContainer type={type}>
      <span>{getIcon()}</span>
      <span>{message}</span>
      <CloseButton 
        onClick={onClose}
        aria-label="Close notification"
      >
        &times;
      </CloseButton>
    </ToastContainer>
  );
};

export default Toast;
