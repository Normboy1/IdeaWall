import React, { useState } from 'react';
import styled from 'styled-components';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
  touch-action: manipulation;
  
  @media (max-width: 480px) {
    gap: 0.6rem;
  }
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  touch-action: manipulation;
  min-height: 20px;
  
  @media (max-width: 480px) {
    padding: 0.65rem 0.75rem;
    font-size: 1rem;
  }
  
  &:focus {
    outline: none;
    border-color: #4a90e2;
    box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
  }
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
  min-height: 120px;
  resize: vertical;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  touch-action: manipulation;
  line-height: 1.5;
  
  @media (max-width: 480px) {
    padding: 0.65rem 0.75rem;
    font-size: 1rem;
    min-height: 100px;
  }
  
  &:focus {
    outline: none;
    border-color: #4a90e2;
    box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
  }
`;

const ColorPicker = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 0.25rem 0 0.75rem;
  touch-action: manipulation;
  
  @media (max-width: 480px) {
    gap: 0.5rem 0.4rem;
    margin: 0.25rem 0 0.5rem;
  }
`;

const ColorOption = styled.button<{ color: string; $isSelected: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${(props) => props.color};
  border: 2px solid ${(props) => (props.$isSelected ? '#333' : 'transparent')};
  cursor: pointer;
  padding: 0;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
  flex-shrink: 0;
  transition: transform 0.1s ease, border-color 0.1s ease;
  
  &:active {
    transform: scale(0.95);
  }
  
  @media (max-width: 480px) {
    width: 30px;
    height: 30px;
  }
`;

const SubmitButton = styled.button`
  padding: 0.75rem 1.25rem;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  margin-top: 0.25rem;
  transition: background-color 0.2s ease, transform 0.1s ease;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
  
  &:hover, &:focus {
    background-color: #43a047;
  }
  
  &:active {
    transform: translateY(1px);
    background-color: #3d8b40;
  }
  
  @media (max-width: 480px) {
    padding: 0.85rem 1.25rem;
    font-size: 1rem;
  }
`;

const colorOptions = [
  '#ffeb3b', // yellow
  '#ff9800', // orange
  '#f44336', // red
  '#e91e63', // pink
  '#9c27b0', // purple
  '#673ab7', // deep purple
  '#3f51b5', // indigo
  '#2196f3', // blue
  '#03a9f4', // light blue
  '#00bcd4', // cyan
  '#009688', // teal
  '#4caf50', // green
  '#8bc34a', // light green
  '#cddc39', // lime
  '#ffc107', // amber
  '#ff5722', // deep orange
  '#795548', // brown
  '#9e9e9e', // grey
  '#607d8b', // blue grey
];

interface NoteFormProps {
  onSubmit: (title: string, content: string, color: string) => void;
  initialTitle?: string;
  initialContent?: string;
  initialColor?: string;
}

const NoteForm: React.FC<NoteFormProps> = ({
  onSubmit,
  initialTitle = '',
  initialContent = '',
  initialColor = '#ffeb3b',
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [color, setColor] = useState(initialColor);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && content.trim()) {
      onSubmit(title, content, color);
      setTitle('');
      setContent('');
      setColor('#ffeb3b');
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <TextArea
        placeholder="Write your note here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
      <ColorPicker>
        {colorOptions.map((colorOption) => (
          <ColorOption
            key={colorOption}
            color={colorOption}
            $isSelected={color === colorOption}
            onClick={(e) => {
              e.preventDefault();
              setColor(colorOption);
            }}
            title={colorOption}
            aria-label={`Select color ${colorOption}`}
          />
        ))}
      </ColorPicker>
      <SubmitButton type="submit">
        {initialTitle || initialContent ? 'Update Note' : 'Add Note'}
      </SubmitButton>
    </Form>
  );
};

export default NoteForm;
