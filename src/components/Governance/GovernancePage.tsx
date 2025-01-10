import React from 'react';
import { Vote, Users, BarChart2, FileText, Clock } from 'lucide-react';

const proposals = [
  {
    id: 1,
    title: "Increase AI Optimization Frequency",
    description: "Proposal to increase the frequency of AI optimization runs from 6 hours to 4 hours",
    votes: { for: 67, against: 23, abstain: 10 },
    status: "active",
    endTime: "2d 14h",
  },
  {
    id: 2,
    title: "Add New Mining Algorithm Support",
    description: "Add support for RandomX algorithm with AI optimization",
    votes: { for: 82, against: 12, abstain: 6 },
    status: "passed",
    endTime: "Ended",
  }
];

export function GovernancePage() {
  return (
    <div className="pt-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">DAO Governance</h1>
          <p className="text-gray-400">Participate in decision-making for the future of aiHash</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900/50 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <Vote className="w-5 h-5 text-primary" />
              <h3 className="text-white font-medium">Voting Power</h3>
            </div>
            <p className="text-2xl font-bold text-white">1,234 vHP</p>
            <p className="text-sm text-gray-400">Based on your hash power</p>
          </div>

          <div className="bg-gray-900/50 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-primary" />
              <h3 className="text-white font-medium">Active Voters</h3>
            </div>
            <p className="text-2xl font-bold text-white">3,456</p>
            <p className="text-sm text-gray-400">Last 30 days</p>
          </div>

          <div className="bg-gray-900/50 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <BarChart2 className="w-5 h-5 text-primary" />
              <h3 className="text-white font-medium">Proposals</h3>
            </div>
            <p className="text-2xl font-bold text-white">12</p>
            <p className="text-sm text-gray-400">2 active</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Active Proposals</h2>
            <button className="bg-primary text-background px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors">
              Create Proposal
            </button>
          </div>

          {proposals.map((proposal) => (
            <div key={proposal.id} className="bg-gray-900/50 rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">{proposal.title}</h3>
                  <p className="text-gray-400">{proposal.description}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  proposal.status === 'active' 
                    ? 'bg-green-500/10 text-green-400'
                    : 'bg-blue-500/10 text-blue-400'
                }`}>
                  {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">For</span>
                  <span className="text-white">{proposal.votes.for}%</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-full rounded-full" 
                    style={{ width: `${proposal.votes.for}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Against</span>
                  <span className="text-white">{proposal.votes.against}%</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div 
                    className="bg-red-500 h-full rounded-full" 
                    style={{ width: `${proposal.votes.against}%` }}
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {proposal.status === 'active' && (
                    <>
                      <button className="px-4 py-2 bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500/20 transition-colors">
                        Vote For
                      </button>
                      <button className="px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors">
                        Vote Against
                      </button>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>{proposal.endTime}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}