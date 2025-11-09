import React, { useState } from 'react';
import { LanguageProvider, SettingsProvider } from './context/LanguageContext';
import { ChatProvider } from './context/ChatContext';
import { ThemeProvider } from './context/ThemeContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Customers from './pages/Customers';
import Services from './pages/Services';
import CreateLink from './pages/CreateLink';
import Inbox from './pages/Inbox';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Header from './components/Header';
import Transcript from './pages/Transcript';
import Invoices from './pages/Invoices';
import LoginPage from './pages/LoginPage';
import PaymentPage from './pages/PaymentPage';
import { User } from './types';

const AppContent: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activePage, setActivePage] = useState('Dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [currentUserRole, setCurrentUserRole] = useState<User['role']>('Admin');


  // Check for payment page URL params
  const urlParams = new URLSearchParams(window.location.search);
  const isPaymentPage = urlParams.has('amount') && urlParams.has('currency') && urlParams.has('customer');

  if (isPaymentPage) {
    return (
        <SettingsProvider>
          <PaymentPage />
        </SettingsProvider>
    );
  }


  const renderPage = () => {
    switch (activePage) {
      case 'Dashboard':
        return <Dashboard />;
      case 'Users':
        return <Users />;
      case 'Customers':
        return <Customers />;
      case 'Services':
        return <Services />;
      case 'CreateLink':
        return <CreateLink />;
      case 'Invoices':
        return <Invoices />;
      case 'Inbox':
        return <Inbox />;
      case 'Reports':
        return <Reports />;
      case 'Transcript':
        return <Transcript />;
      case 'Settings':
        return <Settings />;
      case 'Profile':
        return <Profile />;
      default:
        return <Dashboard />;
    }
  };

  const handleLogin = (email: string) => {
    let role: User['role'] = 'Admin';
    if (email.toLowerCase().startsWith('moderator')) {
        role = 'Moderator';
    } else if (email.toLowerCase().startsWith('agent')) {
        role = 'Agent';
    }
    setCurrentUserRole(role);
    setIsAuthenticated(true);
    setActivePage('Dashboard');
  };
  const handleGuestLogin = () => {
      setCurrentUserRole('Admin');
      setIsAuthenticated(true);
      setActivePage('Dashboard');
  };
  const handleLogout = () => setIsAuthenticated(false);

  return (
    <>
        {!isAuthenticated ? (
        <LoginPage onLogin={handleLogin} onGuestLogin={handleGuestLogin} />
        ) : (
        <div className="flex h-screen bg-[var(--background)] text-[var(--foreground)]">
            <Sidebar 
            activePage={activePage} 
            setActivePage={setActivePage} 
            isOpen={isSidebarOpen}
            setIsOpen={setSidebarOpen}
            onLogout={handleLogout}
            currentUserRole={currentUserRole}
            />
            {/* Overlay for mobile */}
            {isSidebarOpen && (
              <div 
                onClick={() => setSidebarOpen(false)} 
                className="fixed inset-0 bg-black/50 z-20 md:hidden"
                aria-hidden="true"
              />
            )}
            <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 md:${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
            <Header 
                pageTitle={activePage} 
                onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)} 
                isSidebarOpen={isSidebarOpen}
                setActivePage={setActivePage}
                onLogout={handleLogout} 
                currentUserRole={currentUserRole}
            />
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[var(--background)] p-4 sm:p-6">
                {renderPage()}
            </main>
            </div>
        </div>
        )}
    </>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <ChatProvider>
        <LanguageProvider>
          <SettingsProvider>
            <AppContent />
          </SettingsProvider>
        </LanguageProvider>
      </ChatProvider>
    </ThemeProvider>
  );
};

export default App;
