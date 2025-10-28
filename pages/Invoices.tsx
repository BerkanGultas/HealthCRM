import React, { useState, useMemo } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { Customer, Service, Currency, Invoice } from '../types';
import { PlusCircle, Search, FileText, MoreHorizontal, X } from 'lucide-react';

// --- MOCK DATA --- //
const mockCustomers: Customer[] = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', phone: '123-456-7890', country: 'USA', lastContacted: '2024-07-20', agent: 'John Smith', avatarUrl: 'https://picsum.photos/id/11/200/200' },
  { id: 2, name: 'Bob Williams', email: 'bob@example.com', phone: '234-567-8901', country: 'Canada', lastContacted: '2024-07-19', agent: 'Emily White', avatarUrl: 'https://picsum.photos/id/12/200/200' },
  { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', phone: '345-678-9012', country: 'UK', lastContacted: '2024-07-21', agent: 'John Smith', avatarUrl: 'https://picsum.photos/id/13/200/200' },
];

const mockServices: Service[] = [
  { id: 'HT-001', name: 'Hair Transplant (FUE)', description: 'Follicular Unit Extraction method.', price: 3500, currency: 'USD', category: 'Aesthetic Surgery' },
  { id: 'DT-002', name: 'Dental Implants (All-on-4)', description: 'Full arch restoration.', price: 10000, currency: 'EUR', category: 'Dentistry' },
  { id: 'ES-003', name: 'Rhinoplasty', description: 'Cosmetic surgery of the nose.', price: 5000, currency: 'USD', category: 'Aesthetic Surgery' },
];

const mockInvoices: Invoice[] = [
    { id: 'INV-2024-001', customer: mockCustomers[0], services: [mockServices[0]], totalAmount: 3500, currency: 'USD', status: 'Paid', issueDate: '2024-07-15', dueDate: '2024-07-30' },
    { id: 'INV-2024-002', customer: mockCustomers[1], services: [mockServices[1]], totalAmount: 10000, currency: 'EUR', status: 'Pending', issueDate: '2024-07-20', dueDate: '2024-08-05' },
    { id: 'INV-2024-003', customer: mockCustomers[2], services: [mockServices[0], mockServices[1]], totalAmount: 13500, currency: 'USD', status: 'Overdue', issueDate: '2024-06-25', dueDate: '2024-07-10' },
];

const CreateInvoiceModal: React.FC<{ isOpen: boolean; onClose: () => void; onInvoiceCreated: (invoice: Invoice) => void }> = ({ isOpen, onClose, onInvoiceCreated }) => {
    const { t, language } = useLanguage();
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [selectedServices, setSelectedServices] = useState<Service[]>([]);
    
    const totalAmount = useMemo(() => {
        return selectedServices.reduce((sum, service) => sum + service.price, 0);
    }, [selectedServices]);
    
    const currency = useMemo(() => {
        return selectedServices.length > 0 ? selectedServices[0].currency : 'USD';
    }, [selectedServices]);

    const invoiceId = useMemo(() => `INV-${Date.now().toString().slice(-6)}`, []);

    const handleCreateInvoice = () => {
        if (!selectedCustomer || selectedServices.length === 0) {
            alert("Please select a customer and at least one service.");
            return;
        }
        const newInvoice: Invoice = {
            id: invoiceId,
            customer: selectedCustomer,
            services: selectedServices,
            totalAmount: totalAmount,
            currency: currency,
            status: 'Pending',
            issueDate: new Date().toISOString().split('T')[0],
            dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Due in 15 days
        };
        onInvoiceCreated(newInvoice);
        // Reset state & close
        setSelectedCustomer(null);
        setSelectedServices([]);
        onClose();
    };

    const formatCurrency = (price: number, curr: Currency) => new Intl.NumberFormat(language, { style: 'currency', currency: curr }).format(price);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 transition-opacity">
            <div className="bg-white rounded-lg p-8 w-full max-w-4xl border border-gray-200 shadow-xl transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale">
                {/* Header */}
                <div className="flex justify-between items-start pb-6 border-b">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">
                            <span className="text-[#128c7e]">Health</span>CRM
                        </h1>
                        <p className="text-gray-500 mt-2">123 Health St, Wellness City, 12345</p>
                        <p className="text-gray-500">Phone: (123) 456-7890</p>
                        <p className="text-gray-500">Email: contact@healthcrm.com</p>
                    </div>
                    <div className="text-right">
                        <h2 className="text-3xl font-bold text-gray-400 uppercase tracking-wider">{t('invoices.invoiceTitle')}</h2>
                        <p className="font-semibold text-lg mt-2">{selectedCustomer ? selectedCustomer.name : '...'}</p>
                        <p className="text-gray-500">ID: {invoiceId}</p>
                        <p className="text-gray-500">Date: {new Date().toLocaleDateString()}</p>
                    </div>
                </div>

                {/* Body */}
                <div className="my-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                         <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">{t('invoices.selectCustomer')}</label>
                            <select value={selectedCustomer?.id || ''} onChange={(e) => setSelectedCustomer(mockCustomers.find(c => c.id === Number(e.target.value)) || null)} className="w-full bg-gray-50 border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#128c7e] focus:border-transparent">
                                <option value="" disabled>{t('invoices.searchCustomerPlaceholder')}</option>
                                {mockCustomers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">{t('invoices.addService')}</label>
                             <select value={''} onChange={(e) => {
                                const service = mockServices.find(s => s.id === e.target.value);
                                if(service && !selectedServices.find(ss => ss.id === service.id)) setSelectedServices(prev => [...prev, service]);
                            }} className="w-full bg-gray-50 border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#128c7e] focus:border-transparent">
                                <option value="" disabled>{t('invoices.searchServicePlaceholder')}</option>
                                {mockServices.map(s => <option key={s.id} value={s.id}>{s.name} - {formatCurrency(s.price, s.currency)}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="border rounded-lg overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="p-3 text-left text-sm font-semibold text-gray-600">{t('invoices.tableHeaderService')}</th>
                                    <th className="p-3 text-right text-sm font-semibold text-gray-600">{t('createLink.tableHeaderAmount')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedServices.length > 0 ? selectedServices.map((service) => (
                                    <tr key={service.id} className="border-b last:border-0">
                                        <td className="p-3">
                                            <p className="font-medium">{service.name}</p>
                                        </td>
                                        <td className="p-3 text-right font-medium">{formatCurrency(service.price, service.currency)}</td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={2} className="p-6 text-center text-gray-500">{t('invoices.noServicesSelected')}</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end items-center pt-6 border-t">
                     <div className="text-right">
                        <div className="flex items-center justify-end mb-2">
                            <span className="text-lg text-gray-600 mr-4">{t('invoices.total')}:</span>
                            <span className="text-2xl font-bold text-gray-800">{formatCurrency(totalAmount, currency)}</span>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-4 mt-8">
                    <button onClick={onClose} className="px-6 py-2 rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors font-semibold">{t('invoices.cancel')}</button>
                    <button onClick={handleCreateInvoice} className="px-6 py-2 rounded-lg bg-[#128c7e] text-white hover:bg-[#075e54] transition-colors font-semibold">{t('invoices.createInvoiceAction')}</button>
                </div>

            </div>
            <style jsx>{`
                @keyframes fade-in-scale { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
                .animate-fade-in-scale { animation: fade-in-scale 0.2s ease-out forwards; }
            `}</style>
        </div>
    );
};

const Invoices: React.FC = () => {
    const { t, language } = useLanguage();
    const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [isModalOpen, setModalOpen] = useState(false);

    const filteredInvoices = useMemo(() => invoices.filter(invoice => {
        const matchesSearch = invoice.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) || invoice.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || invoice.status === statusFilter;
        return matchesSearch && matchesStatus;
    }), [invoices, searchTerm, statusFilter]);

    const handleCreateInvoice = (newInvoice: Invoice) => {
        setInvoices(prev => [newInvoice, ...prev]);
    };
    
    const getStatusClass = (status: 'Paid' | 'Pending' | 'Overdue') => ({
        'Paid': 'bg-green-500/20 text-green-600',
        'Pending': 'bg-yellow-500/20 text-yellow-600',
        'Overdue': 'bg-red-500/20 text-red-600',
    }[status]);

    const formatCurrency = (price: number, curr: Currency) => new Intl.NumberFormat(language, { style: 'currency', currency: curr }).format(price);

    return (
        <>
            <CreateInvoiceModal 
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                onInvoiceCreated={handleCreateInvoice}
            />
            <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">{t('invoices.title')}</h2>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
                            <input type="text" placeholder={t('invoices.searchByCustomer')} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-64 bg-gray-100 border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:ring-[#128c7e] focus:border-[#128c7e]"/>
                        </div>
                        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="bg-gray-100 border border-gray-300 rounded-lg py-2 px-3 focus:ring-[#128c7e] focus:border-[#128c7e]">
                            <option value="All">{t('invoices.allStatuses')}</option>
                            <option value="Paid">{t('invoices.statusPaid')}</option>
                            <option value="Pending">{t('invoices.statusPending')}</option>
                            <option value="Overdue">{t('invoices.statusOverdue')}</option>
                        </select>
                        <button onClick={() => setModalOpen(true)} className="flex items-center gap-2 bg-[#128c7e] text-white px-4 py-2 rounded-lg hover:bg-[#075e54] transition-colors">
                            <PlusCircle size={18}/><span>{t('invoices.createNewInvoice')}</span>
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="p-4 font-semibold">{t('invoices.tableHeaderInvoiceID')}</th>
                                <th className="p-4 font-semibold">{t('invoices.tableHeaderCustomer')}</th>
                                <th className="p-4 font-semibold">{t('invoices.tableHeaderAmount')}</th>
                                <th className="p-4 font-semibold">{t('invoices.tableHeaderStatus')}</th>
                                <th className="p-4 font-semibold">{t('invoices.tableHeaderIssueDate')}</th>
                                <th className="p-4 font-semibold">{t('invoices.tableHeaderDueDate')}</th>
                                <th className="p-4 font-semibold text-center">{t('invoices.tableHeaderActions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredInvoices.map(invoice => (
                                <tr key={invoice.id} className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50">
                                    <td className="p-4 font-medium text-[#128c7e]">{invoice.id}</td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <img src={invoice.customer.avatarUrl} alt={invoice.customer.name} className="w-10 h-10 rounded-full object-cover"/>
                                            <div>
                                                <p className="font-semibold">{invoice.customer.name}</p>
                                                <p className="text-sm text-gray-500">{invoice.customer.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 font-medium">{formatCurrency(invoice.totalAmount, invoice.currency)}</td>
                                    <td className="p-4"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(invoice.status)}`}>{t(`invoices.status${invoice.status}`)}</span></td>
                                    <td className="p-4 text-gray-500">{invoice.issueDate}</td>
                                    <td className="p-4 text-gray-500">{invoice.dueDate}</td>
                                    <td className="p-4 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-100 rounded-full" title={t('invoices.downloadPdf')}><FileText size={18}/></button>
                                            <button className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded-full" title={t('invoices.viewDetails')}><MoreHorizontal size={20}/></button>
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

export default Invoices;