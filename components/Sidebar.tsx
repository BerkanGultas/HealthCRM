import React from 'react';
import { useLanguage } from '../hooks/useLanguage';
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
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage, isOpen, setIsOpen }) => {
  const { t } = useLanguage();

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

  return (
    <div
      className={`fixed top-0 left-0 h-full bg-white/80 backdrop-blur-lg border-r border-gray-200 flex flex-col justify-between transition-all duration-300 z-30 ${
        isOpen ? 'w-64' : 'w-20'
      }`}
    >
      <div>
        <div className="flex items-center justify-center h-20 border-b border-gray-200">
          <h1 className={`text-2xl font-bold text-gray-800 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
            <span className="text-[#128c7e]">Health</span>CRM
          </h1>
          <span className={`text-3xl font-bold text-[#128c7e] transition-opacity ${!isOpen ? 'opacity-100' : 'opacity-0'}`}>
            H
          </span>
        </div>
        <nav className="mt-4">
          <ul>
            {navItems.map((item) => (
              <li key={item.name} className="px-4 my-1">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setActivePage(item.name);
                  }}
                  className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${
                    activePage === item.name
                      ? 'bg-[#128c7e]/10 text-[#128c7e] font-semibold'
                      : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className={`ml-4 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`}>{t(item.key)}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="p-4 border-t border-gray-200">
         <a
          href="#"
          onClick={(e) => {
              e.preventDefault();
              setActivePage('Profile');
            }}
          className={`flex items-center p-3 rounded-lg transition-colors duration-200 mb-2 ${
            activePage === 'Profile'
                ? 'bg-[#128c7e]/10 text-[#128c7e] font-semibold'
                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
            }`}
        >
          <UserCircle className="h-5 w-5" />
          <span className={`ml-4 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`}>{t('sidebar.profile')}</span>
        </a>
        <a
          href="#"
          className="flex items-center p-3 text-gray-500 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors duration-200"
        >
          <LogOut className="h-5 w-5" />
          <span className={`ml-4 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`}>{t('sidebar.logout')}</span>
        </a>
      </div>
    </div>
  );
};

export default Sidebar;