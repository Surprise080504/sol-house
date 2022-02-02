import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import reportWebVitals from './reportWebVitals';
import ComingSoon from './pages/ComingSoon';
import About from './pages/About';
import Games from './pages/Games';
import Leaderboard from './pages/Leaderboard';
import NFTs from './pages/NFTs';
import FAQ from './pages/FAQ';

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/coming-soon" element={<ComingSoon />} />
      <Route path="/about" element={<About />} />
      <Route path="/games" element={<Games />} />
      <Route path="/leaderboard" element={<Leaderboard />} />
      <Route path="/nfts" element={<NFTs />} />
      <Route path="/faq" element={<FAQ />} />
    </Routes>
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
