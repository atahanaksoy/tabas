import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { NewTab } from './components/NewTab';
import { StateProvider } from './components/StateContext';

ReactDOM.render(
    <StateProvider>
      <NewTab />
    </StateProvider>,
    document.getElementById('root')
  );