import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainPage from './pages/MainPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import WorkspacePage from './pages/WorkspacePage';
import NewTaskPage from './pages/NewTaskPage';
import NoiseGenPage from './pages/NoiseGenPage';
import NoiseRemPage from './pages/NoiseRemPage';
import ErrorCompPage from './pages/ErrorCompPage';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/api/display/main" />} />
      <Route path="/api/display/main" element={<MainPage />} />
      <Route path="/api/display/login" element={<LoginPage />} />
      <Route path="/api/display/signup" element={<SignUpPage />} />
      <Route path="/api/display/workspace" element={<WorkspacePage />} />
      <Route path="/api/display/workspace/newtask" element={<NewTaskPage />} />
      <Route path="/api/display/workspace/noiseGen" element={<NoiseGenPage />} />
      <Route path="/api/display/workspace/noiseRem" element={<NoiseRemPage />} />
      <Route path="/api/display/workspace/errorComp" element={<ErrorCompPage />} />
    </Routes>
  );
};

export default App;
