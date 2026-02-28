import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useLenis } from './hooks/useLenis';
import { HomePage } from './routes/HomePage';
import { ProjectsPage } from './routes/ProjectsPage';
import { BoardMembersPage } from './routes/BoardMembersPage';
import { AwardsAchievementsPage } from './routes/AwardsAchievementsPage';
import { JoinMovementPage } from './routes/JoinMovementPage';
import { AdminPage } from './routes/AdminPage';
import { siteConfig } from './config';
import './App.css';

function App() {
  // Initialize Lenis smooth scroll
  useLenis();

  useEffect(() => {
    if (siteConfig.siteTitle) {
      document.title = siteConfig.siteTitle;
    }
    if (siteConfig.siteDescription) {
      const meta = document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute('content', siteConfig.siteDescription);
    }
    if (siteConfig.language) {
      document.documentElement.lang = siteConfig.language;
    }
  }, []);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/projects" element={<ProjectsPage />} />
      <Route path="/board-members" element={<BoardMembersPage />} />
      <Route path="/awards-achievements" element={<AwardsAchievementsPage />} />
      <Route path="/join-the-movement" element={<JoinMovementPage />} />
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
  );
}

export default App;
