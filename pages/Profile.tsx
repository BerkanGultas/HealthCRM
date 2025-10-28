
import React, { useState, useRef } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { Camera } from 'lucide-react';

const Profile: React.FC = () => {
    const { t } = useLanguage();

    const mockUser = {
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@healthcrm.com',
        avatarUrl: 'https://picsum.photos/id/237/200/200',
        role: 'Admin',
    };

    const [userInfo, setUserInfo] = useState({
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
        email: mockUser.email,
    });
    
    const [passwordInfo, setPasswordInfo] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
    });

    const [avatar, setAvatar] = useState<string>(mockUser.avatarUrl);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, form: 'user' | 'password') => {
        const { name, value } = e.target;
        if (form === 'user') {
            setUserInfo(prev => ({ ...prev, [name]: value }));
        } else {
            setPasswordInfo(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setAvatar(event.target?.result as string);
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const triggerFileSelect = () => {
        fileInputRef.current?.click();
    };

    const handleInfoSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, you would dispatch an action to update user info
        alert('Personal information updated successfully!');
        console.log('Updated info:', userInfo);
    };
    
    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordInfo.newPassword !== passwordInfo.confirmNewPassword) {
            alert('New passwords do not match.');
            return;
        }
        // In a real app, you would validate the current password and update it
        alert('Password changed successfully!');
        setPasswordInfo({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Picture Card */}
            <div className="lg:col-span-1">
                <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
                    <div className="relative w-32 h-32 mx-auto mb-4">
                        <img 
                            src={avatar}
                            alt="Profile"
                            className="w-full h-full rounded-full object-cover border-4 border-gray-100 shadow-sm"
                        />
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleAvatarChange}
                            accept="image/*"
                            className="hidden"
                        />
                    </div>
                    <h2 className="text-xl font-bold">{`${userInfo.firstName} ${userInfo.lastName}`}</h2>
                    <p className="text-sm text-gray-500">{userInfo.email}</p>
                    <p className="text-gray-500 mt-1">{mockUser.role}</p>
                     <button 
                        onClick={triggerFileSelect}
                        className="mt-4 flex items-center justify-center gap-2 w-full max-w-xs mx-auto px-4 py-2 text-sm font-medium text-[#128c7e] bg-[#128c7e]/10 rounded-lg hover:bg-[#128c7e]/20 transition-colors"
                        aria-label={t('profile.updatePicture')}
                    >
                        <Camera size={16} />
                        <span>{t('profile.updatePicture')}</span>
                    </button>
                </div>
            </div>

            {/* User Info & Password Forms */}
            <div className="lg:col-span-2 space-y-6">
                {/* Personal Information Form */}
                <form onSubmit={handleInfoSubmit} className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold mb-4 border-b pb-3">{t('profile.personalInfo')}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">{t('profile.firstName')}</label>
                            <input 
                                type="text"
                                name="firstName"
                                value={userInfo.firstName}
                                onChange={(e) => handleInputChange(e, 'user')}
                                className="w-full bg-gray-50 border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#128c7e] focus:border-transparent transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">{t('profile.lastName')}</label>
                            <input 
                                type="text"
                                name="lastName"
                                value={userInfo.lastName}
                                onChange={(e) => handleInputChange(e, 'user')}
                                className="w-full bg-gray-50 border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#128c7e] focus:border-transparent transition-colors"
                            />
                        </div>
                    </div>
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-600 mb-1">{t('profile.email')}</label>
                        <input 
                            type="email"
                            name="email"
                            value={userInfo.email}
                            onChange={(e) => handleInputChange(e, 'user')}
                            className="w-full bg-gray-50 border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#128c7e] focus:border-transparent transition-colors"
                        />
                    </div>
                    <div className="flex justify-end mt-6">
                        <button type="submit" className="px-4 py-2 rounded-lg bg-[#128c7e] text-white hover:bg-[#075e54] transition-colors">{t('profile.saveChanges')}</button>
                    </div>
                </form>

                {/* Change Password Form */}
                <form onSubmit={handlePasswordSubmit} className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold mb-4 border-b pb-3">{t('profile.changePassword')}</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">{t('profile.currentPassword')}</label>
                            <input 
                                type="password"
                                name="currentPassword"
                                value={passwordInfo.currentPassword}
                                onChange={(e) => handleInputChange(e, 'password')}
                                className="w-full bg-gray-50 border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#128c7e] focus:border-transparent transition-colors"
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">{t('profile.newPassword')}</label>
                                <input 
                                    type="password"
                                    name="newPassword"
                                    value={passwordInfo.newPassword}
                                    onChange={(e) => handleInputChange(e, 'password')}
                                    className="w-full bg-gray-50 border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#128c7e] focus:border-transparent transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">{t('profile.confirmNewPassword')}</label>
                                <input 
                                    type="password"
                                    name="confirmNewPassword"
                                    value={passwordInfo.confirmNewPassword}
                                    onChange={(e) => handleInputChange(e, 'password')}
                                    className="w-full bg-gray-50 border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#128c7e] focus:border-transparent transition-colors"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end mt-6">
                        <button type="submit" className="px-4 py-2 rounded-lg bg-[#128c7e] text-white hover:bg-[#075e54] transition-colors">{t('profile.saveChanges')}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Profile;
