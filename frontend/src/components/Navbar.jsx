import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const token = localStorage.getItem('token');

    try {
      await fetch('http://localhost:5000/auth/logout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (err) {
      console.error('Logout request failed', err);
    }

    localStorage.removeItem('token'); 

    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-title">Task Tracker</div>
      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>
        <Link to="/signup">Signup</Link>
        <Link to="/dashboard">Dashboard</Link>
              <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
      </div>
    </nav>
  );
};

export default Navbar;