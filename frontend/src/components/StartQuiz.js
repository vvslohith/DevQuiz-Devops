import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/Quiz.css';

function StartQuiz() {
  const { domain } = useParams();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');

  const handleStart = () => {
    if (!username.trim()) {
      alert('Please enter your username to start the quiz.');
      return;
    }
    navigate(`/quiz/${domain}`, { state: { username } });
  };

  return (
    <div className="quiz-container">
      <h2 className="quiz-title">How well do you know {domain}?</h2>

      <div className="username-container">
        <label className="username-label">Enter Username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="username-input"
        />
      </div>

      <button onClick={handleStart} className="start-button">
        Start Quiz
      </button>

      <footer className="footer-quiz">
        <hr className="footer-line" />
        <p>© 2025 Tech Trivia. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default StartQuiz;
