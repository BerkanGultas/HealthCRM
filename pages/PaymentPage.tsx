import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage, useSettings } from '../hooks/useLanguage';
import { Currency } from '../types';
import { CreditCard, Calendar, Lock, User, CheckCircle, ShieldCheck } from 'lucide-react';

type PaymentStatus = 'idle' | 'processing' | 'success' | 'error';

const PaymentPage: React.FC = () => {
    const { t, language } = useLanguage();
    const { logoUrl } = useSettings();
    const [paymentDetails, setPaymentDetails] = useState({
        amount: 0,
        currency: 'USD' as Currency,
        customer: '',
        services: '',
    });
    const [cardInfo, setCardInfo] = useState({
        number: '',
        name: '',
        expiry: '',
        cvc: '',
    });
    const [status, setStatus] = useState<PaymentStatus>('idle');

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        setPaymentDetails({
            amount: Number(params.get('amount') || 0),
            currency: (params.get('currency') as Currency) || 'USD',
            customer: params.get('customer') || 'Valued Customer',
            services: params.get('services') || 'Selected Services',
        });
    }, []);

    const formattedAmount = useMemo(() => {
        return new Intl.NumberFormat(language, {
            style: 'currency',
            currency: paymentDetails.currency,
        }).format(paymentDetails.amount);
    }, [paymentDetails.amount, paymentDetails.currency, language]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let { name, value } = e.target;
        if (name === 'number') {
            value = value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ').slice(0, 19);
        }
        if (name === 'expiry') {
            value = value.replace(/\D/g, '').replace(/(\d{2})(?=\d)/g, '$1 / ').slice(0, 7);
        }
        if (name === 'cvc') {
            value = value.replace(/\D/g, '').slice(0, 4);
        }
        setCardInfo(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('processing');
        setTimeout(() => {
            // Simulate API call success
            setStatus('success');
        }, 2000);
    };

    if (status === 'success') {
        return (
            <div className="min-h-screen bg-[var(--background)] flex flex-col items-center justify-center p-4">
                <div className="w-full max-w-md bg-[var(--card-background)] p-8 rounded-2xl shadow-lg text-center">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto animate-pulse" />
                    <h1 className="text-2xl font-bold text-[var(--card-foreground)] mt-4">{t('paymentPage.paymentSuccessTitle')}</h1>
                    <p className="text-[var(--foreground-muted)] mt-2">{t('paymentPage.paymentSuccessMessage')}</p>
                    <button 
                        onClick={() => window.location.href = window.location.origin} 
                        className="mt-6 w-full px-4 py-3 bg-[var(--primary)] text-[var(--primary-foreground)] font-semibold rounded-lg hover:bg-[var(--primary-hover)] transition-colors"
                    >
                        {t('paymentPage.goBack')}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-4 font-sans">
            <div className="w-full max-w-md">
                <div className="bg-[var(--card-background)] rounded-2xl shadow-lg overflow-hidden">
                    <div className="p-6 bg-[var(--accent)]/50 border-b border-[var(--border)]">
                        <div className="text-center">
                             {logoUrl ? (
                                <img src={logoUrl} alt="Company Logo" className="mx-auto h-12 object-contain mb-2" />
                            ) : (
                                <h1 className="text-2xl font-bold text-[var(--card-foreground)]">
                                    <span className="text-[var(--primary)]">Health</span>CRM
                                </h1>
                            )}
                            <p className="text-sm text-[var(--foreground-muted)]">{t('paymentPage.payTo')}</p>
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="text-center mb-6">
                            <p className="text-[var(--foreground-muted)]">{t('paymentPage.totalAmount')}</p>
                            <p className="text-4xl font-bold text-[var(--card-foreground)]">{formattedAmount}</p>
                        </div>
                        
                        <div className="bg-[var(--background)] p-4 rounded-lg border border-[var(--border)] mb-6">
                            <h3 className="font-semibold text-[var(--foreground)]">{t('paymentPage.invoiceDetails')} <span className="font-bold text-[var(--primary)]">{paymentDetails.customer}</span></h3>
                            <p className="text-sm text-[var(--foreground-muted)] mt-1">
                                <span className="font-medium">{t('paymentPage.forServices')}:</span> {paymentDetails.services}
                            </p>
                        </div>

                        <h3 className="text-lg font-semibold text-[var(--card-foreground)] mb-4">{t('paymentPage.cardInfo')}</h3>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input type="text" name="name" placeholder={t('paymentPage.cardholderName')} value={cardInfo.name} onChange={handleInputChange} required className="w-full bg-[var(--input-background)] border border-[var(--border)] rounded-md py-3 pl-10 pr-4 focus:ring-2 focus:ring-[var(--primary)] outline-none transition" />
                            </div>
                            <div className="relative">
                                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input type="tel" name="number" placeholder={t('paymentPage.cardNumber')} value={cardInfo.number} onChange={handleInputChange} required className="w-full bg-[var(--input-background)] border border-[var(--border)] rounded-md py-3 pl-10 pr-4 focus:ring-2 focus:ring-[var(--primary)] outline-none transition" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input type="text" name="expiry" placeholder={t('paymentPage.expiryDate')} value={cardInfo.expiry} onChange={handleInputChange} required className="w-full bg-[var(--input-background)] border border-[var(--border)] rounded-md py-3 pl-10 pr-4 focus:ring-2 focus:ring-[var(--primary)] outline-none transition" />
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input type="tel" name="cvc" placeholder={t('paymentPage.cvc')} value={cardInfo.cvc} onChange={handleInputChange} required className="w-full bg-[var(--input-background)] border border-[var(--border)] rounded-md py-3 pl-10 pr-4 focus:ring-2 focus:ring-[var(--primary)] outline-none transition" />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={status === 'processing'}
                                className="w-full mt-2 flex items-center justify-center gap-2 bg-[var(--primary)] text-[var(--primary-foreground)] font-bold py-3 px-4 rounded-lg hover:bg-[var(--primary-hover)] disabled:bg-gray-400 transition-all duration-300"
                            >
                                {status === 'processing' ? t('paymentPage.processing') : t('paymentPage.payButton', { amount: formattedAmount })}
                            </button>
                        </form>
                    </div>
                </div>
                <div className="text-center mt-4">
                    <p className="flex items-center justify-center gap-2 text-sm text-[var(--foreground-muted)]">
                        <ShieldCheck size={16} className="text-green-600" />
                        {t('paymentPage.secureConnection')}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;