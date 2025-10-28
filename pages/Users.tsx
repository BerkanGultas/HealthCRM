
import React, { useState } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { User } from '../types';
import { MoreHorizontal, PlusCircle, Search } from 'lucide-react';

const mockUsers: User[] = [
  { id: 1, name: 'Admin User', email: 'admin@healthcrm.com', role: 'Admin', avatarUrl: 'https://picsum.photos/id/237/200/200', status: 'Active', lastLogin: '2024-07-20 10:30 AM' },
  { id: 2, name: 'Jane Doe', email: 'jane.doe@healthcrm.com', role: 'Moderator', avatarUrl: 'https://picsum.photos/id/1/200/200', status: 'Active', lastLogin: '2024-07-20 09:15 AM' },
  { id: 3, name: 'John Smith', email: 'john.smith@healthcrm.com', role: 'Agent', avatarUrl: 'https://picsum.photos/id/2/200/200', status: 'Inactive', lastLogin: '2024-07-19 05:00 PM' },
  { id: 4, name: 'Emily White', email: 'emily.white@healthcrm.com', role: 'Agent', avatarUrl: 'https://picsum.photos/id/3/200/200', status: 'Active', lastLogin: '2024-07-20 11:00 AM' },
];

const Users: React.FC = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');

  const getRoleClass = (role: 'Admin' | 'Moderator' | 'Agent') => {
    switch (role) {
      case 'Admin': return 'bg-purple-500/20 text-purple-500';
      case 'Moderator': return 'bg-yellow-500/20 text-yellow-500';
      case 'Agent': return 'bg-blue-500/20 text-blue-500';
      default: return 'bg-gray-500/20 text-gray-500';
    }
  };
  
  const getStatusClass = (status: 'Active' | 'Inactive') => {
    return status === 'Active' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500';
  }

  const filteredUsers = mockUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">{t('users.allUsers')}</h2>
        <div className="flex items-center gap-4">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
                <input
                    type="text"
                    placeholder={t('users.search')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64 bg-gray-100 border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:ring-[#128c7e] focus:border-[#128c7e] transition-colors"
                />
            </div>
            <button className="flex items-center gap-2 bg-[#128c7e] text-white px-4 py-2 rounded-lg hover:bg-[#075e54] transition-colors">
            <PlusCircle size={18}/>
            <span>{t('users.addUser')}</span>
            </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="p-4 font-semibold">{t('users.name')}</th>
              <th className="p-4 font-semibold">{t('users.role')}</th>
              <th className="p-4 font-semibold">{t('users.status')}</th>
              <th className="p-4 font-semibold">{t('users.lastLogin')}</th>
              <th className="p-4 text-center font-semibold">{t('users.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id} className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full object-cover"/>
                    <div>
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getRoleClass(user.role)}`}>
                    {user.role}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(user.status)}`}>
                    {user.status}
                  </span>
                </td>
                <td className="p-4 text-gray-500">{user.lastLogin}</td>
                <td className="p-4 text-center">
                  <button className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded-full">
                    <MoreHorizontal size={20}/>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
