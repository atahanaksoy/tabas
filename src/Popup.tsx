import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const Popup = () => {
  return (
    <div className="p-4 text-center">
      <h1 className="text-2xl text-blue-500">Hello, World! (Popup)</h1>
    </div>
  );
};

ReactDOM.render(<Popup />, document.getElementById('root'));
