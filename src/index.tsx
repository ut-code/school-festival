import React from 'react';
import ReactDOM from 'react-dom';

import './config/blockly';
import './config/blockly.blocks';

import './global.css';

import { BrowserRouter } from 'react-router-dom';
import { App } from './App';
import { FirestoreProvider } from './commons/firebase';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <FirestoreProvider>
        <App />
      </FirestoreProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root'),
);
