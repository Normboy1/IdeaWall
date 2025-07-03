import { render, screen, fireEvent } from '../../../test-utils/test-utils';
import { Board } from '../Board';
import { mockNotes } from '../../../test-utils/test-utils';
import '@testing-library/jest-dom';

// Mock the Board.styles module
jest.mock('../Board.styles', () => ({
  BoardContainer: 'div',
  BoardContent: 'div',
  EmptyState: 'div'
}));

// Mock the Note component to simplify testing
jest.mock('../../notes/Note', () => ({
  Note: ({ note, onClick }: { 
    note: { 
      id: string; 
      title: string; 
      description: string; 
      position: { x: number; y: number } 
    }; 
    onClick: (id: string) => void 
  }) => {
    const React = require('react');
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

// Mock the resize observer
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.ResizeObserver = ResizeObserverMock;

describe('Board Component', () => {
  // Mock the window dimensions
  const originalInnerWidth = window.innerWidth;
  const originalInnerHeight = window.innerHeight;

  beforeAll(() => {
    Object.defineProperty(window, 'innerWidth', { value: 1024 });
    Object.defineProperty(window, 'innerHeight', { value: 768 });
  });

  afterAll(() => {
    Object.defineProperty(window, 'innerWidth', { value: originalInnerWidth });
    Object.defineProperty(window, 'innerHeight', { value: originalInnerHeight });
  });

  it('renders the board with notes', () => {
    render(<Board />, {
      preloadedState: {
        notes: {
          notes: mockNotes,
          isShootingMode: false,
        },
      },
    });
    
    // Should render all notes from the initial state
    const notes = screen.getAllByTestId('note');
    expect(notes).toHaveLength(mockNotes.length);
    
    // Check that notes have the correct titles
    mockNotes.forEach(note => {
      expect(screen.getByText(note.title)).toBeInTheDocument();
      expect(screen.getByText(note.description)).toBeInTheDocument();
    });
  });

  it('allows dragging the board', () => {
    render(<Board />, {
      preloadedState: {
        notes: {
          notes: mockNotes,
          isShootingMode: false,
        },
      },
    });
    
    // Get the board content element that has the transform style
    const boardContent = screen.getByText(mockNotes[0].title).closest('div[style*="transform"]');
    expect(boardContent).toBeInTheDocument();
    
    // Get initial transform
    const initialTransform = window.getComputedStyle(boardContent as Element).transform;
    
    // Simulate mouse down and move
    fireEvent.mouseDown(boardContent as Element, { clientX: 100, clientY: 100, button: 0 });
    fireEvent.mouseMove(window, { clientX: 200, clientY: 200 });
    fireEvent.mouseUp(window);
    
    // The board should have moved (transform should change)
    const newTransform = window.getComputedStyle(boardContent as Element).transform;
    expect(newTransform).not.toBe(initialTransform);
  });

  it('renders with notes', () => {
    render(<Board />, {
      preloadedState: {
        notes: {
          notes: mockNotes,
          isShootingMode: false,
        },
      },
    });
    
    // Verify that notes are rendered
    mockNotes.forEach(note => {
      expect(screen.getByText(note.title)).toBeInTheDocument();
    });
  });
  
  it('handles touch events', () => {
    render(<Board />, {
      preloadedState: {
        notes: {
          notes: mockNotes,
          isShootingMode: false,
        },
      },
    });
    
    // Get the board content element (using the first div since we're using a simple mock)
    const boardContent = screen.getByText(mockNotes[0].title).closest('div');
    expect(boardContent).toBeInTheDocument();
    
    // Simulate touch start
    fireEvent.touchStart(boardContent as Element, {
      touches: [{ clientX: 100, clientY: 100 }],
    });
    
    // Simulate touch move
    fireEvent.touchMove(window, {
      targetTouches: [{ clientX: 300, clientY: 300 }],
    });
    
    // Simulate touch end
    fireEvent.touchEnd(window);
  });

  it('handles double tap', () => {
    render(<Board />, {
      preloadedState: {
        notes: {
          notes: mockNotes,
          isShootingMode: false,
        },
      },
    });
    
    // Get the board content element (using the first div since we're using a simple mock)
    const boardContent = screen.getByText(mockNotes[0].title).closest('div');
    expect(boardContent).toBeInTheDocument();
    
    // Simulate double tap
    const now = Date.now();
    jest.spyOn(Date, 'now').mockImplementation(() => now);
    
    // First tap
    fireEvent.touchStart(boardContent as Element, {
      touches: [{ clientX: 100, clientY: 100 }],
    });
    fireEvent.touchEnd(window);
    
    // Second tap (within 300ms)
    jest.spyOn(Date, 'now').mockImplementation(() => now + 100);
    fireEvent.touchStart(boardContent as Element, {
      touches: [{ clientX: 100, clientY: 100 }],
    });
    fireEvent.touchEnd(window);
    
    // Clean up
    jest.restoreAllMocks();
  });
});
