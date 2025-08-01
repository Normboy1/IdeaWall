import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';

const StatusContainer = styled.div`
  position: fixed;
  bottom: 20px;
  left: 20px;
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  font-size: 12px;
  color: #666;
`;

const StatusDot = styled(motion.div)<{ $status: 'synced' | 'syncing' | 'offline' | 'error' }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${props => {
    switch (props.$status) {
      case 'synced': return '#4CAF50';
      case 'syncing': return '#FF9800';
      case 'offline': return '#9E9E9E';
      case 'error': return '#F44336';
      default: return '#9E9E9E';
    }
  }};
`;

const StatusText = styled.span`
  font-weight: 500;
`;

export const SyncStatus: React.FC = () => {
  const { currentUser } = useAuth();
  const { isCloudSynced, syncError } = useSelector((state: RootState) => state.notes);

  const getStatus = () => {
    if (!currentUser) return 'offline';
    if (syncError) return 'error';
    if (isCloudSynced) return 'synced';
    return 'syncing';
  };

  const getStatusText = () => {
    if (!currentUser) return 'Sign in to sync across devices';
    if (syncError) return `Sync error: ${syncError}`;
    if (isCloudSynced) return 'Synced to cloud';
    return 'Syncing...';
  };

  const status = getStatus();

  return (
    <StatusContainer>
      <StatusDot
        $status={status}
        animate={{
          scale: status === 'syncing' ? [1, 1.2, 1] : 1,
        }}
        transition={{
          duration: 1,
          repeat: status === 'syncing' ? Infinity : 0,
        }}
      />
      <StatusText>{getStatusText()}</StatusText>
    </StatusContainer>
  );
};
