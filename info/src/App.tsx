import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Intopage from './intropage/intropage.tsx';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <Router>
      <Routes>
        <Route path='/' element={<Intopage />}></Route>
      </Routes>
      </Router>
    </div>
  )
}

export default App
