import React from 'react';
import { Shield, Zap, BarChart3 } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Secure & Trustless',
    description: 'Smart contracts ensure safe and transparent transactions without intermediaries.'
  },
  {
    icon: Zap,
    title: 'Instant Settlement',
    description: 'Real-time hash power delivery and automatic payment processing.'
  },
  {
    icon: BarChart3,
    title: 'Market Analytics',
    description: 'Advanced tools to track market trends and optimize your trading strategy.'
  }
];

export function Features() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group p-8 rounded-2xl bg-gray-900/50 hover:bg-gray-900 transition-all duration-300 transform hover:-translate-y-1"
            >
              <feature.icon 
                className="w-12 h-12 text-[#00FF9D] mb-6 transform group-hover:scale-110 transition-transform duration-300" 
              />
              <h3 className="text-xl font-bold mb-4 text-white">
                {feature.title}
              </h3>
              <p className="text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}