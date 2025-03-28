import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import '../index.css';

// Simple rendering with error handler
try {
  const rootElement = document.getElementById('root');
  if (rootElement) {
    const root = createRoot(rootElement);
    root.render(<App />);
  } else {
    console.error('Root element not found');
  }
} catch (error) {
  console.error('Error rendering app:', error);
  
  // Fallback rendering
  const rootElement = document.getElementById('root');
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="padding: 20px; max-width: 600px; margin: 0 auto; font-family: sans-serif;">
        <h1 style="color: #0d9488;">Clean Ninja - Error</h1>
        <p>There was an error rendering the application: ${error.message}</p>
        <button onclick="window.location.reload()" 
                style="background: #0d9488; color: white; border: none; padding: 8px 16px; 
                       border-radius: 4px; margin-top: 16px; cursor: pointer;">
          Reload Page
        </button>
      </div>
    `;
  }
}