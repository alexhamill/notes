import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Intopage from './intropage/intropage.tsx';
import {SignUp, SignIn} from './singuporin/signup-in.tsx';
import { UserProvider } from './base/UserContext.tsx';
import TODO from './TODO/todo.tsx';
import Dashboard from './dashboard/dashboard.tsx';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <UserProvider>
        <Router>
          <Routes>
            <Route path='/' element={<Intopage />}></Route>
            <Route path='notes/signup' element={<div><SignUp /><SignIn /></div>}></Route>
            <Route path='notes/todo' element={<TODO />}></Route>
            <Route path='notes/dashboard' element={<Dashboard />}></Route>
          </Routes>
        </Router>
      </UserProvider>
    </div>
  )
}

export default App
