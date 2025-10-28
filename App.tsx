
import React, { useState } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { ChatProvider } from './context/ChatContext';
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

const App: React.FC = () => {
  const [activePage, setActivePage] = useState('Dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(true);

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

  return (
    <ChatProvider>
      <LanguageProvider>
        <div className="flex h-screen bg-[#ece5dd] text-gray-800">
          <Sidebar 
            activePage={activePage} 
            setActivePage={setActivePage} 
            isOpen={isSidebarOpen}
            setIsOpen={setSidebarOpen}
          />
          <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
            <Header pageTitle={activePage} onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)} isSidebarOpen={isSidebarOpen} />
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#ece5dd] p-6">
              {renderPage()}
            </main>
          </div>
        </div>
      </LanguageProvider>
    </ChatProvider>
  );
};

export default App;