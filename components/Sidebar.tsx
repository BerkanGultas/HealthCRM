import React, { useMemo } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { useChat } from '../hooks/useChat';
import { User } from '../types';
import {
  LayoutDashboard,
  Users,
  HeartHandshake,
  Briefcase,
  Link2,
  FileText,
  Inbox,
  BarChart3,
  History,
  Settings,
  UserCircle,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onLogout: () => void;
  currentUserRole: User['role'];
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage, isOpen, setIsOpen, onLogout, currentUserRole }) => {
  const { t } = useLanguage();
  const { conversations } = useChat();

  const totalUnreadCount = useMemo(() => {
    return conversations.reduce((acc, convo) => acc + (convo.unreadCount || 0), 0);
  }, [conversations]);

  const navItems = [
    { name: 'Dashboard', key: 'sidebar.dashboard', icon: LayoutDashboard },
    { name: 'Users', key: 'sidebar.users', icon: Users },
    { name: 'Customers', key: 'sidebar.customers', icon: HeartHandshake },
    { name: 'Services', key: 'sidebar.services', icon: Briefcase },
    { name: 'CreateLink', key: 'sidebar.createlink', icon: Link2 },
    { name: 'Invoices', key: 'sidebar.invoices', icon: FileText },
    { name: 'Inbox', key: 'sidebar.inbox', icon: Inbox },
    { name: 'Reports', key: 'sidebar.reports', icon: BarChart3 },
    { name: 'Transcript', key: 'sidebar.transcript', icon: History },
    { name: 'Settings', key: 'sidebar.settings', icon: Settings },
  ];

  const visibleNavItems = useMemo(() => {
    if (currentUserRole === 'Admin') {
        return navItems;
    }
    if (currentUserRole === 'Moderator') {
        return navItems.filter(item => item.name !== 'Settings');
    }
    if (currentUserRole === 'Agent') {
        const agentPages = ['Dashboard', 'Customers', 'CreateLink', 'Invoices', 'Inbox'];
        return navItems.filter(item => agentPages.includes(item.name));
    }
    return [];
  }, [currentUserRole]);

  const handleNavClick = (page: string) => {
    setActivePage(page);
    if (window.innerWidth < 768) {
        setIsOpen(false);
    }
  };

  return (
    <div
      className={`fixed top-0 left-0 h-full bg-[var(--card-background)] border-r border-[var(--border)] flex flex-col justify-between transition-all duration-300 z-30 w-64 
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 
        md:${isOpen ? 'w-64' : 'w-20'}`}
    >
      <div>
        <div className="relative flex items-center justify-center h-20 border-b border-[var(--border)]">
          <h1 className={`absolute text-2xl font-bold text-[var(--card-foreground)] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
            <span className="text-[var(--primary)]">Health</span>CRM
          </h1>
          <span className={`absolute text-3xl font-bold text-[var(--primary)] transition-opacity duration-300 ${!isOpen ? 'opacity-100' : 'opacity-0'}`}>
            H
          </span>
        </div>
        <nav className="mt-4">
          <ul>
            {visibleNavItems.map((item) => (
              <li key={item.name} className="px-4 my-1">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.name);
                  }}
                  className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${
                    activePage === item.name
                      ? 'bg-[var(--accent)] text-[var(--accent-foreground)] font-semibold'
                      : 'text-[var(--foreground-muted)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]'
                  }`}
                >
                  <div className="relative">
                    <item.icon className="h-5 w-5" />
                    {item.name === 'Inbox' && totalUnreadCount > 0 && !isOpen && (
                        <span className="absolute -top-1 -right-1 bg-[var(--destructive)] text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center border border-white">
                            {totalUnreadCount > 9 ? '9+' : totalUnreadCount}
                        </span>
                    )}
                  </div>
                  <span className={`ml-4 flex-1 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`}>{t(item.key)}</span>
                  {item.name === 'Inbox' && totalUnreadCount > 0 && isOpen && (
                    <span className="bg-[var(--secondary)] text-[var(--secondary-foreground)] text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {totalUnreadCount}
                    </span>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="p-4 border-t border-[var(--border)]">
         <a
          href="#"
          onClick={(e) => {
              e.preventDefault();
              handleNavClick('Profile');
            }}
          className={`flex items-center p-3 rounded-lg transition-colors duration-200 mb-2 ${
            activePage === 'Profile'
                ? 'bg-[var(--accent)] text-[var(--accent-foreground)] font-semibold'
                : 'text-[var(--foreground-muted)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]'
            }`}
        >
          <UserCircle className="h-5 w-5" />
          <span className={`ml-4 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`}>{t('sidebar.profile')}</span>
        </a>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onLogout();
          }}
          className="flex items-center p-3 text-[var(--foreground-muted)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] rounded-lg transition-colors duration-200"
        >
          <LogOut className="h-5 w-5" />
          <span className={`ml-4 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`}>{t('sidebar.logout')}</span>
        </a>
      </div>
    </div>
  );
};

export default Sidebar;