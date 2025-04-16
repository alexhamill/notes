import './components.css';
import React from 'react';

type Props = {
  message: string;
};

const Head: React.FC<Props> = ({ message }) => {
  return (
    <header className="App-header">
      <h1 className='header'>{message}</h1>
      <hr/>
    </header>
  );
};

export default Head;
