
import React, { useState } from 'react';
import { useLanguage } from '../hooks/useLanguage';
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

const getCategoryClass = (category: string) => {
    switch (category) {
      case 'Aesthetic Surgery': return 'bg-pink-500/20 text-pink-500';
      case 'Dentistry': return 'bg-sky-500/20 text-sky-500';
      case 'Bariatric Surgery': return 'bg-orange-500/20 text-orange-500';
      case 'Ophthalmology': return 'bg-indigo-500/20 text-indigo-500';
      default: return 'bg-gray-500/20 text-gray-500';
    }
};

const Services: React.FC = () => {
  const { t, language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [services, setServices] = useState<Service[]>(mockServices);
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentService, setCurrentService] = useState<Omit<Service, 'id'>>({ name: '', description: '', price: 0, currency: 'USD', category: '' });
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);

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
            <div className="bg-white rounded-lg p-6 w-full max-w-lg border border-gray-200 shadow-xl transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale">
                <h3 className="text-lg font-semibold mb-4">{editingServiceId ? t('services.editServiceModalTitle') : t('services.addServiceModalTitle')}</h3>
                <div className="space-y-4">
                    <div>
                        <label className="text-sm text-gray-500 font-medium">{t('services.name')}</label>
                        <input 
                            name="name" 
                            value={currentService.name} 
                            onChange={handleInputChange} 
                            className="w-full bg-gray-50 border border-gray-300 rounded-md p-2 mt-1 focus:ring-2 focus:ring-[#128c7e] focus:border-transparent transition-colors" 
                        />
                    </div>
                    <div>
                        <label className="text-sm text-gray-500 font-medium">{t('services.category')}</label>
                        <input 
                            name="category" 
                            value={currentService.category} 
                            onChange={handleInputChange} 
                            className="w-full bg-gray-50 border border-gray-300 rounded-md p-2 mt-1 focus:ring-2 focus:ring-[#128c7e] focus:border-transparent transition-colors" 
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm text-gray-500 font-medium">{t('services.price')}</label>
                            <input 
                                type="number"
                                name="price" 
                                value={currentService.price} 
                                onChange={handleInputChange} 
                                className="w-full bg-gray-50 border border-gray-300 rounded-md p-2 mt-1 focus:ring-2 focus:ring-[#128c7e] focus:border-transparent transition-colors" 
                            />
                        </div>
                        <div>
                            <label className="text-sm text-gray-500 font-medium">{t('services.currency')}</label>
                            <select
                                name="currency"
                                value={currentService.currency}
                                onChange={handleInputChange}
                                className="w-full bg-gray-50 border border-gray-300 rounded-md p-2 mt-1 focus:ring-2 focus:ring-[#128c7e] focus:border-transparent transition-colors h-[42px]"
                            >
                                <option value="USD">USD</option>
                                <option value="EUR">EUR</option>
                                <option value="GBP">GBP</option>
                                <option value="TRY">TRY</option>
                            </select>
                        </div>
                    </div>
                     <div>
                        <label className="text-sm text-gray-500 font-medium">{t('services.description')}</label>
                        <textarea 
                            name="description" 
                            value={currentService.description} 
                            onChange={handleInputChange} 
                            rows={3} 
                            className="w-full bg-gray-50 border border-gray-300 rounded-md p-2 mt-1 focus:ring-2 focus:ring-[#128c7e] focus:border-transparent transition-colors" 
                        />
                    </div>
                </div>
                <div className="flex justify-end gap-4 mt-6">
                    <button onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors">{t('services.cancel')}</button>
                    <button onClick={handleSaveService} className="px-4 py-2 rounded-lg bg-[#128c7e] text-white hover:bg-[#075e54] transition-colors">{t('services.save')}</button>
                </div>
            </div>
             <style jsx>{`
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
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">{t('services.allServices')}</h2>
          <div className="flex items-center gap-4">
              <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
                  <input
                      type="text"
                      placeholder={t('services.search')}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-64 bg-gray-100 border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:ring-[#128c7e] focus:border-[#128c7e] transition-colors"
                  />
              </div>
              <button onClick={handleOpenAddModal} className="flex items-center gap-2 bg-[#128c7e] text-white px-4 py-2 rounded-lg hover:bg-[#075e54] transition-colors">
              <PlusCircle size={18}/>
              <span>{t('services.addService')}</span>
              </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="p-4 font-semibold">{t('services.name')}</th>
                <th className="p-4 font-semibold">{t('services.category')}</th>
                <th className="p-4 font-semibold">{t('services.price')}</th>
                <th className="p-4 text-center font-semibold">{t('services.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredServices.map(service => (
                <tr key={service.id} className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50">
                  <td className="p-4">
                    <p className="font-semibold">{service.name}</p>
                    <p className="text-sm text-gray-500 truncate max-w-md">{service.description}</p>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getCategoryClass(service.category)}`}>
                      {service.category}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600 font-medium">
                    {formatCurrency(service.price, service.currency)}
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                        <button 
                            onClick={() => handleOpenEditModal(service)}
                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-100 rounded-full transition-colors"
                            aria-label={t('services.editServiceModalTitle')}
                        >
                            <Pencil size={18}/>
                        </button>
                        <button 
                            onClick={() => handleDeleteService(service.id)}
                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-full transition-colors"
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