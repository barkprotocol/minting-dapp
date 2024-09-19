"use client";

import React from 'react';
import FeatureCard from '@/components/feature-card';
import { FaTwitter, FaDiscord, FaTelegram, FaMedium } from 'react-icons/fa';

const FeatureSection: React.FC = () => {
  return (
    <div className="flex flex-wrap gap-6">
      <FeatureCard
        title="Fast Transactions"
        description="Experience lightning-fast transactions with our optimized blockchain infrastructure."
        icon={<FaTwitter className="text-4xl text-blue-500" />}
      />
      <FeatureCard
        title="Low Fees"
        description="Enjoy minimal fees on all transactions and minting activities."
        icon={<FaDiscord className="text-4xl text-indigo-500" />}
      />
      <FeatureCard
        title="Secure"
        description="Your assets are protected with top-notch security protocols and practices."
        icon={<FaTelegram className="text-4xl text-blue-400" />}
      />
      <FeatureCard
        title="Community Driven"
        description="Be part of a vibrant and supportive community that values creativity and collaboration."
        icon={<FaMedium className="text-4xl text-black" />}
      />
    </div>
  );
};

export default FeatureSection;
