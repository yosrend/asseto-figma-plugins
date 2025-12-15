import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';

console.log('ASSETO: Script loaded');

const container = document.getElementById('root');
console.log('ASSETO: Container found:', container);

if (container) {
  try {
    const root = createRoot(container);
    console.log('ASSETO: Root created');
    root.render(<App />);
    console.log('ASSETO: App rendered');
  } catch (error) {
    console.error('ASSETO: Render error:', error);
  }
} else {
  console.error('ASSETO: Root container not found!');
}
