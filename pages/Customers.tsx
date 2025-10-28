
import React, { useState, useMemo } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { Customer } from '../types';
import { PlusCircle, Search, Pencil, Trash2, X } from 'lucide-react';

const mockAgents = ['John Smith', 'Emily White', 'Admin User'];

const mockCustomers: Customer[] = [
  { id: 1, name: 'Alice Johnson', email: 'alice.j@example.com', phone: '+1-202-555-0186', country: 'USA', agent: 'John Smith', avatarUrl: 'https://picsum.photos/id/11/200/200' },
  { id: 2, name: 'Bob Williams', email: 'bob.w@example.com', phone: '+44-20-7946-0958', country: 'UK', agent: 'Emily White', avatarUrl: 'https://picsum.photos/id/12/200/200' },
  { id: 3, name: 'Charlie Brown', email: 'charlie.b@example.com', phone: '+49-30-12345678', country: 'Germany', agent: 'John Smith', avatarUrl: 'https://picsum.photos/id/13/200/200' },
  { id: 4, name: 'Diana Miller', email: 'diana.m@example.com', phone: '+33-1-23-45-67-89', country: 'France', agent: 'Emily White', avatarUrl: 'https://picsum.photos/id/14/200/200' },
  { id: 5, name: 'Ethan Garcia', email: 'ethan.g@example.com', phone: '+90-555-123-4567', country: 'Turkey', agent: 'Admin User', avatarUrl: 'https://picsum.photos/id/15/200/200' },
];

const CustomerModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (customer: Omit<Customer, 'id'>) => void;
    customerToEdit: Customer | null;
}> = ({ isOpen, onClose, onSave, customerToEdit }) => {
    const { t } = useLanguage();
    const [customerData, setCustomerData] = useState(customerToEdit || { name: '', email: '', phone: '', country: '', agent: mockAgents[0], avatarUrl: 'https://picsum.photos/seed/new/200/200' });
    
    React.useEffect(() => {
        setCustomerData(customerToEdit || { name: '', email: '', phone: '', country: '', agent: mockAgents[0], avatarUrl: `https://picsum.photos/seed/${Date.now()}/200/200` });
    }, [customerToEdit, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setCustomerData({ ...customerData, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        if(customerData.name && customerData.email) {
            onSave(customerData);
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
                    <h3 className="text-lg font-semibold">{customerToEdit ? t('customers.editModalTitle') : t('customers.addModalTitle')}</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100"><X size={20}/></button>
                </div>
                <div className="space-y-4">
                     <div>
                        <label className="text-sm text-gray-500 font-medium">{t('customers.name')}</label>
                        <input name="name" value={customerData.name} onChange={handleChange} className="w-full bg-gray-50 border border-gray-300 rounded-md p-2 mt-1" />
                    </div>
                     <div>
                        <label className="text-sm text-gray-500 font-medium">{t('customers.email')}</label>
                        <input type="email" name="email" value={customerData.email} onChange={handleChange} className="w-full bg-gray-50 border border-gray-300 rounded-md p-2 mt-1" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm text-gray-500 font-medium">{t('customers.phone')}</label>
                            <input name="phone" value={customerData.phone} onChange={handleChange} className="w-full bg-gray-50 border border-gray-300 rounded-md p-2 mt-1" />
                        </div>
                        <div>
                            <label className="text-sm text-gray-500 font-medium">{t('customers.country')}</label>
                            <input name="country" value={customerData.country} onChange={handleChange} className="w-full bg-gray-50 border border-gray-300 rounded-md p-2 mt-1" />
                        </div>
                    </div>
                     <div>
                        <label className="text-sm text-gray-500 font-medium">{t('customers.agent')}</label>
                        <select name="agent" value={customerData.agent} onChange={handleChange} className="w-full bg-gray-50 border border-gray-300 rounded-md p-2 mt-1 h-[42px]">
                            {mockAgents.map(agent => <option key={agent} value={agent}>{agent}</option>)}
                        </select>
                    </div>
                </div>
                 <div className="flex justify-end gap-4 mt-6">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors">{t('customers.cancel')}</button>
                    <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-[#128c7e] text-white hover:bg-[#075e54] transition-colors">{t('customers.save')}</button>
                </div>
            </div>
             <style>{`
                @keyframes fade-in-scale { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
                .animate-fade-in-scale { animation: fade-in-scale 0.2s ease-out forwards; }
            `}</style>
        </div>
    );
};

const Customers: React.FC = () => {
    const { t } = useLanguage();
    const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setModalOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

    const filteredCustomers = useMemo(() => {
        return customers.filter(customer =>
            customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [customers, searchTerm]);

    const handleOpenAddModal = () => {
        setEditingCustomer(null);
        setModalOpen(true);
    };

    const handleOpenEditModal = (customer: Customer) => {
        setEditingCustomer(customer);
        setModalOpen(true);
    };

    const handleSaveCustomer = (customerData: Omit<Customer, 'id'>) => {
        if(editingCustomer) {
            setCustomers(prev => prev.map(c => c.id === editingCustomer.id ? { ...editingCustomer, ...customerData } : c));
        } else {
            const newCustomer: Customer = {
                id: Math.max(...customers.map(c => c.id), 0) + 1,
                ...customerData,
            };
            setCustomers(prev => [newCustomer, ...prev]);
        }
    };

    const handleDeleteCustomer = (customerId: number) => {
        if (window.confirm(t('customers.deleteConfirm'))) {
            setCustomers(prev => prev.filter(c => c.id !== customerId));
        }
    };

  return (
    <>
        <CustomerModal 
            isOpen={isModalOpen}
            onClose={() => setModalOpen(false)}
            onSave={handleSaveCustomer}
            customerToEdit={editingCustomer}
        />
        <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">{t('customers.allCustomers')}</h2>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
                        <input
                            type="text"
                            placeholder={t('customers.search')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-64 bg-gray-100 border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:ring-[#128c7e] focus:border-[#128c7e] transition-colors"
                        />
                    </div>
                    <button onClick={handleOpenAddModal} className="flex items-center gap-2 bg-[#128c7e] text-white px-4 py-2 rounded-lg hover:bg-[#075e54] transition-colors">
                        <PlusCircle size={18}/>
                        <span>{t('customers.addCustomer')}</span>
                    </button>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                <thead>
                    <tr className="border-b border-gray-200">
                    <th className="p-4 font-semibold">{t('customers.name')}</th>
                    <th className="p-4 font-semibold">{t('customers.country')}</th>
                    <th className="p-4 font-semibold">{t('customers.agent')}</th>
                    <th className="p-4 text-center font-semibold">{t('customers.actions')}</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredCustomers.map(customer => (
                    <tr key={customer.id} className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50">
                        <td className="p-4">
                        <div className="flex items-center gap-3">
                            <img src={customer.avatarUrl} alt={customer.name} className="w-10 h-10 rounded-full object-cover"/>
                            <div>
                            <p className="font-semibold">{customer.name}</p>
                            <p className="text-sm text-gray-500">{customer.email}</p>
                            <p className="text-sm text-gray-500">{customer.phone}</p>
                            </div>
                        </div>
                        </td>
                        <td className="p-4 text-gray-600">{customer.country}</td>
                        <td className="p-4 text-gray-600">{customer.agent}</td>
                        <td className="p-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                                <button onClick={() => handleOpenEditModal(customer)} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-100 rounded-full transition-colors" aria-label={t('customers.editModalTitle')}><Pencil size={18}/></button>
                                <button onClick={() => handleDeleteCustomer(customer.id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-full transition-colors" aria-label={t('customers.deleteConfirm')}><Trash2 size={18}/></button>
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

export default Customers;