import { Provider } from 'react-redux';
import styled, { ThemeProvider } from 'styled-components';
import { GlobalStyle } from './styles/GlobalStyle';
import { theme } from './styles/theme';
import Board from './features/board/Board';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './contexts/AuthContext';
import { AuthButton } from './components/Auth/AuthButton';
import { SyncStatus } from './components/SyncStatus';
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
          <AuthProvider>
            <ToastProvider>
              <AppContainer>
                <AuthButton />
                <SyncStatus />
                <MainContent>
                  <Board />
                </MainContent>
                <ToastStyles />
              </AppContainer>
            </ToastProvider>
          </AuthProvider>
        </Provider>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
