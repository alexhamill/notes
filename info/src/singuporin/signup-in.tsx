import React, { useState } from "react";
import { auth, db } from "../base/firebase"; // Import Firebase config
import { createUserWithEmailAndPassword , signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { Route } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const SignUp: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      // Register user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save additional user info to Firestore
      await setDoc(doc(db, "users", user.uid), {
        firstname,
        lastname,
        email,
        createdAt: new Date(),
      });

      console.log("User registered successfully!");
      navigate('/notes/dashboard');
    } catch (err) {
      setError("Failed to create account: " + (err as Error).message);
    }
    
  };

  return (
    <div>
      <h2>Sign Up</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSignUp}>
        <input
          type="text"
          placeholder="First Name"
          value={firstname}
          onChange={(e) => setFirstname(e.target.value)}
          required
        />
        <br/>
        <input
          type="text"
          placeholder="Last Name"
          value={lastname}
          onChange={(e) => setLastname(e.target.value)}
          required
        />
        <br/>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br/>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br/>
        <br/>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

const SignIn: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignIn = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
        const user = userCredential.user;
        console.log("user signed in",user.uid);
        navigate('/notes/dashboard');
      });
      
    } catch (err) {
      setError("Failed to sign in: " + (err as Error).message);
    }
  };

  return (
    <div>
      <h2>Sign In</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSignIn}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br/>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br/>
        <br/>
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
};
const Signpage: React.FC = () => {

  return (
  <div>
    <div style={{ display: "grid", gridTemplateAreas: `"up bar in"`, gridTemplateColumns: "1fr 1px 1fr", alignItems: "center", justifyContent: "center", height: "100vh" }}>
      <div style={{ gridArea: "up" }}>
      <SignUp />
      </div>
      <div style={{ width: "1px", backgroundColor: "black", height: "100%", gridArea: "bar"}}></div>
      <div style={{ gridArea: "in", padding: "10vw" }}>
      <SignIn />
      </div>
    </div>

  </div>
  );
}


export { SignUp, SignIn, Signpage };

