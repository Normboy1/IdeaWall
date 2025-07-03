import styled from 'styled-components';

export const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
`;

export const MainContent = styled.main`
  flex: 1;
  position: relative;
  overflow-y: auto;
  padding: 2rem 1rem 180px;
  
  @media (min-width: 768px) {
    padding: 2rem 2rem 200px;
  }
`;

export const FormContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1.5rem 1rem;
  background: linear-gradient(transparent, rgba(255, 255, 255, 0.95) 20%);
  z-index: ${({ theme }) => theme.zIndex.docked};
  display: flex;
  justify-content: center;
  
  @media (min-width: 768px) {
    padding: 2rem;
  }
`;
