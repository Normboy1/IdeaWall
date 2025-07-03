import React from 'react';
import { render, screen, fireEvent, waitFor, userEvent } from '../../../test-utils/test-utils';
import { NoteForm } from '../NoteForm';
import '@testing-library/jest-dom';

describe('NoteForm Component', () => {
  it('renders the form with all fields', () => {
    render(<NoteForm />);
    
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add note/i })).toBeInTheDocument();
  });

  it('validates that title is required', async () => {
    render(<NoteForm />);
    
    const submitButton = screen.getByRole('button', { name: /add note/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument();
    });
  });

  it('allows entering text in the title and description fields', () => {
    render(<NoteForm />);
    
    const titleInput = screen.getByLabelText(/title/i) as HTMLInputElement;
    const descriptionInput = screen.getByLabelText(/description/i) as HTMLTextAreaElement;
    
    fireEvent.change(titleInput, { target: { value: 'Test Title' } });
    fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });
    
    expect(titleInput.value).toBe('Test Title');
    expect(descriptionInput.value).toBe('Test Description');
  });

  it('submits the form with valid data', async () => {
    render(<NoteForm />);
    
    const titleInput = screen.getByLabelText(/title/i);
    const descriptionInput = screen.getByLabelText(/description/i);
    const submitButton = screen.getByRole('button', { name: /add note/i });
    
    fireEvent.change(titleInput, { target: { value: 'Test Title' } });
    fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });
    fireEvent.click(submitButton);
    
    // The form should clear on successful submission
    await waitFor(() => {
      expect((titleInput as HTMLInputElement).value).toBe('');
      expect((descriptionInput as HTMLTextAreaElement).value).toBe('');
    });
  });

  it('is accessible via keyboard', async () => {
    const user = userEvent.setup();
    render(<NoteForm />);
    
    const titleInput = screen.getByLabelText(/title/i);
    const descriptionInput = screen.getByLabelText(/description/i);
    const submitButton = screen.getByRole('button', { name: /add note/i });
    
    // Tab through the form
    await user.tab();
    expect(titleInput).toHaveFocus();
    
    await user.tab();
    expect(descriptionInput).toHaveFocus();
    
    await user.tab();
    expect(submitButton).toHaveFocus();
  });
});
