import React from "react";
import { Link } from "react-router-dom";


const Topbar: React.FC = () => {
    return (
        <div className="navbar">
            <Link  to="/notes/dashboard/">
            <div className="navbar-link">
            Dashboard
            </div>
            </Link> 
        </div>
    );
}

export default Topbar;