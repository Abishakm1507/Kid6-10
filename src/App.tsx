import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useUserStore } from './store/userStore';

// Pages
import GetStarted from './pages/GetStarted';
import Signup from './pages/Signup';
import Onboarding from './pages/Onboarding';
import Home from './pages/Home';
import SubjectPage from './pages/SubjectPage';
import AlphabetsPage from './pages/AlphabetsPage';
import GamesPage from './pages/GamesPage';
import TalkWithMomo from './pages/TalkWithMomo';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';

// Components
import PrivateRoute from './components/PrivateRoute';

function App() {
  const { initialized } = useUserStore();

  // Initialize user data from local storage on first render
  React.useEffect(() => {
    if (!initialized) {
      useUserStore.getState().initializeFromLocalStorage();
    }
  }, [initialized]);

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<GetStarted />} />
      <Route path="/signup" element={<Signup />} />
      
      {/* Protected routes */}
      <Route element={<PrivateRoute />}>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/home" element={<Home />} />
        <Route path="/subject/:subjectId" element={<SubjectPage />} />
        <Route path="/alphabets" element={<AlphabetsPage />} />
        <Route path="/games" element={<GamesPage />} />
        <Route path="/talk-with-momo" element={<TalkWithMomo />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;