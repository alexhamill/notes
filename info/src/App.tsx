import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Intropage from './intropage/intropage.tsx';
import { SignUp, SignIn } from './singuporin/signup-in.tsx';
import { UserProvider } from './base/UserContext.tsx';
import TODO from './TODO/todo.tsx';
import Dashboard from './dashboard/dashboard.tsx';

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/notes" element={<Intropage />} />
          <Route path="/notes/signup" element={<div><SignUp /><SignIn /></div>} />
          <Route path="/notes/todo" element={<TODO />} />
          <Route path="/notes/dashboard" element={<Dashboard />} />
          {/* Redirect any unknown route back to the intro page */}
          <Route path="*" element={<Navigate to="/notes" replace />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
