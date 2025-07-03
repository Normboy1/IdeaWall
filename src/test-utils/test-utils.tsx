import type { ReactElement } from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { configureStore } from '@reduxjs/toolkit';
import type { RootState } from '../../src/app/store';
import { theme } from '../../src/styles/theme';
import { ToastProvider } from '../../src/context/ToastContext';
import notesReducer from '../../src/features/notes/notesSlice';

// Re-export everything from @testing-library/react
export * from '@testing-library/react';

// Re-export user-event
export { userEvent };

const AllTheProviders = ({ 
  children,
  preloadedState = {}
}: { 
  children: React.ReactNode;
  preloadedState?: Partial<RootState>;
}) => {
  const store = configureStore({
    reducer: {
      notes: (state = { notes: [], isShootingMode: false }, action) => {
        return notesReducer(state, action);
      },
    },
    preloadedState,
  });

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <ToastProvider>
          {children}
        </ToastProvider>
      </ThemeProvider>
    </Provider>
  );
};

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  preloadedState?: Partial<RootState>;
}

const customRender = (
  ui: ReactElement,
  { preloadedState, ...renderOptions }: CustomRenderOptions = {}
) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <AllTheProviders preloadedState={preloadedState}>
      {children}
    </AllTheProviders>
  );
  
  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

export { customRender as render };

export const mockNotes = [
  {
    id: '1',
    title: 'Test Note 1',
    description: 'This is a test note',
    color: '#FF9AA2',
    position: { x: 100, y: 100 },
    rotation: 0,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: '2',
    title: 'Test Note 2',
    description: 'Another test note',
    color: '#B5EAD7',
    position: { x: 200, y: 200 },
    rotation: 5,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];
