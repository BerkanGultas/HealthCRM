import React, { useState } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { useTheme } from '../context/ThemeContext';
import { Service, Currency } from '../types';
import { Pencil, Trash2, PlusCircle, Search } from 'lucide-react';

const mockServices: Service[] = [
  { id: 'HT-001', name: 'Hair Transplant (FUE)', description: 'Follicular Unit Extraction method for natural-looking results.', price: 3500, currency: 'USD', category: 'Aesthetic Surgery' },
  { id: 'DT-002', name: 'Dental Implants (All-on-4)', description: 'Full arch restoration with four dental implants.', price: 10000, currency: 'EUR', category: 'Dentistry' },
  { id: 'ES-003', name: 'Rhinoplasty', description: 'Cosmetic surgery of the nose to improve appearance.', price: 5000, currency: 'USD', category: 'Aesthetic Surgery' },
  { id: 'WS-004', name: 'Gastric Sleeve Surgery', description: 'Weight-loss surgery that reduces the size of the stomach.', price: 7500, currency: 'EUR', category: 'Bariatric Surgery' },
  { id: 'OS-005', name: 'LASIK Eye Surgery', description: 'Laser procedure to correct vision problems.', price: 2000, currency: 'USD', category: 'Ophthalmology' },
  { id: 'DT-006', name: 'Teeth Whitening', description: 'Professional in-office teeth whitening for a brighter smile.', price: 500, currency: 'TRY', category: 'Dentistry' },
];

const Services: React.FC = () => {
  const { t, language } = useLanguage();
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [services, setServices] = useState<Service[]>(mockServices);
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentService, setCurrentService] = useState<Omit<Service, 'id'>>({ name: '', description: '', price: 0, currency: 'USD', category: '' });
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  
  const getCategoryClass = (category: string) => {
    const categoryClasses = {
        light: {
            'Aesthetic Surgery': 'bg-pink-500/20 text-pink-600',
            'Dentistry': 'bg-sky-500/20 text-sky-600',
            'Bariatric Surgery': 'bg-orange-500/20 text-orange-600',
            'Ophthalmology': 'bg-indigo-500/20 text-indigo-600',
            'default': 'bg-gray-500/20 text-gray-600',
        },
        dark: {
            'Aesthetic Surgery': 'bg-pink-400/20 text-pink-400',
            'Dentistry': 'bg-sky-400/20 text-sky-400',
            'Bariatric Surgery': 'bg-orange-400/20 text-orange-400',
            'Ophthalmology': 'bg-indigo-400/20 text-indigo-400',
            'default': 'bg-gray-400/20 text-gray-400',
        }
    };
    const themeCategories = categoryClasses[theme];
    return themeCategories[category as keyof typeof themeCategories] || themeCategories.default;
  };

  const formatCurrency = (price: number, currency: Currency) => {
    return new Intl.NumberFormat(language, {
        style: 'currency',
        currency: currency,
    }).format(price);
  };

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentService(prev => ({ 
        ...prev, 
        [name]: name === 'price' ? parseFloat(value) || 0 : value 
    }));
  };
  
  const handleOpenAddModal = () => {
    setEditingServiceId(null);
    setCurrentService({ name: '', description: '', price: 0, currency: 'USD', category: '' });
    setModalOpen(true);
  };

  const handleOpenEditModal = (service: Service) => {
    setEditingServiceId(service.id);
    setCurrentService({
        name: service.name,
        description: service.description,
        price: service.price,
        currency: service.currency,
        category: service.category
    });
    setModalOpen(true);
  };

  const handleDeleteService = (serviceId: string) => {
    if (window.confirm(t('services.deleteConfirm'))) {
        setServices(prevServices => prevServices.filter(s => s.id !== serviceId));
    }
  };

  const handleSaveService = () => {
    if (!currentService.name || !currentService.category || currentService.price <= 0) {
        alert('Please fill all required fields and ensure price is greater than zero.');
        return;
    }

    if (editingServiceId) {
        setServices(prevServices => 
            prevServices.map(s => s.id === editingServiceId ? { ...s, ...currentService } : s)
        );
    } else {
        const serviceToAdd: Service = {
            id: `SRV-${Date.now()}`,
            ...currentService
        };
        setServices([serviceToAdd, ...services]);
    }
    
    setModalOpen(false);
  };

  return (
    <>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-opacity duration-300">
            <div className="bg-[var(--card-background)] rounded-lg p-6 w-full max-w-lg border border-[var(--border)] shadow-xl transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale">
                <h3 className="text-lg font-semibold mb-4">{editingServiceId ? t('services.editServiceModalTitle') : t('services.addServiceModalTitle')}</h3>
                <div className="space-y-4">
                    <div>
                        <label className="text-sm text-[var(--foreground-muted)] font-medium">{t('services.name')}</label>
                        <input 
                            name="name" 
                            value={currentService.name} 
                            onChange={handleInputChange} 
                            className="w-full bg-[var(--input-background)] border border-[var(--border)] rounded-md p-2 mt-1 focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-colors" 
                        />
                    </div>
                    <div>
                        <label className="text-sm text-[var(--foreground-muted)] font-medium">{t('services.category')}</label>
                        <input 
                            name="category" 
                            value={currentService.category} 
                            onChange={handleInputChange} 
                            className="w-full bg-[var(--input-background)] border border-[var(--border)] rounded-md p-2 mt-1 focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-colors" 
                        />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm text-[var(--foreground-muted)] font-medium">{t('services.price')}</label>
                            <input 
                                type="number"
                                name="price" 
                                value={currentService.price} 
                                onChange={handleInputChange} 
                                className="w-full bg-[var(--input-background)] border border-[var(--border)] rounded-md p-2 mt-1 focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-colors" 
                            />
                        </div>
                        <div>
                            <label className="text-sm text-[var(--foreground-muted)] font-medium">{t('services.currency')}</label>
                            <select
                                name="currency"
                                value={currentService.currency}
                                onChange={handleInputChange}
                                className="w-full bg-[var(--input-background)] border border-[var(--border)] rounded-md p-2 mt-1 focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-colors h-[42px]"
                            >
                                <option value="USD">USD</option>
                                <option value="EUR">EUR</option>
                                <option value="GBP">GBP</option>
                                <option value="TRY">TRY</option>
                            </select>
                        </div>
                    </div>
                     <div>
                        <label className="text-sm text-[var(--foreground-muted)] font-medium">{t('services.description')}</label>
                        <textarea 
                            name="description" 
                            value={currentService.description} 
                            onChange={handleInputChange} 
                            rows={3} 
                            className="w-full bg-[var(--input-background)] border border-[var(--border)] rounded-md p-2 mt-1 focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-colors" 
                        />
                    </div>
                </div>
                <div className="flex justify-end gap-4 mt-6">
                    <button onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-lg text-[var(--foreground)] bg-[var(--accent)] hover:bg-opacity-75 transition-colors">{t('services.cancel')}</button>
                    <button onClick={handleSaveService} className="px-4 py-2 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)] transition-colors">{t('services.save')}</button>
                </div>
            </div>
             <style>{`
                @keyframes fade-in-scale {
                    from {
                        opacity: 0;
                        transform: scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                .animate-fade-in-scale {
                    animation: fade-in-scale 0.2s ease-out forwards;
                }
            `}</style>
        </div>
        
      )}
      <div className="bg-[var(--card-background)] p-6 rounded-lg border border-[var(--border)]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h2 className="text-xl font-semibold">{t('services.allServices')}</h2>
          <div className="w-full md:w-auto flex flex-col sm:flex-row items-center gap-4">
              <div className="relative w-full sm:w-auto">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
                  <input
                      type="text"
                      placeholder={t('services.search')}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full sm:w-64 bg-[var(--input-background)] border border-[var(--border)] rounded-lg pl-10 pr-4 py-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] transition-colors"
                  />
              </div>
              <button onClick={handleOpenAddModal} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[var(--primary)] text-[var(--primary-foreground)] px-4 py-2 rounded-lg hover:bg-[var(--primary-hover)] transition-colors">
              <PlusCircle size={18}/>
              <span>{t('services.addService')}</span>
              </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="p-4 font-semibold">{t('services.name')}</th>
                <th className="p-4 font-semibold">{t('services.category')}</th>
                <th className="p-4 font-semibold">{t('services.price')}</th>
                <th className="p-4 text-center font-semibold">{t('services.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredServices.map(service => (
                <tr key={service.id} className="border-b border-[var(--border)] last:border-b-0 hover:bg-[var(--accent)]/50">
                  <td className="p-4">
                    <p className="font-semibold">{service.name}</p>
                    <p className="text-sm text-[var(--foreground-muted)] truncate max-w-md">{service.description}</p>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getCategoryClass(service.category)}`}>
                      {service.category}
                    </span>
                  </td>
                  <td className="p-4 font-medium">
                    {formatCurrency(service.price, service.currency)}
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                        <button 
                            onClick={() => handleOpenEditModal(service)}
                            className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-500/10 rounded-full transition-colors"
                            aria-label={t('services.editServiceModalTitle')}
                        >
                            <Pencil size={18}/>
                        </button>
                        <button 
                            onClick={() => handleDeleteService(service.id)}
                            className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-colors"
                            aria-label={t('services.deleteConfirm')}
                        >
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

export default Services;