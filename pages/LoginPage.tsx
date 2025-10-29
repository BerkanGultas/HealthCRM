
import React, { useState } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { useSettings } from '../hooks/useLanguage';
import { AtSign, Lock, LogIn, User, Mail, Send } from 'lucide-react';
import { login } from '../lib/auth'; // Import the login function

interface LoginPageProps {
    onLogin: (email: string) => void;
    onGuestLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onGuestLogin }) => {
    const { t } = useLanguage();
    const { logoUrl } = useSettings();
    const [view, setView] = useState<'login' | 'forgotPassword'>('login');
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [resetEmail, setResetEmail] = useState('');
    const [error, setError] = useState<string | null>(null); // State for error messages

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null); // Clear previous errors
        try {
            const user = await login(email, password);
            console.log("Logged in user:", user);
            onLogin(email); // Call the original onLogin callback
        } catch (err: any) {
            setError(err.message); // Set error message
        }
    };

    const handleForgotSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (resetEmail) {
            alert(t('login.resetLinkSent'));
            setView('login');
            setResetEmail('');
        } else {
            alert('Please enter your email address.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#128c7e] to-[#25d366] p-4 font-sans">
            <div className="w-full max-w-md p-8 space-y-8 bg-white/20 backdrop-blur-xl rounded-2xl shadow-2xl text-white">
                <div className="text-center">
                    {logoUrl ? (
                        <img src={logoUrl} alt="Company Logo" className="mx-auto h-16 object-contain" />
                    ) : (
                        <h1 className="text-4xl font-bold">
                            <span className="text-white">Health</span>
                            <span className="text-white/80">CRM</span>
                        </h1>
                    )}
                    {view === 'login' && (
                        <>
                           <p className="mt-2 text-white/90">{t('login.welcome')}</p>
                           <p className="text-sm text-white/70">{t('login.subtitle')}<br/>(Use agent@..., moderator@... or admin@... to test roles)</p>
                        </>
                    )}
                     {view === 'forgotPassword' && (
                        <>
                           <p className="mt-2 text-white/90">{t('login.forgotPasswordTitle')}</p>
                           <p className="text-sm text-white/70">{t('login.forgotPasswordSubtitle')}</p>
                        </>
                    )}
                </div>

                {view === 'login' ? (
                    <form className="space-y-6" onSubmit={handleLoginSubmit}>
                        {error && <p className="text-red-300 text-center">{error}</p>} {/* Display error message */}
                        <div className="relative">
                            <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" size={20} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder={t('login.email')}
                                required
                                className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-3 placeholder-white/60 focus:ring-2 focus:ring-white/50 focus:bg-white/20 outline-none transition"
                            />
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" size={20} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder={t('login.password')}
                                required
                                className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-3 placeholder-white/60 focus:ring-2 focus:ring-white/50 focus:bg-white/20 outline-none transition"
                            />
                        </div>
                        
                        <div className="text-right text-sm">
                            <button type="button" onClick={() => setView('forgotPassword')} className="font-medium text-white/80 hover:text-white transition">
                                {t('login.forgotPassword')}
                            </button>
                        </div>

                        <button
                            type="submit"
                            className="w-full flex items-center justify-center gap-2 bg-white text-[#075e54] font-bold py-3 px-4 rounded-lg hover:bg-white/90 transform hover:scale-105 transition-all duration-300"
                        >
                            <LogIn size={20} />
                            <span>{t('login.loginButton')}</span>
                        </button>
                    </form>
                ) : (
                    <form className="space-y-6" onSubmit={handleForgotSubmit}>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" size={20} />
                            <input
                                type="email"
                                value={resetEmail}
                                onChange={(e) => setResetEmail(e.target.value)}
                                placeholder={t('login.email')}
                                required
                                className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-3 placeholder-white/60 focus:ring-2 focus:ring-white/50 focus:bg-white/20 outline-none transition"
                            />
                        </div>
                         <div className="text-right text-sm">
                            <button type="button" onClick={() => setView('login')} className="font-medium text-white/80 hover:text-white transition">
                                {t('login.backToLogin')}
                            </button>
                        </div>
                        <button
                            type="submit"
                            className="w-full flex items-center justify-center gap-2 bg-white text-[#075e54] font-bold py-3 px-4 rounded-lg hover:bg-white/90 transform hover:scale-105 transition-all duration-300"
                        >
                           <Send size={20} />
                           <span>{t('login.sendResetLink')}</span>
                        </button>
                    </form>
                )}
                
                <div className="flex items-center justify-center space-x-4">
                    <hr className="w-full border-white/20" />
                    <span className="text-white/60 text-sm uppercase">{t('login.or')}</span>
                    <hr className="w-full border-white/20" />
                </div>

                <button
                    onClick={onGuestLogin}
                    className="w-full flex items-center justify-center gap-2 bg-transparent border-2 border-white/50 text-white font-bold py-3 px-4 rounded-lg hover:bg-white/10 hover:border-white/80 transition-all duration-300"
                >
                    <User size={20} />
                    <span>{t('login.guestLoginButton')}</span>
                </button>
            </div>
        </div>
    );
};

export default LoginPage;
