import React from "react";
import "./intropage.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Intropage: React.FC = () => {
    const navigate = useNavigate();
    

    return (
        <div className="intro-page">
            <h1>Hello Welcome</h1>
            <button onClick={() => navigate('/notes/signup')}>Get Started</button>
        </div>
    );
  };

export default Intropage;