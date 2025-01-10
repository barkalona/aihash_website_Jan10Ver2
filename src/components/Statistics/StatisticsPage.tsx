import React, { useState } from 'react';
import { BarChart2, TrendingUp, Clock, Users, Cpu, Leaf, Zap, Brain } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const hashingData = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  hashRate: 8000 + Math.random() * 4000,
  efficiency: 85 + Math.random() * 15
}));

const metrics = [
  {
    label: "Total Hash Power",
    value: "12.5 EH/s",
    change: "+8.2%",
    icon: Cpu
  },
  {
    label: "Active Miners",
    value: "2,345",
    change: "+12.3%",
    icon: Users
  },
  {
    label: "AI Efficiency",
    value: "94.2%",
    change: "+2.3%",
    icon: Brain
  },
  {
    label: "Energy Savings",
    value: "15.4%",
    change: "+2.1%",
    icon: Leaf
  }
];

const timeframes = ['24H', '7D', '30D', '90D', 'ALL'];

export function StatisticsPage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('24H');

  return (
    <div className="pt-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Network Statistics</h1>
          <p className="text-gray-400">Real-time analytics and performance metrics</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric) => (
            <div key={metric.label} className="bg-gray-900/50 rounded-xl p-4 hover:bg-gray-900/70 transition-all duration-300">
              <div className="flex items-center gap-3 mb-3">
                <metric.icon className="w-5 h-5 text-primary" />
                <h3 className="text-gray-400">{metric.label}</h3>
              </div>
              <div className="flex items-end justify-between">
                <p className="text-2xl font-bold text-white">{metric.value}</p>
                <span className="text-green-400 text-sm">{metric.change}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Hash Power Distribution */}
          <div className="bg-gray-900/50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium text-white">Hash Power Distribution</h2>
              <div className="flex gap-2">
                {timeframes.map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setSelectedTimeframe(tf)}
                    className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                      selectedTimeframe === tf 
                        ? 'bg-primary text-background' 
                        : 'hover:bg-gray-800 text-gray-400 hover:text-white'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={hashingData}>
                  <defs>
                    <linearGradient id="hashRate" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00FF9D" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#00FF9D" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" />
                  <XAxis dataKey="time" stroke="#718096" />
                  <YAxis stroke="#718096" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1A202C',
                      border: 'none',
                      borderRadius: '0.5rem',
                      color: '#fff'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="hashRate" 
                    stroke="#00FF9D" 
                    fillOpacity={1} 
                    fill="url(#hashRate)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Optimization Impact */}
          <div className="bg-gray-900/50 rounded-xl p-6">
            <h2 className="text-lg font-medium text-white mb-6">AI Optimization Impact</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hashingData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" />
                  <XAxis dataKey="time" stroke="#718096" />
                  <YAxis stroke="#718096" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1A202C',
                      border: 'none',
                      borderRadius: '0.5rem',
                      color: '#fff'
                    }}
                  />
                  <Bar 
                    dataKey="efficiency" 
                    fill="#00FF9D" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Network Health */}
          <div className="bg-gray-900/50 rounded-xl p-6">
            <h2 className="text-lg font-medium text-white mb-6">Network Health</h2>
            <div className="space-y-4">
              {[
                { label: "Network Uptime", value: "99.99%", subtext: "Last 30 days" },
                { label: "Average Block Time", value: "9.82s", subtext: "Target: 10s" },
                { label: "Active Nodes", value: "1,234", subtext: "+123 this week" },
                { label: "Network Difficulty", value: "12.5T", subtext: "+2.3% 24h" }
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors">
                  <div>
                    <div className="text-white">{item.label}</div>
                    <div className="text-sm text-gray-400">{item.subtext}</div>
                  </div>
                  <div className="text-xl font-medium text-white">{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-gray-900/50 rounded-xl p-6">
            <h2 className="text-lg font-medium text-white mb-6">Recent Activity</h2>
            <div className="space-y-4">
              {[
                { event: "New Miner Joined", time: "2m ago", value: "+125 TH/s" },
                { event: "AI Optimization Run", time: "15m ago", value: "+2.3% efficiency" },
                { event: "Hash Power Trade", time: "1h ago", value: "234 TH/s" },
                { event: "Network Upgrade", time: "3h ago", value: "v2.1.0" }
              ].map((activity, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors">
                  <div>
                    <div className="text-white">{activity.event}</div>
                    <div className="text-sm text-gray-400">{activity.time}</div>
                  </div>
                  <div className="text-primary">{activity.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}