import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Import global styles
import './index.css';

// Get the root element
const container = document.getElementById('root');

// Create a root
const root = createRoot(container!);

// Initial render
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
