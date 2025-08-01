import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

const AuthContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const SignInButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: #4285f4;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: background-color 0.2s ease;

  &:hover {
    background: #3367d6;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: white;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const UserAvatar = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 50%;
`;

const UserName = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #333;
`;

const SignOutButton = styled.button`
  padding: 6px 12px;
  background: #f1f3f4;
  color: #5f6368;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background: #e8eaed;
  }
`;

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18">
    <path
      fill="#4285F4"
      d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"
    />
    <path
      fill="#34A853"
      d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2.04a4.8 4.8 0 0 1-7.18-2.53H1.83v2.07A8 8 0 0 0 8.98 17z"
    />
    <path
      fill="#FBBC05"
      d="M4.5 10.49a4.8 4.8 0 0 1 0-3.07V5.35H1.83a8 8 0 0 0 0 7.28l2.67-2.14z"
    />
    <path
      fill="#EA4335"
      d="M8.98 4.72c1.16 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.35L4.5 7.42a4.77 4.77 0 0 1 4.48-2.7z"
    />
  </svg>
);

export const AuthButton: React.FC = () => {
  const { currentUser, signInWithGoogle, logout } = useAuth();

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Sign in failed:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  if (currentUser) {
    return (
      <AuthContainer>
        <UserInfo>
          {currentUser.photoURL && (
            <UserAvatar src={currentUser.photoURL} alt="User avatar" />
          )}
          <UserName>{currentUser.displayName || 'User'}</UserName>
          <SignOutButton onClick={handleSignOut}>Sign Out</SignOutButton>
        </UserInfo>
      </AuthContainer>
    );
  }

  return (
    <AuthContainer>
      <SignInButton
        onClick={handleSignIn}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <GoogleIcon />
        Sign in with Google
      </SignInButton>
    </AuthContainer>
  );
};
