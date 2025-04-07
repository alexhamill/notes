import React from "react";
import "./intropage.css";
import { Route } from "react-router-dom";


const Intropage: React.FC = () => {
    return (
        <div className="intro-page">
            <h1>Hello Welcome to my Note Taking Page</h1>
            <p>I build to for my own personal use but of course i will make it so everyone can use it if i can.</p>
            <p>so far there is nothing</p>
            <button onClick={() => window.location.href = 'notes/signup'}>Get Started</button>
        </div>
    );
  };

export default Intropage;