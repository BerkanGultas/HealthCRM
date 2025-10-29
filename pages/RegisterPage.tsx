import React, { useState } from 'react';
import { signup } from '../lib/auth';
import { useLanguage } from '../hooks/useLanguage';

const RegisterPage: React.FC = () => {
    const { t } = useLanguage();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('agent'); // Default role, or allow user to select
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        try {
            const user = await signup(email, password, role);
            console.log('User registered:', user);
            setSuccess(t('register.success'));
            setEmail('');
            setPassword('');
        } catch (err: any) {
            console.error('Signup error:', err.message);
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#128c7e] to-[#25d366] p-4 font-sans">
            <div className="w-full max-w-md p-8 space-y-8 bg-white/20 backdrop-blur-xl rounded-2xl shadow-2xl text-white">
                <h2 className="text-3xl font-bold text-center text-white">{t('register.title')}</h2>
                <form className="space-y-6" onSubmit={handleSignup}>
                    {error && <p className="text-red-300 text-center">{error}</p>}
                    {success && <p className="text-green-300 text-center">{success}</p>}
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t('register.email')}
                        required
                        className="w-full bg-white/10 border border-white/20 rounded-lg pl-4 pr-4 py-3 placeholder-white/60 focus:ring-2 focus:ring-white/50 focus:bg-white/20 outline-none transition"
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={t('register.password')}
                        required
                        className="w-full bg-white/10 border border-white/20 rounded-lg pl-4 pr-4 py-3 placeholder-white/60 focus:ring-2 focus:ring-white/50 focus:bg-white/20 outline-none transition"
                    />
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full bg-white/10 border border-white/20 rounded-lg pl-4 pr-4 py-3 text-white focus:ring-2 focus:ring-white/50 focus:bg-white/20 outline-none transition"
                    >
                        <option value="agent" className="bg-[#128c7e]">{t('roles.agent')}</option>
                        <option value="moderator" className="bg-[#128c7e]">{t('roles.moderator')}</option>
                        <option value="admin" className="bg-[#128c7e]">{t('roles.admin')}</option>
                    </select>
                    <button
                        type="submit"
                        className="w-full flex items-center justify-center gap-2 bg-white text-[#075e54] font-bold py-3 px-4 rounded-lg hover:bg-white/90 transform hover:scale-105 transition-all duration-300"
                    >
                        {t('register.registerButton')}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;
