import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useEffect, useState } from "react";
import { auth } from "./base/firebase.ts";

import IntroPage from "./intropage/intropage.tsx";
import { Signpage } from "./singuporin/signup-in.tsx";
import { UserProvider } from "./base/UserContext.tsx";
import TODO from "./TODO/todo.tsx";
import Dashboard from "./dashboard/dashboard.tsx";
import Topbar from "./components/topbar";
import "./App.css";

function AppLayout() {
  const location = useLocation();

  const hideTopbar =
    location.pathname === "/notes/signup" || location.pathname === "/notes/" || location.pathname === "/notes";

  return (
    <>
      {!hideTopbar && <Topbar />}
      <Routes>
        <Route path="/notes" element={<IntroPage />} />
        <Route path="/notes/signup/*" element={<Signpage />} />
        <Route path="/notes/todo/*" element={<TODO />} />
        <Route path="/notes/dashboard/*" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/notes" replace />} />
      </Routes>
    </>
  );
}

function App() {
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return () => unsubscribe();
  }, []);

  return (
    <UserProvider>
      <Router>
        <AppLayout />
      </Router>
    </UserProvider>
  );
}

export default App;











// import { BrowserRouter as Router, Route, Routes, Navigate, useLocation  } from 'react-router-dom';
// import IntroPage from './intropage/intropage.tsx';
// import { SignUp, SignIn, Signpage } from './singuporin/signup-in.tsx';
// import { UserProvider } from './base/UserContext.tsx';
// import TODO from './TODO/todo.tsx';
// import Dashboard from './dashboard/dashboard.tsx';
// import './App.css';
// import Topbar from './components/topbar';
// import { useState, useEffect } from 'react';
// import { auth } from './base/firebase.ts';

// function App() {
//   const user = useState(auth.currentUser);
//   const location = useLocation();
//   const hideTopbar = location.pathname === "/notes/signup" || location.pathname === "/notes";

//   useEffect(() => {},)
//   return (
//     <UserProvider>
//       <Router>
//       { !hideTopbar && <Topbar /> }
//         <Routes>
//           <Route path="/notes" element={<IntroPage />} />
//           <Route path="/notes/signup/*" element={<Signpage />} />
//           <Route path="/notes/todo/*" element={<TODO />} />
//           <Route path="/notes/dashboard/*" element={<Dashboard />} />
//           <Route path="*" element={<Navigate to="/notes" replace />} />
//         </Routes>
//       </Router>
//     </UserProvider>
//   );
// }

// export default App;
