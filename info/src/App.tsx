import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import IntroPage from './intropage/intropage.tsx';
import { SignUp, SignIn, Signpage } from './singuporin/signup-in.tsx';
import { UserProvider } from './base/UserContext.tsx';
import TODO from './TODO/todo.tsx';
import Dashboard from './dashboard/dashboard.tsx';
import './App.css';

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<IntroPage />} />
          <Route path="/notes/signup/*" element={<Signpage />} />
          <Route path="/notes/todo/*" element={<TODO />} />
          <Route path="/notes/dashboard/*" element={<Dashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
