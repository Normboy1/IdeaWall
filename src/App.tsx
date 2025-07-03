import { Provider } from 'react-redux';
import styled, { ThemeProvider } from 'styled-components';
import { GlobalStyle } from './styles/GlobalStyle';
import { theme } from './styles/theme';
import Board from './features/board/Board';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ToastProvider } from './context/ToastContext';
import { store } from './app/store';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.gray100};
`;

const MainContent = styled.main`
  flex: 1;
  position: relative;
  overflow: hidden;
`;

// Add some global styles for the toast container
const ToastStyles = styled.div`
  .toast-container {
    position: fixed;
    bottom: 1.5rem;
    right: 1.5rem;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    
    @media (max-width: 480px) {
      left: 1rem;
      right: 1rem;
      bottom: 1rem;
    }
  }
`;

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <ErrorBoundary>
        <Provider store={store}>
          <ToastProvider>
            <AppContainer>
              <MainContent>
                <Board />
              </MainContent>
              <ToastStyles />
            </AppContainer>
          </ToastProvider>
        </Provider>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
