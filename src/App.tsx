import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Setup from './pages/Setup';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Reports from './pages/Reports';
import Users from './pages/Users';
import Periods from './pages/Periods';
import Settings from './pages/Settings';
import { useAuth } from './contexts/AuthContext';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

function App() {
  const [needsSetup, setNeedsSetup] = useState<boolean | null>(null);

  useEffect(() => {
    fetch('/api/setup/status')
      .then(res => res.json())
      .then(data => setNeedsSetup(data.needsSetup))
      .catch(console.error);
  }, []);

  if (needsSetup === null) {
    return <div>Loading...</div>;
  }

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {needsSetup && (
            <Route path="/setup" element={<Setup />} />
          )}
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="projects" element={<Projects />} />
            <Route path="reports" element={<Reports />} />
            <Route path="users" element={<Users />} />
            <Route path="periods" element={<Periods />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route path="*" element={
            needsSetup ? <Navigate to="/setup" /> : <Navigate to="/login" />
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;