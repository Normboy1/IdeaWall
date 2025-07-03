import React, { useState } from 'react';
import styled from 'styled-components';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
`;

const TextArea = styled.textarea`
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
`;

const ColorPicker = styled.div`
  display: flex;
  gap: 0.5rem;
  margin: 0.5rem 0;
`;

const ColorOption = styled.button<{ color: string; $isSelected: boolean }>`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: ${(props) => props.color};
  border: 2px solid ${(props) => (props.$isSelected ? '#333' : 'transparent')};
  cursor: pointer;
  padding: 0;
`;

const SubmitButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 0.5rem;

  &:hover {
    background-color: #45a049;
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
