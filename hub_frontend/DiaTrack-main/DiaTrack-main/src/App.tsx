import { useState, useEffect } from 'react';
import { LoginInterface } from './components/LoginInterface';
import { Registration } from './components/Registration';
import { PatientDashboard } from './components/PatientDashboard';
import { ClinicianDashboard } from './components/ClinicianDashboard';
import { getCurrentUser, logout as authLogout } from './api/auth';

type ViewType = 'login' | 'register' | 'patient' | 'clinician';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>('login');

  // Check for remembered session on mount
  useEffect(() => {
    const user = getCurrentUser();
    const rememberMe = localStorage.getItem('rememberMe') === 'true';
    
    if (user && rememberMe) {
      const userRole = user.role.toLowerCase();
      if (userRole === 'patient' || userRole === 'clinician') {
        setCurrentView(userRole as 'patient' | 'clinician');
      }
    }
  }, []);

  const handleLogin = (userType: 'patient' | 'clinician') => {
    setCurrentView(userType);
  };

  const handleLogout = () => {
    authLogout();
    setCurrentView('login');
  };

  const handleCreateAccount = () => {
    setCurrentView('register');
  };

  const handleBackToLogin = () => {
    setCurrentView('login');
  };

  const handleRegistrationComplete = () => {
    // After successful registration, automatically log in as patient
    // In a real app, this would depend on the account type they selected
    handleLogin('patient');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-100">
      <div className="w-[375px] h-[812px] bg-white shadow-2xl overflow-hidden relative">
        {currentView === 'login' && (
          <LoginInterface 
            onLogin={handleLogin} 
            onCreateAccount={handleCreateAccount}
          />
        )}
        {currentView === 'register' && (
          <Registration 
            onBack={handleBackToLogin}
          />
        )}
        {currentView === 'patient' && <PatientDashboard onLogout={handleLogout} />}
        {currentView === 'clinician' && <ClinicianDashboard onLogout={handleLogout} />}
      </div>
    </div>
  );
}