import React, { useState } from 'react';
import { Send } from 'lucide-react';

export function AboutPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = `mailto:CEO@ai-hash.ai?subject=Contact from ${formData.name}&body=${formData.message}`;
  };

  return (
    <div className="pt-20 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        <h1 className="text-4xl font-bold mb-6">Revolutionizing Crypto Mining with Decentralized AI Precision</h1>
        
        <div className="bg-gray-900/50 rounded-xl p-6 mb-12">
          <p className="text-gray-300 leading-relaxed">
            aiHash combines blockchain technology, tokenized ownership, and AI-powered optimization to redefine cryptocurrency mining. Experience maximum profitability, operational efficiency, and a commitment to sustainability. Our platform ensures that users can participate in a truly decentralized and transparent mining ecosystem. By leveraging cutting-edge AI, we provide tools that optimize every aspect of the mining process while prioritizing environmental sustainability and fairness.
          </p>
        </div>

        <div className="bg-gray-900/50 rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-6">Contact Us</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Name</label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-primary focus:outline-none"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-primary focus:outline-none"
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">Message</label>
              <textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                rows={4}
                className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-primary focus:outline-none"
                required
              />
            </div>
            <button
              type="submit"
              className="flex items-center gap-2 bg-primary text-background px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              <Send className="w-4 h-4" />
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}