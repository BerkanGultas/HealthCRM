import React from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { useTheme } from '../context/ThemeContext';
import { DollarSign, Users, Clock, MessageSquare } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Card: React.FC<{ icon: React.ReactNode; title: string; value: string; change: string; changeType: 'increase' | 'decrease' }> = ({ icon, title, value, change, changeType }) => {
  const isIncrease = changeType === 'increase';
  return (
    <div className="bg-[var(--card-background)] p-6 rounded-lg border border-[var(--border)]">
      <div className="flex items-center justify-between">
        <div className="p-3 bg-[var(--accent)] rounded-lg">{icon}</div>
        <div className={`text-sm font-semibold ${isIncrease ? 'text-green-500' : 'text-red-500'}`}>
          {isIncrease ? '▲' : '▼'} {change}
        </div>
      </div>
      <p className="mt-4 text-3xl font-bold">{value}</p>
      <p className="text-sm text-[var(--foreground-muted)]">{title}</p>
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
  const { theme } = useTheme();

  const axisColor = theme === 'dark' ? '#a8a29e' : '#6b7280';
  const gridColor = theme === 'dark' ? 'rgba(168, 162, 158, 0.1)' : '#e5e7eb';
  const tooltipStyle = {
      backgroundColor: 'var(--card-background)',
      border: `1px solid var(--border)`,
      color: 'var(--card-foreground)'
  };
  const legendColor = theme === 'dark' ? '#d6d3d1' : '#374151';

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card icon={<DollarSign className="text-green-500"/>} title={t('dashboard.totalRevenue')} value="$45,231" change="+2.5%" changeType="increase"/>
        <Card icon={<Users className="text-blue-500"/>} title={t('dashboard.newCustomers')} value="1,204" change="+5.1%" changeType="increase"/>
        <Card icon={<Clock className="text-yellow-500"/>} title={t('dashboard.pendingPayments')} value="89" change="-1.2%" changeType="decrease"/>
        <Card icon={<MessageSquare className="text-purple-500"/>} title={t('dashboard.openConversations')} value="32" change="+12" changeType="increase"/>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 bg-[var(--card-background)] p-6 rounded-lg border border-[var(--border)]">
          <h3 className="text-lg font-semibold mb-4">{t('dashboard.revenueOverTime')}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="name" stroke={axisColor} tick={{ fill: axisColor }}/>
              <YAxis stroke={axisColor} tick={{ fill: axisColor }} />
              <Tooltip contentStyle={tooltipStyle}/>
              <Legend wrapperStyle={{ color: legendColor }} />
              <Line type="monotone" dataKey="revenue" stroke="var(--primary)" strokeWidth={2} activeDot={{ r: 8, fill: 'var(--primary)' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="lg:col-span-2 bg-[var(--card-background)] p-6 rounded-lg border border-[var(--border)]">
          <h3 className="text-lg font-semibold mb-4">{t('dashboard.messagesByPlatform')}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={platformData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis type="number" stroke={axisColor} tick={{ fill: axisColor }} />
              <YAxis type="category" dataKey="name" stroke={axisColor} width={80} tick={{ fill: axisColor }} />
              <Tooltip contentStyle={tooltipStyle}/>
              <Legend wrapperStyle={{ color: legendColor }}/>
              <Bar dataKey="messages" fill="var(--secondary)" barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;