import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const auth = getAuth();

  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <nav className="navbar">
      <div className="logo">Virtual Marriage</div>
      <button
        className="nav-toggle"
        onClick={() => setOpen(prev => !prev)}
        aria-label="Toggle navigation"
      >
        ☰
      </button>
      <div className={`nav-links ${open ? 'active' : ''}`}>
        <Link to="/">Home</Link>
        <Link to="/send">Send Proposal</Link>
        <Link to="/receive">Incoming</Link>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>
    </nav>
  );
}