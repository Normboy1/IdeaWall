import { render, screen, fireEvent } from '../../../test-utils/test-utils';
import { Note } from '../Note';
import { mockNotes } from '../../../test-utils/test-utils';

describe('Note Component', () => {
  const mockOnClick = jest.fn();
  const mockOnColorChange = jest.fn();
  const note = mockNotes[0];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders note with title and description', () => {
    render(
      <Note
        note={note}
        isShootingMode={false}
        onClick={mockOnClick}
        onColorChange={mockOnColorChange}
      />
    );

    expect(screen.getByText(note.title)).toBeInTheDocument();
    expect(screen.getByText(note.description)).toBeInTheDocument();
  });

  it('calls onClick when clicked in shooting mode', () => {
    render(
      <Note
        note={note}
        isShootingMode={true}
        onClick={mockOnClick}
        onColorChange={mockOnColorChange}
      />
    );

    const noteElement = screen.getByText(note.title).closest('div');
    if (noteElement) {
      fireEvent.click(noteElement);
      expect(mockOnClick).toHaveBeenCalledWith(note.id);
    } else {
      throw new Error('Note element not found');
    }
  });

  it('does not call onClick when not in shooting mode', () => {
    render(
      <Note
        note={note}
        isShootingMode={false}
        onClick={mockOnClick}
        onColorChange={mockOnColorChange}
      />
    );

    const noteElement = screen.getByText(note.title).closest('div');
    if (noteElement) {
      fireEvent.click(noteElement);
      expect(mockOnClick).not.toHaveBeenCalled();
    } else {
      throw new Error('Note element not found');
    }
  });

  it('applies the correct background color from the note', () => {
    render(
      <Note
        note={note}
        isShootingMode={false}
        onClick={mockOnClick}
        onColorChange={mockOnColorChange}
      />
    );

    const noteElement = screen.getByText(note.title).closest('div');
    expect(noteElement).toHaveStyle(`background-color: ${note.color}`);
  });
});
