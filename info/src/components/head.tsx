import './components.css';
import React from 'react';

type Props = {
  message: string;
};

const Head: React.FC<Props> = ({ message }) => {
  return (
    <header className="App-header">
      <h1 id="head">{message}</h1>
    </header>
  );
};

export default Head;
