import React, { useMemo } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { useTheme } from '../context/ThemeContext';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const revenueData = [
  { name: 'Jan', revenue: 4000 }, { name: 'Feb', revenue: 3000 },
  { name: 'Mar', revenue: 5000 }, { name: 'Apr', revenue: 4500 },
  { name: 'May', revenue: 6000 }, { name: 'Jun', revenue: 5500 },
  { name: 'Jul', revenue: 7000 }, { name: 'Aug', revenue: 6500 },
];

const paymentStatusData = [
  { name: 'Completed', value: 400 },
  { name: 'Pending', value: 150 },
  { name: 'Cancelled', value: 50 },
];

const agentPerformanceData = [
    { agent: 'John Smith', conversations: 120, avgResponseTime: 5 },
    { agent: 'Emily White', conversations: 150, avgResponseTime: 3 },
    { agent: 'Michael Brown', conversations: 95, avgResponseTime: 7 },
    { agent: 'Jessica Green', conversations: 130, avgResponseTime: 4 },
];

const userStatusData = [
    { name: 'Admin User', role: 'Admin', avatarUrl: 'https://picsum.photos/id/237/200/200', status: 'Online' },
    { name: 'Jane Doe', role: 'Moderator', avatarUrl: 'https://picsum.photos/id/1/200/200', status: 'Online' },
    { name: 'John Smith', role: 'Agent', avatarUrl: 'https://picsum.photos/id/2/200/200', status: 'Offline' },
    { name: 'Emily White', role: 'Agent', avatarUrl: 'https://picsum.photos/id/3/200/200', status: 'Online' },
    { name: 'Michael Brown', role: 'Agent', avatarUrl: 'https://picsum.photos/id/4/200/200', status: 'Offline' },
    { name: 'Jessica Green', role: 'Agent', avatarUrl: 'https://picsum.photos/id/5/200/200', status: 'Online' },
];

const Reports: React.FC = () => {
    const { t } = useLanguage();
    const { theme } = useTheme();

    const COLORS = theme === 'dark' ? ['#4ade80', '#FBBF24', '#F87171'] : ['#25d366', '#F6E05E', '#F56565'];
    const axisColor = theme === 'dark' ? '#a8a29e' : '#6b7280';
    const gridColor = theme === 'dark' ? 'rgba(168, 162, 158, 0.1)' : '#e5e7eb';
    const tooltipStyle = {
        backgroundColor: 'var(--card-background)',
        border: `1px solid var(--border)`,
        color: 'var(--card-foreground)'
    };
    const legendColor = theme === 'dark' ? '#d6d3d1' : '#374151';

    const translatedPaymentStatusData = useMemo(
        () => paymentStatusData.map(item => ({
            ...item,
            name: t(`reports.${item.name.toLowerCase()}`)
        })),
        [t]
    );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[var(--card-background)] p-6 rounded-lg border border-[var(--border)]">
          <h3 className="text-lg font-semibold mb-4">{t('reports.revenueByMonth')}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="name" stroke={axisColor} tick={{ fill: axisColor }} />
              <YAxis stroke={axisColor} tick={{ fill: axisColor }} />
              <Tooltip contentStyle={tooltipStyle}/>
              <Legend wrapperStyle={{ color: legendColor }}/>
              <Line type="monotone" dataKey="revenue" stroke="var(--primary)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[var(--card-background)] p-6 rounded-lg border border-[var(--border)]">
          <h3 className="text-lg font-semibold mb-4">{t('reports.paymentStatus')}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={translatedPaymentStatusData} cx="50%" cy="50%" labelLine={false} outerRadius={100} fill="#8884d8" dataKey="value" nameKey="name" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {translatedPaymentStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle}/>
              <Legend wrapperStyle={{ color: legendColor }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[var(--card-background)] p-6 rounded-lg border border-[var(--border)]">
          <h3 className="text-lg font-semibold mb-4">{t('reports.agentPerformance')}</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="p-4 font-semibold">{t('reports.agent')}</th>
                  <th className="p-4 font-semibold">{t('reports.handledConversations')}</th>
                  <th className="p-4 font-semibold">{t('reports.avgResponseTime')}</th>
                </tr>
              </thead>
              <tbody>
                {agentPerformanceData.map((agent, index) => (
                  <tr key={index} className="border-b border-[var(--border)] last:border-b-0 hover:bg-[var(--accent)]/50">
                    <td className="p-4 font-semibold">{agent.agent}</td>
                    <td className="p-4">{agent.conversations}</td>
                    <td className="p-4">{agent.avgResponseTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-[var(--card-background)] p-6 rounded-lg border border-[var(--border)] flex flex-col">
            <h3 className="text-lg font-semibold mb-4">{t('reports.onlineOfflineUsers')}</h3>
            <div className="space-y-3 flex-1 overflow-y-auto pr-2 -mr-2">
                {userStatusData.map((user, index) => (
                    <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-[var(--accent)]/80 transition-colors">
                        <div className="flex items-center gap-3">
                            <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                            <div>
                                <p className="font-semibold text-[var(--card-foreground)]">{user.name}</p>
                                <p className="text-sm text-[var(--foreground-muted)]">{user.role}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={`h-2.5 w-2.5 rounded-full ${user.status === 'Online' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></span>
                            <span className={`text-sm font-medium ${user.status === 'Online' ? 'text-green-500' : 'text-gray-500'}`}>
                                {t(`reports.${user.status.toLowerCase()}`)}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>

      </div>
    </div>
  );
};

export default Reports;