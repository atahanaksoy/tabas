import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Popup } from './components/Popup';
import { StateProvider } from './components/StateContext';

ReactDOM.render(
  <StateProvider>
    <Popup />
  </StateProvider>,
  document.getElementById('root')
);