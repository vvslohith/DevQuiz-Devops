import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Quiz.css';

function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState([]);
  const [domain, setDomain] = useState('');
  const [totalQuestions, setTotalQuestions] = useState(0);

  useEffect(() => {
    const state = location.state;
    if (!state || !state.domain || !state.totalQuestions) {
      navigate('/');
      return;
    }
    setDomain(state.domain);
    setTotalQuestions(state.totalQuestions);
    axios.get(`http://localhost:5000/api/leaderboard/${state.domain}`).then(res => setLeaderboard(res.data));
  }, [location, navigate]);

  return (
    <div className="result-container">
      <h2 className="result-heading">🎉 Result Submitted Successfully!</h2>
      <h3 className="leaderboard-title">🏆 Leaderboard - {domain}</h3>

      <table className="leaderboard-table">
        <thead>
          <tr>
            <th className="table-header">Rank</th>
            <th className="table-header">Username</th>
            <th className="table-header">Score</th>
            <th className="table-header">Time (s)</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((entry, i) => (
            <tr key={i} className="table-row">
              <td className="table-cell">{i + 1}</td>
              <td className="table-cell">{entry.username}</td>
              <td className="table-cell">{entry.score}/{totalQuestions}</td>
              <td className="table-cell">{entry.timeTaken}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="back-home-btn" onClick={() => navigate('/')}>Back to Home</button>
    </div>
  );
}

export default Result;
