import React from "react";
import "./Home.css";
import {
  FaUserPlus,
  FaSignInAlt,
  FaTachometerAlt,
  FaTasks,
  FaClipboardCheck,
} from "react-icons/fa";

const Home = () => {
  return (
    <div className="home">
      <h1>Welcome to Task Tracker</h1>
      <h5>Track your daily tasks with ease.</h5>
      <div className="instructions-box">
        <h2>How to Use</h2>
        <ul className="steps">
          <li>
            <FaUserPlus className="icon" /> Signup to create an account.
          </li>
          <li>
            <FaSignInAlt className="icon" /> Login with your credentials.
          </li>
          <li>
            <FaTachometerAlt className="icon" /> Go to the Dashboard to manage
            tasks.
          </li>
          <li>
            <FaTasks className="icon" /> Add new tasks with due dates and
            status.
          </li>
          <li>
            <FaClipboardCheck className="icon" /> Track progress and update
            statuses.
          </li>
        </ul>
        
      </div>
        <div className="cta">
            <h2>Get Started Now!</h2>
            <p>Signup and Get your tasks managed efficiently.</p>
            <h5 className="owner">By: Mahnoor Khurram</h5>
    </div>
    </div>
  );
};

export default Home;
