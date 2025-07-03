import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { useToast } from '../../context/ToastContext';

interface NoteFormProps {
  onAddNote?: (position: { x: number; y: number }) => void;
  launchPosition?: { x: number; y: number };
  onAnimationComplete?: () => void;
}

// Screen reader only class for accessibility
const srOnly = `
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

const Form = styled(motion.form)`
  .sr-only {
    ${srOnly}
  }
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  width: 100%;
  max-width: 500px;
  box-shadow: ${({ theme }) => theme.shadows.lg};
  position: relative;
  z-index: ${({ theme }) => theme.zIndex.docked};
  margin: 0 auto;
  pointer-events: auto;
`;

const InputGroup = styled.div`
  margin-bottom: 1.5rem;
  position: relative;
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.gray700};
    
    &[required]::after {
      content: ' *';
      color: ${({ theme }) => theme.colors.error};
    }
  }
  
  .error-message {
    display: block;
    color: ${({ theme }) => theme.colors.error};
    font-size: 0.875rem;
    margin-top: 0.25rem;
  }
  
  input, textarea {
    width: 100%;
    padding: 0.75rem;
    border: 2px solid ${({ theme }) => theme.colors.gray300};
    border-radius: 8px;
    font-size: 1rem;
    transition: all 0.2s ease;
    
    &:focus {
      border-color: ${({ theme }) => theme.colors.primary};
      box-shadow: 0 0 0 3px ${({ theme }) => `${theme.colors.primary}40`};
      outline: none;
    }
    
    &[aria-invalid="true"] {
      border-color: ${({ theme }) => theme.colors.error};
      
      &:focus {
        box-shadow: 0 0 0 3px ${({ theme }) => `${theme.colors.error}40`};
      }
    }
  }
  
  textarea {
    min-height: 100px;
    resize: vertical;
  }
`;

const Button = styled(motion.button)`
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.primary};
    filter: brightness(0.9);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

export const NoteForm: React.FC<NoteFormProps> = ({
  onAddNote,
  launchPosition,
  onAnimationComplete,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLaunching, setIsLaunching] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const dispatch = useDispatch();
  const { addToast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;
    
    // Get form position for launch animation
    const formRect = formRef.current?.getBoundingClientRect();
    if (!formRect) return;
    
    const launchX = formRect.left + formRect.width / 2;
    const launchY = formRect.top + formRect.height / 2;
    
    // Create note data
    const newNote = {
      title: title.trim(),
      description: description.trim(),
      position: { x: launchX, y: launchY },
      color: '#fffacd',
      rotation: Math.floor(Math.random() * 16) - 8, // Random rotation between -8 and 8 degrees
    };
    
    // Trigger launch animation
    setIsLaunching(true);
    
    // Dispatch the addNote action
    dispatch({
      type: 'notes/addNote',
      payload: newNote,
    });
    
    // Reset form
    setTitle('');
    setDescription('');
    
    // Notify parent component if needed
    if (onAddNote) {
      onAddNote({ x: launchX, y: launchY });
    }
    
    // Show success message
    addToast('Note launched onto the wall!', 'success');
  };
  
  // Animation variants for the form
  const formVariants: Variants = {
    hidden: { y: 100, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: 'spring' as const, 
        damping: 20, 
        stiffness: 300 
      }
    },
    launching: {
      scale: 0.8,
      opacity: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <Form
      ref={formRef}
      onSubmit={handleSubmit}
      initial="hidden"
      animate={isLaunching ? "launching" : "visible"}
      variants={formVariants}
      onAnimationComplete={() => {
        if (isLaunching) {
          setIsLaunching(false);
          if (onAnimationComplete) onAnimationComplete();
        }
      }}
      aria-labelledby="note-form-title"
      role="form"
      noValidate
    >
      <h2 id="note-form-title" className="sr-only">Add a new note</h2>
      <InputGroup>
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter a title"
          required
          aria-required="true"
          aria-invalid={!title.trim()}
          aria-describedby={!title.trim() ? 'title-error' : undefined}
        />
        {!title.trim() && (
          <span id="title-error" className="error-message">
            Title is required
          </span>
        )}
      </InputGroup>
      
      <InputGroup>
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter a description"
          aria-describedby="description-help"
        />
        <span id="description-help" className="sr-only">
          Optional description for your note
        </span>
      </InputGroup>
      
      <AnimatePresence>
        <Button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={!title.trim()}
          aria-disabled={!title.trim()}
        >
          Add Note
        </Button>
      </AnimatePresence>
    </Form>
  );
};
