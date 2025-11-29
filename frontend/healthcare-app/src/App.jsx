import React, { useState, useEffect } from 'react';
import AuthPage from './components/AuthPage';
import DoctorDashboard from './components/DoctorDashboard';
import PatientDashboard from './components/PatientDashboard';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const handleLogin = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
  };

  if (!user) return <AuthPage onLogin={handleLogin} />;

  return user.role === 'doctor' ? (
    <DoctorDashboard user={user} onLogout={handleLogout} />
  ) : (
    <PatientDashboard user={user} onLogout={handleLogout} />
  );
}

export default App;