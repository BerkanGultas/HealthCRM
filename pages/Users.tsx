import React, { useState, useMemo } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { useTheme } from '../context/ThemeContext';
import { User, MessagePlatform } from '../types';
import { PlusCircle, Search, Pencil, Trash2, X } from 'lucide-react';

const mockUsers: User[] = [
  { id: 1, name: 'Admin User', email: 'admin@healthcrm.com', role: 'Admin', avatarUrl: 'https://picsum.photos/id/237/200/200', status: 'Active', platforms: [MessagePlatform.WhatsApp, MessagePlatform.Facebook, MessagePlatform.Instagram, MessagePlatform.WebChat] },
  { id: 2, name: 'Jane Doe', email: 'jane.doe@healthcrm.com', role: 'Moderator', avatarUrl: 'https://picsum.photos/id/1/200/200', status: 'Active', platforms: [MessagePlatform.WhatsApp, MessagePlatform.Facebook] },
  { id: 3, name: 'John Smith', email: 'john.smith@healthcrm.com', role: 'Agent', avatarUrl: 'https://picsum.photos/id/2/200/200', status: 'Inactive', platforms: [MessagePlatform.WhatsApp] },
  { id: 4, name: 'Emily White', email: 'emily.white@healthcrm.com', role: 'Agent', avatarUrl: 'https://picsum.photos/id/3/200/200', status: 'Active', platforms: [MessagePlatform.Instagram, MessagePlatform.WebChat] },
];

const UserModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (user: Omit<User, 'id'>) => void;
    userToEdit: User | null;
}> = ({ isOpen, onClose, onSave, userToEdit }) => {
    const { t } = useLanguage();
    // FIX: Explicitly type the state and initialize it with a consistent shape.
    const [userData, setUserData] = useState<Omit<User, 'id'>>(
        userToEdit || { name: '', email: '', role: 'Agent', status: 'Active', avatarUrl: `https://picsum.photos/seed/${Date.now()}/200/200`, platforms: [] }
    );
    const [password, setPassword] = useState('');

    React.useEffect(() => {
        // FIX: Reset state when modal opens or user changes.
        setUserData(userToEdit || { name: '', email: '', role: 'Agent', status: 'Active', avatarUrl: `https://picsum.photos/seed/${Date.now()}/200/200`, platforms: [] });
        setPassword('');
    }, [userToEdit, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === 'role') {
            setUserData(prev => ({ ...prev, role: value as User['role'] }));
        } else if (name === 'status') {
            setUserData(prev => ({ ...prev, status: value as User['status'] }));
        } else {
            setUserData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handlePlatformChange = (platform: MessagePlatform) => {
        setUserData(prev => {
            const currentPlatforms = prev.platforms || [];
            const newPlatforms = currentPlatforms.includes(platform)
                ? currentPlatforms.filter(p => p !== platform)
                : [...currentPlatforms, platform];
            return { ...prev, platforms: newPlatforms };
        });
    };

    const handleSave = () => {
        if(userData.name && userData.email) {
            onSave(userData);
            onClose();
        } else {
            alert("Name and Email are required.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-[var(--card-background)] rounded-lg p-6 w-full max-w-lg border border-[var(--border)] shadow-xl transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">{userToEdit ? t('users.editModalTitle') : t('users.addModalTitle')}</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-[var(--accent)]"><X size={20}/></button>
                </div>
                <div className="space-y-4">
                     <div>
                        <label className="text-sm text-[var(--foreground-muted)] font-medium">{t('users.name')}</label>
                        <input name="name" value={userData.name} onChange={handleChange} className="w-full bg-[var(--input-background)] border border-[var(--border)] rounded-md p-2 mt-1" />
                    </div>
                     <div>
                        <label className="text-sm text-[var(--foreground-muted)] font-medium">{t('users.password')}</label>
                        <input 
                            type="password" 
                            name="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder={userToEdit ? t('users.passwordPlaceholderEdit') : ""}
                            className="w-full bg-[var(--input-background)] border border-[var(--border)] rounded-md p-2 mt-1" 
                        />
                    </div>
                     <div>
                        <label className="text-sm text-[var(--foreground-muted)] font-medium">{t('users.email')}</label>
                        <input type="email" name="email" value={userData.email} onChange={handleChange} className="w-full bg-[var(--input-background)] border border-[var(--border)] rounded-md p-2 mt-1" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm text-[var(--foreground-muted)] font-medium">{t('users.role')}</label>
                            <select name="role" value={userData.role} onChange={handleChange} className="w-full bg-[var(--input-background)] border border-[var(--border)] rounded-md p-2 mt-1 h-[42px]">
                                <option value="Admin">Admin</option>
                                <option value="Moderator">Moderator</option>
                                <option value="Agent">Agent</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm text-[var(--foreground-muted)] font-medium">{t('users.status')}</label>
                             <select name="status" value={userData.status} onChange={handleChange} className="w-full bg-[var(--input-background)] border border-[var(--border)] rounded-md p-2 mt-1 h-[42px]">
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>
                    </div>
                     <div>
                        <label className="text-sm text-[var(--foreground-muted)] font-medium">{t('users.platforms')}</label>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2">
                            {Object.values(MessagePlatform).map(platform => (
                                <label key={platform} className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={userData.platforms?.includes(platform) || false}
                                        onChange={() => handlePlatformChange(platform)}
                                        className="h-4 w-4 rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)] bg-[var(--input-background)]"
                                    />
                                    <span className="text-[var(--foreground)]">{platform}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
                 <div className="flex justify-end gap-4 mt-6">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg text-[var(--foreground)] bg-[var(--accent)] hover:bg-opacity-75 transition-colors">{t('users.cancel')}</button>
                    <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)] transition-colors">{t('users.save')}</button>
                </div>
            </div>
             <style>{`
                @keyframes fade-in-scale { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
                .animate-fade-in-scale { animation: fade-in-scale 0.2s ease-out forwards; }
            `}</style>
        </div>
    );
};


const Users: React.FC = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const getRoleClass = (role: 'Admin' | 'Moderator' | 'Agent') => {
    const roleClasses = {
        light: {
            Admin: 'bg-purple-500/20 text-purple-600',
            Moderator: 'bg-yellow-500/20 text-yellow-600',
            Agent: 'bg-blue-500/20 text-blue-600',
        },
        dark: {
            Admin: 'bg-purple-400/20 text-purple-400',
            Moderator: 'bg-yellow-400/20 text-yellow-400',
            Agent: 'bg-blue-400/20 text-blue-400',
        }
    };
    return roleClasses[theme][role] || 'bg-gray-500/20 text-gray-500';
  };
  
  const getStatusClass = (status: 'Active' | 'Inactive') => {
    const statusClasses = {
        light: {
            Active: 'bg-green-500/20 text-green-600',
            Inactive: 'bg-red-500/20 text-red-600',
        },
        dark: {
            Active: 'bg-green-400/20 text-green-400',
            Inactive: 'bg-red-400/20 text-red-400',
        }
    };
    return statusClasses[theme][status];
  }

  const filteredUsers = useMemo(() => users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  ), [users, searchTerm]);

  const handleOpenAddModal = () => {
    setEditingUser(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (user: User) => {
      setEditingUser(user);
      setModalOpen(true);
  };

  const handleSaveUser = (userData: Omit<User, 'id'>) => {
      if(editingUser) {
          setUsers(prev => prev.map(u => u.id === editingUser.id ? { ...editingUser, ...userData } : u));
      } else {
          const newUser: User = {
              id: Math.max(...users.map(u => u.id), 0) + 1,
              ...userData,
          };
          setUsers(prev => [newUser, ...prev]);
      }
  };

  const handleDeleteUser = (userId: number) => {
      if (window.confirm(t('users.deleteConfirm'))) {
          setUsers(prev => prev.filter(u => u.id !== userId));
      }
  };

  return (
    <>
      <UserModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveUser}
        userToEdit={editingUser}
      />
      <div className="bg-[var(--card-background)] p-6 rounded-lg border border-[var(--border)]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h2 className="text-xl font-semibold">{t('users.allUsers')}</h2>
          <div className="w-full md:w-auto flex flex-col sm:flex-row items-center gap-4">
              <div className="relative w-full sm:w-auto">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
                  <input
                      type="text"
                      placeholder={t('users.search')}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full sm:w-64 bg-[var(--input-background)] border border-[var(--border)] rounded-lg pl-10 pr-4 py-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] transition-colors"
                  />
              </div>
              <button onClick={handleOpenAddModal} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[var(--primary)] text-[var(--primary-foreground)] px-4 py-2 rounded-lg hover:bg-[var(--primary-hover)] transition-colors">
              <PlusCircle size={18}/>
              <span>{t('users.addUser')}</span>
              </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="p-4 font-semibold">{t('users.name')}</th>
                <th className="p-4 font-semibold">{t('users.role')}</th>
                <th className="p-4 font-semibold">{t('users.platforms')}</th>
                <th className="p-4 font-semibold">{t('users.status')}</th>
                <th className="p-4 text-center font-semibold">{t('users.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id} className="border-b border-[var(--border)] last:border-b-0 hover:bg-[var(--accent)]/50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full object-cover"/>
                      <div>
                        <p className="font-semibold">{user.name}</p>
                        <p className="text-sm text-[var(--foreground-muted)]">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getRoleClass(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {user.platforms?.map(platform => (
                        <span key={platform} className="px-2 py-1 text-xs font-medium rounded-full bg-[var(--accent)] text-[var(--accent-foreground)]">
                          {platform}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                        <button onClick={() => handleOpenEditModal(user)} className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-500/10 rounded-full transition-colors" aria-label={t('users.editModalTitle')}>
                            <Pencil size={18}/>
                        </button>
                        <button onClick={() => handleDeleteUser(user.id)} className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-colors" aria-label={t('users.deleteConfirm')}>
                            <Trash2 size={18}/>
                        </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Users;