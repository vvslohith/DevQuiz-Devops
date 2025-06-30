import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import DomainSelection from './components/DomainSelection';
import Quiz from './components/Quiz';
import Result from './components/Result';
import StartQuiz from './components/StartQuiz';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/domains" element={<DomainSelection />} />
        <Route path="/quiz/:domain" element={<Quiz />} />
        <Route path="/result" element={<Result />} />
        <Route path="/start-quiz/:domain" element={<StartQuiz />} />
      </Routes>
    </Router>
  );
}

export default App;
