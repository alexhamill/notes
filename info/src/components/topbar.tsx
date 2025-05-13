import React from "react";
import { Link } from "react-router-dom";

const Topbar: React.FC = () => {
    return (
        <div className="navbar" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: '50px',
            backgroundColor: '#white',
            display: 'flex',
            alignItems: 'center',
            padding: '0 20px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            zIndex: 2000
        }}>
            <Link to="/notes/dashboard/" style={{
                textDecoration: 'none',
                color: '#ffffff',
                marginRight: '20px',
                opacity: 0.9
            }}>
                <div className="navbar-link">
                    Dashboard
                </div>
            </Link>
            <Link to="/notes/Whiteboard/" style={{
                textDecoration: 'none',
                color: '#ffffff',
                opacity: 0.9
            }}>
                <div className="navbar-link">
                    Whiteboard
                </div>
            </Link>
        </div>
    );
}

export default Topbar;