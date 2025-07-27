import React, { useState } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { ChromePicker } from 'react-color';
import type { ColorResult } from 'react-color';
import type { NoteType } from '../notes/types';

export interface NoteProps {
  id: string;
  title: string;
  content: string;
  color: string;
  onUpdate: (id: string, updates: Partial<NoteType>) => void;
  onDelete: (id: string) => void;
  isShooting: boolean;
  style?: React.CSSProperties;
}
const NoteContainer = styled(motion.div)<{ $color: string; $isShooting: boolean }>`
  position: absolute;
  width: 250px;
  min-height: 200px;
  padding: 1rem;
  border-radius: 4px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background-color: ${props => props.$color};
  cursor: ${props => (props.$isShooting ? 'crosshair' : 'grab')};
  touch-action: none;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  transform-origin: center;
  transition: transform 0.1s ease-out;
  
  @media (max-width: 480px) {
    width: 140px;
    min-height: 110px;
    padding: 0.5rem;
  }
  
  &:active {
    cursor: ${props => (props.$isShooting ? 'crosshair' : 'grabbing')};
    z-index: 10;
  }
`;

const NoteHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
`;

const NoteTitle = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  flex: 1;
  cursor: text;
  word-break: break-word;
  
  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const NoteContent = styled.div`
  font-size: 0.9rem;
  color: #444;
  white-space: pre-wrap;
  word-break: break-word;
  -webkit-user-select: text;
  -moz-user-select: text;
  -ms-user-select: text;
  user-select: text;
  
  @media (max-width: 480px) {
    font-size: 0.85rem;
  }
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: #ff4444;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0.4rem 0.6rem;
  margin: -0.4rem -0.5rem -0.4rem 0.5rem;
  border-radius: 4px;
  transition: background-color 0.2s;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
  
  &:hover, &:focus {
    background-color: rgba(255, 0, 0, 0.1);
  }
  
  @media (max-width: 480px) {
    padding: 0.5rem 0.7rem;
    margin: -0.5rem -0.5rem -0.5rem 0.5rem;
  }
`;

const ColorPickerButton = styled.button`
  width: 24px;
  height: 24px;
  border: 2px solid #fff;
  border-radius: 50%;
  margin: -0.2rem 0.5rem -0.2rem -0.2rem;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
  flex-shrink: 0;
  
  @media (max-width: 480px) {
    width: 22px;
    height: 22px;
  }
`;

const ColorPickerContainer = styled.div`
  position: absolute;
  z-index: 100;
  margin-top: 10px;
`;

export const Note: React.FC<NoteProps> = ({ 
  id,
  title: initialTitle, 
  content: initialContent,
  color,
  onUpdate, 
  onDelete,
  isShooting,
  style 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleBlur = () => {
    if (title !== initialTitle || content !== initialContent) {
      onUpdate(id, { 
        title: title.trim() || 'Untitled',
        content: content,
        description: content // For backward compatibility
      });
    }
    setIsEditing(false);
  };

  const handleColorChange = (colorResult: ColorResult) => {
    onUpdate(id, { color: colorResult.hex });
    setShowColorPicker(false);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(id);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleDoubleClick = () => {
    if (!isShooting) {
      setIsEditing(true);
    }
  };

  return (
    <NoteContainer
      $color={color}
      $isShooting={isShooting}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      style={{
        ...style,
        transformOrigin: 'center',
      }}
      initial={false}
      layoutId={id}
    >
      <NoteHeader>
        <ColorPickerButton 
          style={{ backgroundColor: color }}
          onClick={(e) => {
            e.stopPropagation();
            setShowColorPicker(!showColorPicker);
          }}
          aria-label="Change note color"
        />
        
        {isEditing ? (
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            onBlur={handleBlur}
            autoFocus
            style={{
              flex: 1,
              border: 'none',
              background: 'transparent',
              fontSize: '1.1rem',
              fontWeight: 600,
              outline: 'none',
              color: '#333',
            }}
          />
        ) : (
          <NoteTitle>{title}</NoteTitle>
        )}
        
        <DeleteButton onClick={handleDelete} aria-label="Delete note">
          ×
        </DeleteButton>
      </NoteHeader>
      
      {isEditing ? (
        <textarea
          value={content}
          onChange={handleContentChange}
          onBlur={handleBlur}
          autoFocus
          style={{
            width: '100%',
            minHeight: '120px',
            border: 'none',
            background: 'transparent',
            resize: 'none',
            outline: 'none',
            fontFamily: 'inherit',
            fontSize: '0.9rem',
            color: '#444',
          }}
        />
      ) : (
        <NoteContent>
          {content || 'Double click to edit...'}
        </NoteContent>
      )}
      
      {showColorPicker && (
        <ColorPickerContainer>
          <ChromePicker
            color={color}
            onChangeComplete={handleColorChange}
            disableAlpha
          />
        </ColorPickerContainer>
      )}
    </NoteContainer>
  );
};
