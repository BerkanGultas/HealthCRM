import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { User, MessagePlatform } from '../types';
import { PlusCircle, Search, Pencil, Trash2, X } from 'lucide-react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';

const UserModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (user: Omit<User, 'id'>) => void;
    userToEdit: User | null;
}> = ({ isOpen, onClose, onSave, userToEdit }) => {
    const { t } = useLanguage();
    const [userData, setUserData] = useState<Omit<User, 'id'>>(
        userToEdit || { name: '', email: '', role: 'Agent', status: 'Active', avatarUrl: `https://picsum.photos/seed/${Date.now()}/200/200`, platforms: [] }
    );
    const [password, setPassword] = useState('');

    useEffect(() => {
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
            <div className="bg-white rounded-lg p-6 w-full max-w-lg border border-gray-200 shadow-xl transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">{userToEdit ? t('users.editModalTitle') : t('users.addModalTitle')}</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100"><X size={20}/></button>
                </div>
                <div className="space-y-4">
                     <div>
                        <label className="text-sm text-gray-500 font-medium">{t('users.name')}</label>
                        <input name="name" value={userData.name} onChange={handleChange} className="w-full bg-gray-50 border border-gray-300 rounded-md p-2 mt-1" />
                    </div>
                     <div>
                        <label className="text-sm text-gray-500 font-medium">{t('users.password')}</label>
                        <input 
                            type="password" 
                            name="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder={userToEdit ? t('users.passwordPlaceholderEdit') : ""}
                            className="w-full bg-gray-50 border border-gray-300 rounded-md p-2 mt-1" 
                        />
                    </div>
                     <div>
                        <label className="text-sm text-gray-500 font-medium">{t('users.email')}</label>
                        <input type="email" name="email" value={userData.email} onChange={handleChange} className="w-full bg-gray-50 border border-gray-300 rounded-md p-2 mt-1" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm text-gray-500 font-medium">{t('users.role')}</label>
                            <select name="role" value={userData.role} onChange={handleChange} className="w-full bg-gray-50 border border-gray-300 rounded-md p-2 mt-1 h-[42px]">
                                <option value="Admin">Admin</option>
                                <option value="Moderator">Moderator</option>
                                <option value="Agent">Agent</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm text-gray-500 font-medium">{t('users.status')}</label>
                             <select name="status" value={userData.status} onChange={handleChange} className="w-full bg-gray-50 border border-gray-300 rounded-md p-2 mt-1 h-[42px]">
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>
                    </div>
                     <div>
                        <label className="text-sm text-gray-500 font-medium">{t('users.platforms')}</label>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2">
                            {Object.values(MessagePlatform).map(platform => (
                                <label key={platform} className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={userData.platforms?.includes(platform) || false}
                                        onChange={() => handlePlatformChange(platform)}
                                        className="h-4 w-4 rounded border-gray-300 text-[#128c7e] focus:ring-[#128c7e]"
                                    />
                                    <span className="text-gray-700">{platform}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
                 <div className="flex justify-end gap-4 mt-6">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors">{t('users.cancel')}</button>
                    <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-[#128c7e] text-white hover:bg-[#075e54] transition-colors">{t('users.save')}</button>
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
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = collection(db, 'users');
      const usersSnapshot = await getDocs(usersCollection);
      const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
      setUsers(usersList);
    };

    fetchUsers();
  }, []);

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

  const handleSaveUser = async (userData: Omit<User, 'id'>) => {
      if(editingUser) {
          const userRef = doc(db, 'users', editingUser.id as string);
          await updateDoc(userRef, userData);
          setUsers(prev => prev.map(u => u.id === editingUser.id ? { ...editingUser, ...userData } : u));
      } else {
          const usersCollection = collection(db, 'users');
          const docRef = await addDoc(usersCollection, userData);
          const newUser: User = {
              id: docRef.id,
              ...userData,
          };
          setUsers(prev => [newUser, ...prev]);
      }
  };

  const handleDeleteUser = async (userId: string) => {
      if (window.confirm(t('users.deleteConfirm'))) {
          const userRef = doc(db, 'users', userId);
          await deleteDoc(userRef);
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
              <button onClick={handleOpenAddModal} className="flex items-center gap-2 bg-[#128c7e] text-white px-4 py-2 rounded-lg hover:bg-[#075e54] transition-colors">
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
                <th className="p-4 font-semibold">{t('users.platforms')}</th>
                <th className="p-4 font-semibold">{t('users.status')}</th>
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
                    <div className="flex flex-wrap gap-1">
                      {user.platforms?.map(platform => (
                        <span key={platform} className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
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
                        <button onClick={() => handleOpenEditModal(user)} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-100 rounded-full transition-colors" aria-label={t('users.editModalTitle')}>
                            <Pencil size={18}/>
                        </button>
                        <button onClick={() => handleDeleteUser(user.id as string)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-full transition-colors" aria-label={t('users.deleteConfirm')}>
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