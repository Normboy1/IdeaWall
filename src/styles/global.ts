import { createGlobalStyle } from 'styled-components';
import { theme } from './theme';

export const GlobalStyles = createGlobalStyle`
  /* Reset and base styles */
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  html {
    font-size: 16px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    height: 100%;
  }
  
  body {
    font-family: 'Comic Sans MS', 'Comic Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    line-height: 1.5;
    color: ${theme.colors.gray800};
    background-color: ${theme.colors.gray100};
    min-height: 100%;
    overflow-x: hidden;
  }
  
  #root {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
  
  /* Typography */
  h1, h2, h3, h4, h5, h6 {
    font-weight: 700;
    line-height: 1.2;
    margin-bottom: ${theme.spacing[4]};
  }
  
  h1 { font-size: ${theme.fontSizes['4xl']}; }
  h2 { font-size: ${theme.fontSizes['3xl']}; }
  h3 { font-size: ${theme.fontSizes['2xl']}; }
  h4 { font-size: ${theme.fontSizes.xl}; }
  h5 { font-size: ${theme.fontSizes.lg}; }
  h6 { font-size: ${theme.fontSizes.base}; }
  
  p {
    margin-bottom: ${theme.spacing[4]};
  }
  
  /* Links */
  a {
    color: ${theme.colors.primary};
    text-decoration: none;
    transition: color 0.2s ease;
    
    &:hover {
      color: ${theme.colors.secondary};
      text-decoration: underline;
    }
  }
  
  /* Buttons */
  button {
    font-family: inherit;
    cursor: pointer;
    border: none;
    background: none;
    padding: 0;
    margin: 0;
    
    &:focus {
      outline: 2px solid ${theme.colors.primary};
      outline-offset: 2px;
    }
    
    &:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }
  }
  
  /* Forms */
  input, textarea, select {
    font-family: inherit;
    font-size: 1rem;
    border: 1px solid ${theme.colors.gray300};
    border-radius: ${theme.borderRadius.md};
    padding: ${theme.spacing[2]} ${theme.spacing[3]};
    width: 100%;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
    
    &:focus {
      border-color: ${theme.colors.primary};
      box-shadow: 0 0 0 3px ${theme.colors.primary}40;
      outline: none;
    }
    
    &::placeholder {
      color: ${theme.colors.gray500};
    }
  }
  
  /* Utility classes */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }
  
  .container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 ${theme.spacing[4]};
    
    @media (min-width: 768px) {
      padding: 0 ${theme.spacing[8]};
    }
  }
`;
