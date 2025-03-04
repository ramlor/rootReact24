import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './style/Global.css'; // Asegúrate que el path sea correcto


import App from './App';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

