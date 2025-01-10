import React from 'react';
import { Download, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export function WhitePaperPage() {
  const handleDownloadPDF = () => {
    fetch('/whitepaper/aiHash-whitepaper.pdf')
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'aiHash-whitepaper.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      })
      .catch(error => {
        console.error('Error downloading PDF:', error);
        window.location.href = 'mailto:whitepaper@ai-hash.ai?subject=Whitepaper%20Request&body=I%20would%20like%20to%20request%20the%20aiHash%20whitepaper.';
      });
  };

  return (
    <div className="pt-20 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        <div className="mb-8 flex items-center justify-between">
          <Link to="/docs" className="flex items-center gap-2 text-gray-400 hover:text-white">
            <ArrowLeft className="w-4 h-4" />
            Back to Documentation
          </Link>
          <button 
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-lg hover:bg-primary/20 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </button>
        </div>

        <article className="prose prose-invert max-w-none">
          <h1 className="text-4xl font-bold mb-8">White Paper: Decentralized AI-Powered Hashing Marketplace</h1>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">1. Abstract</h2>
            <div className="bg-gray-900/50 p-6 rounded-xl">
              <p>
                This white paper introduces aiHash, a revolutionary platform combining blockchain technology, tokenized ownership, and AI-driven optimization for cryptocurrency mining. Built on Sui network, the platform decentralizes ownership of mining operations through tokenization, allowing investors and miners to participate in a transparent, efficient, and community-driven ecosystem. With integrated AI services, the platform ensures maximum profitability, operational efficiency, and scalability.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">2. Introduction</h2>
            <p>
              The cryptocurrency mining industry is facing challenges such as rising energy costs, centralized control, and inefficient resource allocation. While platforms like NiceHash provide marketplaces for hashing power, they lack transparency, decentralization, and advanced optimization.
            </p>
            <p className="mt-4">This project disrupts existing models by:</p>
            <ul className="list-disc pl-6 mt-2">
              <li>Tokenizing mining operations for decentralized ownership and governance.</li>
              <li>Offering an AI-powered marketplace for hashing power.</li>
              <li>Providing AI-driven services for optimizing mining profitability and efficiency.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">3. Vision and Mission</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-900/50 p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-2">Vision</h3>
                <p>To become the leading decentralized platform for hashing power and AI optimization, democratizing access to mining operations.</p>
              </div>
              <div className="bg-gray-900/50 p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-2">Mission</h3>
                <p>To empower miners, investors, and developers through transparency, efficiency, and cutting-edge technology.</p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">4. Key Features</h2>
            <div className="space-y-4">
              <div className="bg-gray-900/50 p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-2">Tokenized Ownership</h3>
                <ul className="list-disc pl-6">
                  <li>Mining operations fractionalized into blockchain-based tokens.</li>
                  <li>Token holders receive proportional mining rewards.</li>
                  <li>Smart contracts ensure transparency and equitable distribution.</li>
                </ul>
              </div>
              <div className="bg-gray-900/50 p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-2">AI-Powered Optimization</h3>
                <ul className="list-disc pl-6">
                  <li>Real-time profitability analysis and algorithm switching.</li>
                  <li>Predictive maintenance to minimize downtime.</li>
                  <li>Energy and performance monitoring for efficiency.</li>
                </ul>
              </div>
              <div className="bg-gray-900/50 p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-2">Decentralized Marketplace</h3>
                <ul className="list-disc pl-6">
                  <li>Flexible trading of hashing power: buy, sell, or lease.</li>
                  <li>Cryptocurrency-based payment options.</li>
                  <li>Governed by DAO mechanisms for transparency.</li>
                </ul>
              </div>
              <div className="bg-gray-900/50 p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-2">Low Transaction Costs</h3>
                <p>Integration with Sui ensures fast and cost-efficient transactions.</p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">5. Technology Stack</h2>
            <div className="space-y-4">
              <div className="bg-gray-900/50 p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-2">Blockchain Layer</h3>
                <p>Sui Network: Tokenization and decentralized governance.</p>
              </div>
              <div className="bg-gray-900/50 p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-2">AI Layer</h3>
                <ul className="list-disc pl-6">
                  <li>Machine learning for profitability optimization.</li>
                  <li>Predictive analytics for hardware maintenance.</li>
                  <li>Real-time dashboards for actionable insights.</li>
                </ul>
              </div>
              <div className="bg-gray-900/50 p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-2">Smart Contracts</h3>
                <ul className="list-disc pl-6">
                  <li>Automated profit distribution.</li>
                  <li>Token staking and reward mechanisms.</li>
                  <li>Governance voting for decentralized decision-making.</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">6. Tokenomics</h2>
            <div className="space-y-4">
              <div className="bg-gray-900/50 p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-2">Token Distribution</h3>
                <ul className="list-disc pl-6">
                  <li>40% - Mining Pool Rewards</li>
                  <li>20% - Development Fund</li>
                  <li>15% - Community Treasury</li>
                  <li>15% - Team and Advisors (vested)</li>
                  <li>10% - Initial DEX Offering</li>
                </ul>
              </div>
              <div className="bg-gray-900/50 p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-2">Token Utility</h3>
                <ul className="list-disc pl-6">
                  <li>Governance rights in the DAO</li>
                  <li>Access to premium AI optimization features</li>
                  <li>Revenue sharing from platform fees</li>
                  <li>Staking rewards and incentives</li>
                </ul>
              </div>
              <div className="bg-gray-900/50 p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-2">Economic Model</h3>
                <ul className="list-disc pl-6">
                  <li>Deflationary Mechanisms: Platform fees burned periodically.</li>
                  <li>Liquidity Incentives: Reward early adopters and token holders.</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">7. Revenue Model</h2>
            <div className="space-y-4">
              <div className="bg-gray-900/50 p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-2">Marketplace Fees</h3>
                <p>Small percentage from hashing power transactions</p>
              </div>
              <div className="bg-gray-900/50 p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-2">AI Services</h3>
                <p>Subscription fees for AI tools</p>
              </div>
              <div className="bg-gray-900/50 p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-2">Token Appreciation</h3>
                <p>Token value grows with platform adoption</p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">8. AI Optimization</h2>
            <div className="bg-gray-900/50 p-6 rounded-xl">
              <p className="mb-4">The AI optimization engine is the core differentiator of aiHash, providing:</p>
              <ul className="list-disc pl-6">
                <li>Real-time performance optimization</li>
                <li>Predictive maintenance</li>
                <li>Dynamic power management</li>
                <li>Automated algorithm switching</li>
                <li>Market-driven resource allocation</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">9. Governance</h2>
            <div className="bg-gray-900/50 p-6 rounded-xl">
              <p className="mb-4">aiHash implements a decentralized autonomous organization (DAO) structure where token holders can:</p>
              <ul className="list-disc pl-6">
                <li>Vote on protocol upgrades</li>
                <li>Propose new features</li>
                <li>Manage treasury allocations</li>
                <li>Set platform parameters</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">10. Roadmap</h2>
            <div className="space-y-4">
              <div className="bg-gray-900/50 p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-2">Phase 1: Conceptualization (months 1 to 3)</h3>
                <ul className="list-disc pl-6">
                  <li>Draft whitepaper and business model</li>
                  <li>Onboard advisors, technical experts and development team</li>
                </ul>
              </div>
              <div className="bg-gray-900/50 p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-2">Phase 2: Launch (months 4 to 9)</h3>
                <ul className="list-disc pl-6">
                  <li>Token launch in SuAI launchpad</li>
                  <li>Marketplace concept web development</li>
                </ul>
              </div>
              <div className="bg-gray-900/50 p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-2">Phase 3: Platform Development (months 9 to 18)</h3>
                <ul className="list-disc pl-6">
                  <li>Develop Sui infrastructure</li>
                  <li>Develop Advanced AI agents features</li>
                  <li>Mobile app release</li>
                  <li>Strategic partnerships</li>
                </ul>
              </div>
              <div className="bg-gray-900/50 p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-2">Phase 4: Launch pilot miners (months 18 to 24)</h3>
                <ul className="list-disc pl-6">
                  <li>Acquire partnership for Bitmain mining rigs</li>
                  <li>Test and refine AI algorithms</li>
                </ul>
              </div>
              <div className="bg-gray-900/50 p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-2">Phase 5: Scaling and Decentralization (months 25+)</h3>
                <ul className="list-disc pl-6">
                  <li>Transition governance to DAO</li>
                  <li>Expand AI services and integrate miners</li>
                  <li>Final release</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">11. Conclusion</h2>
            <div className="bg-gray-900/50 p-6 rounded-xl">
              <p>
                aiHash represents a paradigm shift in cryptocurrency mining, combining AI optimization, decentralized ownership, and sustainable practices. By democratizing access to mining operations and leveraging cutting-edge technology, aiHash aims to create a more efficient, accessible, and environmentally conscious mining ecosystem.
              </p>
            </div>
          </section>
        </article>
      </div>
    </div>
  );
}