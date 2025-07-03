import { screen, fireEvent, waitFor } from '@testing-library/react';
import { render } from '../../../test-utils/test-utils';
import { configureStore, createReducer, createAction } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { NotesProvider } from '../NotesContext';
import { WaterGunButton } from '../WaterGunButton';
// Create a type-safe action creator for SET_SHOOTING_MODE
const setShootingMode = createAction<boolean>('SET_SHOOTING_MODE');

type NoteType = {
  id: string;
  title: string;
  description: string;
  content: string;
  position: { x: number; y: number };
  rotation: number;
  color: string;
  createdAt: number;
  updatedAt: number;
};

type NotesState = {
  notes: NoteType[];
  isShootingMode: boolean;
};

// Mock the initial state
const initialState: NotesState = {
  notes: [],
  isShootingMode: false,
};

describe('WaterGunButton Component', () => {
  let mockStore: ReturnType<typeof configureStore>;
  let mockDispatch: jest.Mock;

  beforeEach(() => {
    // Set up fake timers for tooltip tests
    jest.useFakeTimers();
    
    // Create a simple reducer for testing
    const testReducer = createReducer(initialState, (builder) => {
      builder.addCase(setShootingMode, (state, action) => {
        state.isShootingMode = action.payload;
      });
    });

    // Mock the Redux store with initial state
    mockDispatch = jest.fn();
    mockStore = configureStore({
      reducer: {
        notes: testReducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: false,
        }),
    });

    // Mock the dispatch function
    mockStore.dispatch = mockDispatch as any;
  });

  afterEach(() => {
    // Clean up fake timers after each test
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  // Mock the NotesContext
  jest.mock('./NotesContext', () => ({
    useNotes: () => ({
      state: {
        isShootingMode: false,
        notes: [
          { 
            id: '1', 
            title: 'Test Note 1', 
            description: 'Test description 1',
            content: 'Test content 1', 
            position: { x: 100, y: 200 }, 
            rotation: 0,
            color: '#ff0000',
            createdAt: Date.now(),
            updatedAt: Date.now()
          },
          { 
            id: '2', 
            title: 'Test Note 2', 
            description: 'Test description 2',
            content: 'Test content 2', 
            position: { x: 200, y: 300 }, 
            rotation: 0,
            color: '#00ff00',
            createdAt: Date.now(),
            updatedAt: Date.now()
          },
        ],
      },
      dispatch: mockDispatch,
    }),
  }));

  const renderComponent = () => {
    return render(
      <Provider store={mockStore}>
        <NotesProvider>
          <WaterGunButton />
        </NotesProvider>
      </Provider>
    );
  };

  it('renders the water gun button with correct label', () => {
    renderComponent();
    
    const button = screen.getByRole('button', { name: /enable shooting mode/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('🔫');
  });

  it('toggles shooting mode when clicked', () => {
    renderComponent();
    
    // The button's accessible name changes based on the shooting mode state
    const button = screen.getByRole('button', { name: /shooting mode/i });
    fireEvent.click(button);
    
    // The component should dispatch SET_SHOOTING_MODE with the new state
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SET_SHOOTING_MODE',
      payload: true, // Toggling from initial state (false) to true
    });
    
    // Rerender with updated state
    mockDispatch.mockClear();
    
    // Simulate the state change in the store
    const updatedStore = {
      ...mockStore,
      getState: () => ({
        notes: {
          ...initialState,
          isShootingMode: true,
        },
      }),
    };
    
    render(
      <Provider store={updatedStore}>
        <NotesProvider>
          <WaterGunButton />
        </NotesProvider>
      </Provider>
    );
    
    const updatedButton = screen.getByRole('button', { 
      name: /shooting mode enabled/i 
    });
    
    expect(updatedButton).toHaveAttribute('aria-expanded', 'true');
  });

  it('shows tooltip on hover and hides it after delay', async () => {
    renderComponent();
    
    // Hover over the button
    const button = screen.getByRole('button', { name: /shooting mode/i });
    fireEvent.mouseEnter(button);
    
    // Tooltip should be visible
    const tooltip = await screen.findByRole('tooltip');
    expect(tooltip).toBeInTheDocument();
    expect(tooltip).toHaveTextContent(/click notes to remove them/i);
    
    // Move mouse away
    fireEvent.mouseLeave(button);
    
    // Tooltip should still be in the document due to the delay
    expect(tooltip).toBeInTheDocument();
    
    // Fast-forward time to test tooltip disappearance
    jest.advanceTimersByTime(2000);
    
    // Tooltip should be removed from the DOM after the delay
    await waitFor(() => {
      expect(tooltip).not.toBeInTheDocument();
    });
  });

  it('is accessible via keyboard', () => {
    renderComponent();
    
    const button = screen.getByRole('button', { name: /shooting mode/i });
    
    // Test Enter key
    fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' });
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SET_SHOOTING_MODE',
      payload: true,
    });
    
    // Reset mock for next test
    mockDispatch.mockClear();
    
    // Test Space key
    fireEvent.keyDown(button, { key: ' ', code: 'Space' });
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SET_SHOOTING_MODE',
      payload: true,
    });
    
    // Test other key (should not trigger)
    mockDispatch.mockClear();
    fireEvent.keyDown(button, { key: 'Escape', code: 'Escape' });
    expect(mockDispatch).not.toHaveBeenCalled();
    
    // Clean up any pending timers
    jest.runOnlyPendingTimers();
  });
});
