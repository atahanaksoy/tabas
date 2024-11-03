import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const NewTab = () => {
  return (
    <div className="p-4 text-center">
      <h1 className="text-2xl text-green-500">Hello, World! (New Tab)</h1>
    </div>
  );
};

ReactDOM.render(<NewTab />, document.getElementById('root'));
