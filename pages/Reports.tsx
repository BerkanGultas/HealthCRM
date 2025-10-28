import React from 'react';
import { useLanguage } from '../hooks/useLanguage';
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

const COLORS = ['#25d366', '#F6E05E', '#F56565'];

const agentPerformanceData = [
    { agent: 'John Smith', conversations: 120, avgResponseTime: 5 },
    { agent: 'Emily White', conversations: 150, avgResponseTime: 3 },
    { agent: 'Michael Brown', conversations: 95, avgResponseTime: 7 },
    { agent: 'Jessica Green', conversations: 130, avgResponseTime: 4 },
];

const Reports: React.FC = () => {
    const { t } = useLanguage();
    
    paymentStatusData[0].name = t('reports.completed');
    paymentStatusData[1].name = t('reports.pending');
    paymentStatusData[2].name = t('reports.cancelled');

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">{t('reports.revenueByMonth')}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}/>
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#128c7e" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">{t('reports.paymentStatus')}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={paymentStatusData} cx="50%" cy="50%" labelLine={false} outerRadius={100} fill="#8884d8" dataKey="value" nameKey="name" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {paymentStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}/>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">{t('reports.agentPerformance')}</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="p-4 font-semibold">{t('reports.agent')}</th>
                <th className="p-4 font-semibold">{t('reports.handledConversations')}</th>
                <th className="p-4 font-semibold">{t('reports.avgResponseTime')}</th>
              </tr>
            </thead>
            <tbody>
              {agentPerformanceData.map((agent, index) => (
                <tr key={index} className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50">
                  <td className="p-4 font-semibold">{agent.agent}</td>
                  <td className="p-4">{agent.conversations}</td>
                  <td className="p-4">{agent.avgResponseTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;