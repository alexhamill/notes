import React from "react";
import "./intropage.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Intropage: React.FC = () => {
    const navigate = useNavigate();
    

    return (
        <div className="intro-page">
            <h1>Hello Welcome to my Note Taking Page</h1>
            <p>I build to for my own personal use but of course i will make it so everyone can use it if i can.</p>
            <p>so far there is nothing</p>
            <button onClick={() => navigate('/notes/signup')}>Get Started</button>
        </div>
    );
  };

export default Intropage;