import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Quiz.css';

function DomainSelection() {
  const [domains, setDomains] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/api/domains').then(res => setDomains(res.data));
  }, []);

  return (
    <div className="quiz-container">
      <h2 className="quiz-title">Please choose your domain</h2>

      <div className="domain-buttons">
        {domains.map(domain => (
          <button
            key={domain._id}
            onClick={() => navigate(`/start-quiz/${domain.name}`)}
            className="domain-button"
          >
            <h3>{domain.name}</h3>
            <p>{domain.description}</p>
          </button>
        ))}
      </div>

      {/* Footer (placed just below the buttons) */}
      <footer className="domain-footer">
        <p>© 2025 Tech Trivia. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default DomainSelection;
