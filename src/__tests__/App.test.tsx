import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { render } from '../test-utils/test-utils';
import App from '../App';

// Mock the Note component to simplify testing
jest.mock('../features/notes/Note', () => ({
  Note: ({ note, onClick }: { note: any; onClick: (id: string) => void }) => {
    return React.createElement(
      'div',
      {
        'data-testid': 'note',
        'data-note-id': note.id,
        onClick: () => onClick(note.id),
        style: { position: 'absolute', left: note.position.x, top: note.position.y }
      },
      React.createElement('h3', null, note.title),
      React.createElement('p', null, note.description)
    );
  },
}));

describe('App Integration', () => {
  it('allows adding a new note', async () => {
    render(<App />);
    
    // Find the form inputs and button
    const titleInput = screen.getByLabelText(/title/i);
    const descriptionInput = screen.getByLabelText(/description/i);
    const addButton = screen.getByRole('button', { name: /add note/i });
    
    // Fill out the form
    fireEvent.change(titleInput, { target: { value: 'Test Note' } });
    fireEvent.change(descriptionInput, { target: { value: 'This is a test note' } });
    
    // Submit the form
    fireEvent.click(addButton);
    
    // Check if the note was added
    await waitFor(() => {
      expect(screen.getByText('Test Note')).toBeInTheDocument();
      expect(screen.getByText('This is a test note')).toBeInTheDocument();
    });
  });

  it('allows deleting a note in water gun mode', async () => {
    // Mock the initial state with some notes
    const initialState = {
      notes: [
        {
          id: '1',
          title: 'Test Note',
          description: 'To be deleted',
          color: '#FF9AA2',
          position: { x: 100, y: 100 },
          rotation: 0,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      ],
      isShootingMode: false,
    };
    
    // Render the app with the initial state
    render(<App />, {
      preloadedState: {
        notes: {
          notes: initialState.notes,
          isShootingMode: initialState.isShootingMode,
        },
      },
    });
    
    // Find and click the shooting mode button to enable shooting mode
    const shootingModeButton = screen.getByRole('button', { name: /shooting mode/i });
    fireEvent.click(shootingModeButton);
    
    // Find and click the note to delete it
    const note = screen.getByText('Test Note');
    fireEvent.click(note);
    
    // Check if the note was removed
    await waitFor(() => {
      expect(screen.queryByText('Test Note')).not.toBeInTheDocument();
    });
  });

  it('shows a toast notification when a note is added', async () => {
    render(<App />);
    
    // Add a new note
    const titleInput = screen.getByLabelText(/title/i);
    const addButton = screen.getByRole('button', { name: /add note/i });
    
    fireEvent.change(titleInput, { target: { value: 'Test Note' } });
    fireEvent.click(addButton);
    
    // Check if the toast notification appears
    await waitFor(() => {
      expect(screen.getByText('Note added successfully!')).toBeInTheDocument();
    });
  });
});
