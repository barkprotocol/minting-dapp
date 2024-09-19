import React from 'react';

interface Feature {
  title: string;
  description: string;
  icon: string;
}

const features: Feature[] = [
  {
    title: 'Decentralized Management',
    description: 'Manage your NFTs on a decentralized platform with security and transparency.',
    icon: '/icons/decentralized.svg',
  },
  {
    title: 'Exclusive NFTs',
    description: 'Mint and access exclusive NFTs only available through BARK.',
    icon: '/icons/exclusive.svg',
  },
  {
    title: 'Seamless Integration',
    description: 'Easily integrate with your existing Solana wallet and other tools.',
    icon: '/icons/integration.svg',
  },
];

const FeaturesCard: React.FC = () => {
  return (
    <section className="features-card">
      <h2 className="text-2xl font-bold mb-4">Features</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature) => (
          <div key={feature.title} className="feature-card p-4 border rounded-lg shadow-lg">
            <img src={feature.icon} alt={feature.title} className="w-12 h-12 mb-2" />
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesCard;
