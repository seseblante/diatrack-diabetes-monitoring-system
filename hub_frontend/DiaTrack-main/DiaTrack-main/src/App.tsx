import { useState, useEffect } from 'react';
import { LoginInterface } from './components/LoginInterface';
import { RegistrationPage } from './components/RegistrationPage';
import { PatientDashboard } from './components/PatientDashboard';
import { ClinicianDashboard } from './components/ClinicianDashboard';

type ViewType = 'login' | 'register' | 'patient' | 'clinician';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>('login');

  // Check for remembered session on mount
  useEffect(() => {
    const rememberedUser = localStorage.getItem('currentUser');
    const rememberMe = localStorage.getItem('rememberMe') === 'true';
    
    if (rememberedUser && rememberMe) {
      setCurrentView(rememberedUser as 'patient' | 'clinician');
    }
  }, []);

  const handleLogin = (userType: 'patient' | 'clinician') => {
    localStorage.setItem('currentUser', userType);
    setCurrentView(userType);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
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
      <div className="w-[375px] h-[812px] bg-white shadow-2xl overflow-hidden">
        {currentView === 'login' && (
          <LoginInterface 
            onLogin={handleLogin} 
            onCreateAccount={handleCreateAccount}
          />
        )}
        {currentView === 'register' && (
          <RegistrationPage 
            onBack={handleBackToLogin}
            onRegister={handleRegistrationComplete}
          />
        )}
        {currentView === 'patient' && <PatientDashboard onLogout={handleLogout} />}
        {currentView === 'clinician' && <ClinicianDashboard onLogout={handleLogout} />}
      </div>
    </div>
  );
}