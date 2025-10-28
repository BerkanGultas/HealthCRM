import React from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { DollarSign, Users, Clock, MessageSquare } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Card: React.FC<{ icon: React.ReactNode; title: string; value: string; change: string; changeType: 'increase' | 'decrease' }> = ({ icon, title, value, change, changeType }) => {
  const isIncrease = changeType === 'increase';
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between">
        <div className="p-3 bg-gray-100 rounded-lg">{icon}</div>
        <div className={`text-sm font-semibold ${isIncrease ? 'text-green-500' : 'text-red-500'}`}>
          {isIncrease ? '▲' : '▼'} {change}
        </div>
      </div>
      <p className="mt-4 text-3xl font-bold">{value}</p>
      <p className="text-sm text-gray-500">{title}</p>
    </div>
  );
};

const revenueData = [
  { name: 'Jan', revenue: 4000 }, { name: 'Feb', revenue: 3000 },
  { name: 'Mar', revenue: 5000 }, { name: 'Apr', revenue: 4500 },
  { name: 'May', revenue: 6000 }, { name: 'Jun', revenue: 5500 },
];

const platformData = [
  { name: 'WhatsApp', messages: 1200 }, { name: 'Facebook', messages: 980 },
  { name: 'Instagram', messages: 750 }, { name: 'Web Chat', messages: 500 },
];

const Dashboard: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card icon={<DollarSign className="text-green-500"/>} title={t('dashboard.totalRevenue')} value="$45,231" change="+2.5%" changeType="increase"/>
        <Card icon={<Users className="text-blue-500"/>} title={t('dashboard.newCustomers')} value="1,204" change="+5.1%" changeType="increase"/>
        <Card icon={<Clock className="text-yellow-500"/>} title={t('dashboard.pendingPayments')} value="89" change="-1.2%" changeType="decrease"/>
        <Card icon={<MessageSquare className="text-purple-500"/>} title={t('dashboard.openConversations')} value="32" change="+12" changeType="increase"/>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">{t('dashboard.revenueOverTime')}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}/>
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#128c7e" strokeWidth={2} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="lg:col-span-2 bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">{t('dashboard.messagesByPlatform')}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={platformData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" stroke="#6b7280" />
              <YAxis type="category" dataKey="name" stroke="#6b7280" width={80} />
              <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}/>
              <Legend />
              <Bar dataKey="messages" fill="#25d366" barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;