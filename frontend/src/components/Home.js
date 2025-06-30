import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Quiz.css';
import logo from '../images/img.jpg';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="logo-container">
        <img src={logo} alt="Site Logo" className="logo" />
        <h1 className="main-title">Tech Trivia: Byte The Quiz</h1>
      </div>

      <p className="subtitle">Test your brain with quick questions on various topics!!</p>
      <button onClick={() => navigate('/domains')}>Start Quiz</button>

      {/* Footer */}
      <footer className="footer">
        <p>© 2025 Tech Trivia. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;
