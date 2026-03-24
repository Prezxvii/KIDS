import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Global resets and variables

// FIXED: Removed the '../' because App is now in the same folder as index.js
import App from './App'; 

// This connects the React 'App' component to the <div id="root"> 
// found inside your public/index.html file.
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);