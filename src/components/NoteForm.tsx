import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, useAnimation } from 'framer-motion';
import { playThrowSound } from '../utils/sounds';

interface NoteFormProps {
  onAddNote: (title: string, description: string) => void;
}

const FormContainer = styled(motion.form)`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  width: 100%;
  max-width: 500px;
  padding: 2rem;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.98);
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.12);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-sizing: border-box;
  
  @media (max-width: 600px) {
    width: 90%;
    padding: 1.5rem;
    gap: 1rem;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem 1.2rem;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  font-size: 1.1rem;
  font-family: 'Comic Sans MS', 'Comic Sans', cursive;
  transition: all 0.25s ease;
  background: #fff;
  box-shadow: inset 0 1px 4px rgba(0,0,0,0.08);
  box-sizing: border-box;
  
  &::placeholder {
    color: #bbb;
    font-style: italic;
    opacity: 0.8;
  }

  &:focus {
    outline: none;
    border-color: #64b5f6;
    box-shadow: 0 0 0 4px rgba(100, 181, 246, 0.15);
    transform: translateY(-1px);
  }
  
  &:hover {
    border-color: #90caf9;
  }
  
  @media (max-width: 600px) {
    padding: 0.9rem 1rem;
    font-size: 1rem;
  }
`;

const StyledTextarea = styled.textarea`
  width: 100%;
  padding: 1rem 1.2rem;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  font-size: 1.1rem;
  min-height: 120px;
  resize: vertical;
  font-family: 'Comic Sans MS', 'Comic Sans', cursive;
  transition: all 0.25s ease;
  background: #fff;
  box-shadow: inset 0 1px 4px rgba(0,0,0,0.08);
  box-sizing: border-box;
  line-height: 1.5;
  
  &::placeholder {
    color: #bbb;
    font-style: italic;
    opacity: 0.8;
  }

  &:focus {
    outline: none;
    border-color: #64b5f6;
    box-shadow: 0 0 0 4px rgba(100, 181, 246, 0.15);
    transform: translateY(-1px);
  }
  
  &:hover {
    border-color: #90caf9;
  }
  
  @media (max-width: 600px) {
    min-height: 100px;
    padding: 0.9rem 1rem;
    font-size: 1rem;
  }
`;

const Button = styled(motion.button)`
  padding: 0.9rem 2rem;
  background: linear-gradient(135deg, #2196f3, #1976d2);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  font-family: 'Comic Sans MS', 'Comic Sans', cursive;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  position: relative;
  overflow: hidden;
  z-index: 1;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(33, 150, 243, 0.3);
  transform-origin: center;
  will-change: transform, box-shadow;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #1976d2, #0d47a1);
    opacity: 0;
    transition: opacity 0.4s ease;
    z-index: -1;
  }

  &:hover:not(:disabled) {
    transform: translateY(-3px) scale(1.02);
    box-shadow: 0 6px 20px rgba(33, 150, 243, 0.4);
    &::before {
      opacity: 1;
    }
  }

  &:active:not(:disabled) {
    transform: translateY(1px) scale(0.98);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  }
  
  &:disabled {
    background: #bdbdbd;
    background-image: none;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    &::before {
      opacity: 0;
    }
  }
`;

const NoteForm: React.FC<NoteFormProps> = ({ onAddNote }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isThrowing, setIsThrowing] = useState(false);
  const controls = useAnimation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (title.trim() && description.trim()) {
      // Animate the form reset with a throw effect
      setIsThrowing(true);
      
      // Calculate throw direction (slightly random)
      const throwX = (Math.random() - 0.5) * 100;
      
      await controls.start({
        y: -100,
        x: throwX,
        opacity: 0,
        scale: 0.8,
        rotate: Math.random() * 20 - 10,
        transition: { 
          duration: 0.6, 
          ease: [0.4, 0, 0.2, 1],
          opacity: { duration: 0.4 }
        }
      });
      
      // Reset form
      const currentTitle = title;
      const currentDesc = description;
      setTitle('');
      setDescription('');
      
      // Add the note with the values before clearing
      onAddNote(currentTitle, currentDesc);
      
      // Play throw sound
      playThrowSound();
      
      // Reset form position with a bounce effect
      await controls.start({
        y: 20,
        x: 0,
        opacity: 0,
        scale: 0.9,
        rotate: 0,
        transition: { duration: 0 }
      });
      
      await controls.start({
        y: 0,
        opacity: 1,
        scale: 1,
        transition: {
          type: 'spring',
          stiffness: 400,
          damping: 20
        }
      });
      
      setIsThrowing(false);
    }
  };

  return (
    <FormContainer 
      onSubmit={handleSubmit}
      animate={controls}
      initial={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
    >
      <Input
        type="text"
        value={title}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
        placeholder="Note title"
        required
      />
      <StyledTextarea
        value={description}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
        placeholder="Your idea goes here..."
        required
      />
      <Button
        type="submit"
        disabled={isThrowing}
        whileTap={{ scale: 0.95 }}
      >
        {isThrowing ? 'Throwing...' : 'Throw Note!'}
      </Button>
    </FormContainer>
  );
};

export default NoteForm;
