import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../styles/Quiz.css';

function Quiz() {
  const { domain } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [startTime, setStartTime] = useState(null);
  const [username] = useState(location.state?.username || '');

  useEffect(() => {
    if (!username) {
      alert('Username is required to start the quiz.');
      navigate('/');
      return;
    }

    setStartTime(Date.now());
    axios.get(`http://localhost:5000/api/questions/${domain}`).then((res) => {
      setQuestions(res.data);
    });
  }, [domain, username, navigate]);

  const handleOptionClick = (option) => {
    setAnswers({ ...answers, [currentQ]: option });
  };

  const handleSubmit = () => {
    const endTime = Date.now();
    const timeTaken = Math.floor((endTime - startTime) / 1000);
    const score = questions.reduce((acc, q, i) => acc + (answers[i] === q.correctAnswer ? 1 : 0), 0);

    axios.post('http://localhost:5000/api/submit', {
      username,
      domain,
      score,
      timeTaken,
    }).then(() => {
      navigate('/result', { state: { domain, totalQuestions: questions.length } });
    });
  };

  if (!questions.length) return <div className="quiz-container"><p>Loading questions...</p></div>;

  return (
    <div className="quiz-container">
      {currentQ === 0 && (
        <div className="welcome-box">
          <h2 className="quiz-title">Welcome, {username}!</h2>
          <p className="quiz-subtitle">Let's dive into the world of <strong>{domain}</strong> and test your knowledge!</p>
        </div>
      )}

      {questions[currentQ] && questions[currentQ].questionText && (
        <>
          <h3 className="question-counter">Question {currentQ + 1} / {questions.length}</h3>
          <h2 className="question-title">{questions[currentQ].questionText}</h2>

          <div className="options-container">
            {questions[currentQ].options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleOptionClick(opt)}
                className={`option-button ${answers[currentQ] === opt ? 'selected' : ''}`}
              >
                {opt}
              </button>
            ))}
          </div>

          <div className="nav-buttons">
            {currentQ > 0 && (
              <button onClick={() => setCurrentQ(currentQ - 1)} className="nav-button">
                Previous
              </button>
            )}
            {currentQ < questions.length - 1 ? (
              <button onClick={() => setCurrentQ(currentQ + 1)} className="nav-button">
                Next
              </button>
            ) : (
              <button onClick={handleSubmit} className="submit-button">
                Submit Quiz
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Quiz;
