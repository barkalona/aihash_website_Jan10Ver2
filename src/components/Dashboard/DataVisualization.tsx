import React, { useState, useEffect } from 'react';
import { Download, AlertCircle } from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, ScatterChart, Scatter, LineChart, Line
} from 'recharts';

// Mock data generators
const generateTimeSeriesData = (points: number) => {
  return Array.from({ length: points }, (_, i) => ({
    time: `${i}:00`,
    hashrate: 150 + Math.random() * 50,
    earnings: 0.001 + Math.random() * 0.0005,
    aiHashEarnings: 10 + Math.random() * 5,
    power: 2.5 + Math.random() * 0.5,
    efficiency: 85 + Math.random() * 15
  }));
};

const hourlyData = generateTimeSeriesData(24);
const weeklyData = generateTimeSeriesData(7);

export function DataVisualization() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h');
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time updates
      if (isLive) {
        const newData = {
          time: new Date().toLocaleTimeString(),
          hashrate: 150 + Math.random() * 50,
          earnings: 0.001 + Math.random() * 0.0005,
          aiHashEarnings: 10 + Math.random() * 5,
          power: 2.5 + Math.random() * 0.5,
          efficiency: 85 + Math.random() * 15
        };
        // Update data here
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isLive]);

  const handleExport = () => {
    const data = JSON.stringify(hourlyData);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mining-data.json';
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <select 
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="bg-gray-800 text-white rounded-lg px-4 py-2"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
          <button 
            onClick={() => setIsLive(!isLive)}
            className={`px-4 py-2 rounded-lg ${
              isLive ? 'bg-green-500/10 text-green-400' : 'bg-gray-700 text-gray-300'
            }`}
          >
            {isLive ? 'Live Updates' : 'Paused'}
          </button>
        </div>
        <button 
          onClick={handleExport}
          className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
        >
          <Download className="w-4 h-4" />
          Export Data
        </button>
      </div>

      {/* Primary Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hashrate Trend */}
        <div className="bg-gray-900/50 rounded-xl p-6">
          <h3 className="text-lg font-medium text-white mb-4">Hashrate Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyData}>
                <defs>
                  <linearGradient id="hashrate" x1="0" y1="0" x2="0" y2="1">
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
                  dataKey="hashrate" 
                  stroke="#00FF9D" 
                  fill="url(#hashrate)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Earnings Distribution */}
        <div className="bg-gray-900/50 rounded-xl p-6">
          <h3 className="text-lg font-medium text-white mb-4">Daily Earnings</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyData}>
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
                <Bar dataKey="earnings" name="SUI" fill="#2D7FF9" />
                <Bar dataKey="aiHashEarnings" name="aiHash" fill="#00FF9D" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Power Efficiency */}
        <div className="bg-gray-900/50 rounded-xl p-6">
          <h3 className="text-lg font-medium text-white mb-4">Power Efficiency</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" />
                <XAxis type="number" dataKey="power" name="Power (kW)" stroke="#718096" />
                <YAxis type="number" dataKey="efficiency" name="Efficiency (%)" stroke="#718096" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1A202C',
                    border: 'none',
                    borderRadius: '0.5rem',
                    color: '#fff'
                  }}
                />
                <Scatter name="Efficiency" data={hourlyData} fill="#00FF9D" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* System Health */}
        <div className="bg-gray-900/50 rounded-xl p-6">
          <h3 className="text-lg font-medium text-white mb-4">System Health</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { name: 'Rig 1', temp: 65, status: 'optimal' },
              { name: 'Rig 2', temp: 72, status: 'warning' },
              { name: 'Network', value: '98%', status: 'optimal' },
              { name: 'GPU Util', value: '95%', status: 'optimal' }
            ].map((item) => (
              <div 
                key={item.name}
                className={`p-4 rounded-lg ${
                  item.status === 'optimal' ? 'bg-green-500/10' : 'bg-yellow-500/10'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400">{item.name}</span>
                  {item.status === 'warning' && (
                    <AlertCircle className="w-4 h-4 text-yellow-400" />
                  )}
                </div>
                <div className={`text-lg font-medium ${
                  item.status === 'optimal' ? 'text-green-400' : 'text-yellow-400'
                }`}>
                  {item.temp ? `${item.temp}°C` : item.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}