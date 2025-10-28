import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { Customer, Service, Currency } from '../types';
import { Link, PlusCircle, Search, Copy, X, Check } from 'lucide-react';

// --- MOCK DATA --- //
// FIX: Removed 'lastContacted' property from mock customer data as it's not in the Customer type.
const mockCustomers: Customer[] = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', phone: '123-456-7890', country: 'USA', agent: 'John Smith', avatarUrl: 'https://picsum.photos/id/11/200/200' },
  { id: 2, name: 'Bob Williams', email: 'bob@example.com', phone: '234-567-8901', country: 'Canada', agent: 'Emily White', avatarUrl: 'https://picsum.photos/id/12/200/200' },
  { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', phone: '345-678-9012', country: 'UK', agent: 'John Smith', avatarUrl: 'https://picsum.photos/id/13/200/200' },
];

const mockServices: Service[] = [
  { id: 'HT-001', name: 'Hair Transplant (FUE)', description: 'Follicular Unit Extraction method.', price: 3500, currency: 'USD', category: 'Aesthetic Surgery' },
  { id: 'DT-002', name: 'Dental Implants (All-on-4)', description: 'Full arch restoration.', price: 10000, currency: 'EUR', category: 'Dentistry' },
  { id: 'ES-003', name: 'Rhinoplasty', description: 'Cosmetic surgery of the nose.', price: 5000, currency: 'USD', category: 'Aesthetic Surgery' },
  { id: 'DT-006', name: 'Teeth Whitening', description: 'Professional teeth whitening.', price: 500, currency: 'TRY', category: 'Dentistry' },
];

interface GeneratedLink {
    id: string;
    customer: Customer;
    amount: number;
    currency: Currency;
    status: 'Paid' | 'Pending' | 'Expired';
    date: string;
    url: string;
    createdBy: string;
}

const mockGeneratedLinks: GeneratedLink[] = [
    { id: 'LNK001', customer: mockCustomers[0], amount: 3500, currency: 'USD', status: 'Paid', date: '2024-07-22', url: `${window.location.origin}${window.location.pathname}?customer=Alice%20Johnson&services=Hair%20Transplant%20(FUE)&amount=3500&currency=USD`, createdBy: 'Admin User' },
    { id: 'LNK002', customer: mockCustomers[1], amount: 10000, currency: 'EUR', status: 'Pending', date: '2024-07-23', url: `${window.location.origin}${window.location.pathname}?customer=Bob%20Williams&services=Dental%20Implants%20(All-on-4)&amount=10000&currency=EUR`, createdBy: 'John Smith' },
    { id: 'LNK003', customer: mockCustomers[2], amount: 5500, currency: 'USD', status: 'Expired', date: '2024-07-20', url: `${window.location.origin}${window.location.pathname}?customer=Charlie%20Brown&services=Rhinoplasty,%20Teeth%20Whitening&amount=5500&currency=USD`, createdBy: 'Emily White' },
];

// --- MODAL COMPONENT --- //
const CreateLinkModal: React.FC<{ isOpen: boolean; onClose: () => void; onLinkCreated: (link: GeneratedLink) => void }> = ({ isOpen, onClose, onLinkCreated }) => {
    const { t, language } = useLanguage();
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [selectedServices, setSelectedServices] = useState<Service[]>([]);
    const [amount, setAmount] = useState<number>(0);
    const [currency, setCurrency] = useState<Currency>('USD');

    useEffect(() => {
        const total = selectedServices.reduce((sum, service) => sum + service.price, 0);
        setAmount(total);
    }, [selectedServices]);

    const handleGenerateLink = () => {
        if (!selectedCustomer || amount <= 0) {
            alert("Please select a customer and ensure the amount is greater than zero.");
            return;
        }
        const newLink: GeneratedLink = {
            id: `LNK${Date.now()}`,
            customer: selectedCustomer,
            amount: amount,
            currency: currency,
            status: 'Pending',
            date: new Date().toISOString().split('T')[0],
            url: `${window.location.origin}${window.location.pathname}?customer=${encodeURIComponent(selectedCustomer.name)}&services=${encodeURIComponent(selectedServices.map(s => s.name).join(', '))}&amount=${amount}&currency=${currency}`,
            createdBy: 'Admin User' // In a real app, this would be the logged-in user
        };
        onLinkCreated(newLink);
        // Reset form
        setSelectedCustomer(null);
        setSelectedServices([]);
        setAmount(0);
        setCurrency('USD');
    };
    
    const formatCurrency = (price: number, curr: Currency) => new Intl.NumberFormat(language, { style: 'currency', currency: curr }).format(price);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-opacity duration-300">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl border border-gray-200 shadow-xl transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale">
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                    <h2 className="text-xl font-semibold">{t('createLink.modalTitle')}</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100"><X size={24}/></button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column: Form */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">{t('createLink.selectCustomer')}</label>
                            <select value={selectedCustomer?.id || ''} onChange={(e) => setSelectedCustomer(mockCustomers.find(c => c.id === Number(e.target.value)) || null)} className="w-full bg-gray-50 border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#128c7e] focus:border-transparent">
                                <option value="" disabled>{t('createLink.searchCustomer')}</option>
                                {mockCustomers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">{t('createLink.selectServices')}</label>
                             <select value={''} onChange={(e) => {
                                const service = mockServices.find(s => s.id === e.target.value);
                                if(service && !selectedServices.find(ss => ss.id === service.id)) setSelectedServices(prev => [...prev, service]);
                            }} className="w-full bg-gray-50 border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#128c7e] focus:border-transparent">
                                <option value="" disabled>{t('createLink.searchService')}</option>
                                {mockServices.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">{t('createLink.totalAmount')}</label>
                                <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="w-full bg-gray-50 border border-gray-300 rounded-md p-2"/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">{t('createLink.currency')}</label>
                                <select value={currency} onChange={(e) => setCurrency(e.target.value as Currency)} className="w-full bg-gray-50 border border-gray-300 rounded-md p-2 h-[42px]">
                                    <option>USD</option><option>EUR</option><option>GBP</option><option>TRY</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    {/* Right Column: Summary */}
                    <div className="bg-gray-50/80 p-4 rounded-lg border border-gray-200/80">
                         <h3 className="text-lg font-semibold mb-3">{t('createLink.selectedServices')}</h3>
                         <div className="space-y-2 max-h-48 overflow-y-auto">
                            {selectedServices.length > 0 ? selectedServices.map(s => (
                                <div key={s.id} className="flex justify-between items-center bg-white p-2 rounded-md border">
                                    <div><p className="text-sm font-medium">{s.name}</p><p className="text-sm text-gray-500">{formatCurrency(s.price, s.currency)}</p></div>
                                    <button onClick={() => setSelectedServices(prev => prev.filter(ps => ps.id !== s.id))} className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-100 rounded-full"><X size={16}/></button>
                                </div>
                            )) : <p className="text-sm text-gray-500 text-center py-4">{t('createLink.noServicesSelected')}</p>}
                         </div>
                         <div className="mt-4 pt-4 border-t-2 border-dashed"><div className="flex justify-between items-center font-bold text-lg"><span>{t('createLink.totalAmount')}:</span><span>{formatCurrency(amount, currency)}</span></div></div>
                    </div>
                </div>
                <div className="mt-6 pt-4 border-t">
                    <button onClick={handleGenerateLink} className="w-full flex items-center justify-center gap-2 bg-[#128c7e] text-white px-4 py-3 rounded-lg hover:bg-[#075e54] transition-colors font-semibold text-lg">
                        <Link size={20}/><span>{t('createLink.generateLink')}</span>
                    </button>
                </div>
            </div>
            <style>{`
                @keyframes fade-in-scale { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
                .animate-fade-in-scale { animation: fade-in-scale 0.2s ease-out forwards; }
            `}</style>
        </div>
    );
};

// --- MAIN PAGE COMPONENT --- //
const CreateLink: React.FC = () => {
    const { t, language } = useLanguage();
    const [links, setLinks] = useState<GeneratedLink[]>(mockGeneratedLinks);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null);

    const filteredLinks = useMemo(() => links.filter(link => {
        const matchesSearch = link.customer.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || link.status === statusFilter;
        return matchesSearch && matchesStatus;
    }), [links, searchTerm, statusFilter]);

    const handleAddLink = (newLink: GeneratedLink) => {
        setLinks(prev => [newLink, ...prev]);
        setIsModalOpen(false);
    };

    const handleCopyClick = (linkToCopy: GeneratedLink) => {
      navigator.clipboard.writeText(linkToCopy.url);
      setCopiedLinkId(linkToCopy.id);
      setTimeout(() => {
        setCopiedLinkId(null);
      }, 2000);
    };
    
    const getStatusClass = (status: 'Paid' | 'Pending' | 'Expired') => ({
        'Paid': 'bg-green-500/20 text-green-600',
        'Pending': 'bg-yellow-500/20 text-yellow-600',
        'Expired': 'bg-red-500/20 text-red-600',
    }[status]);

    const formatCurrency = (price: number, curr: Currency) => new Intl.NumberFormat(language, { style: 'currency', currency: curr }).format(price);

    return (
        <>
            <CreateLinkModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onLinkCreated={handleAddLink} />
            <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">{t('createLink.title')}</h2>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
                            <input type="text" placeholder={t('createLink.searchByCustomer')} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-64 bg-gray-100 border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:ring-[#128c7e] focus:border-[#128c7e]"/>
                        </div>
                        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="bg-gray-100 border border-gray-300 rounded-lg py-2 px-3 focus:ring-[#128c7e] focus:border-[#128c7e]">
                            <option value="All">{t('createLink.allStatuses')}</option>
                            <option value="Paid">{t('createLink.statusPaid')}</option>
                            <option value="Pending">{t('createLink.statusPending')}</option>
                            <option value="Expired">{t('createLink.statusExpired')}</option>
                        </select>
                        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-[#128c7e] text-white px-4 py-2 rounded-lg hover:bg-[#075e54] transition-colors">
                            <PlusCircle size={18}/><span>{t('createLink.createNewLink')}</span>
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="p-4 font-semibold">{t('createLink.tableHeaderCustomer')}</th>
                                <th className="p-4 font-semibold">{t('createLink.tableHeaderAmount')}</th>
                                <th className="p-4 font-semibold">{t('createLink.tableHeaderStatus')}</th>
                                <th className="p-4 font-semibold">{t('createLink.tableHeaderDate')}</th>
                                <th className="p-4 font-semibold">{t('createLink.tableHeaderCreatedBy')}</th>
                                <th className="p-4 font-semibold text-center">{t('createLink.tableHeaderActions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLinks.map(link => (
                                <tr key={link.id} className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <img src={link.customer.avatarUrl} alt={link.customer.name} className="w-10 h-10 rounded-full object-cover"/>
                                            <div>
                                                <p className="font-semibold">{link.customer.name}</p>
                                                <p className="text-sm text-gray-500">{link.customer.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 font-medium">{formatCurrency(link.amount, link.currency)}</td>
                                    <td className="p-4"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(link.status)}`}>{t(`createLink.status${link.status}`)}</span></td>
                                    <td className="p-4 text-gray-500">{link.date}</td>
                                    <td className="p-4 text-gray-500">{link.createdBy}</td>
                                    <td className="p-4 text-center">
                                        <div className="relative inline-flex items-center justify-center">
                                            <button 
                                                onClick={() => handleCopyClick(link)} 
                                                className="p-2 text-gray-500 hover:text-[#128c7e] hover:bg-[#128c7e]/10 rounded-full transition-colors" 
                                                title={t('createLink.copyUrl')}
                                            >
                                                {copiedLinkId === link.id ? (
                                                    <Check className="text-green-500" size={18} />
                                                ) : (
                                                    <Copy size={18} />
                                                )}
                                            </button>
                                            {copiedLinkId === link.id && (
                                                <div className="absolute bottom-full mb-2 w-max bg-gray-800 text-white text-xs px-2 py-1 rounded-md shadow-lg pointer-events-none transition-opacity duration-300 opacity-100">
                                                    {t('createLink.urlCopied')}
                                                </div>
                                            )}
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

export default CreateLink;