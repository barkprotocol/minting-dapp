import { useState } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useTheme } from '@/context/theme-context';
import { Button } from '@/components/ui/button';

const ConnectWalletButton = () => {
  const { isDarkMode } = useTheme();
  const [showWalletOptions, setShowWalletOptions] = useState(false);

  const toggleWalletOptions = () => setShowWalletOptions(prev => !prev);

  return (
    <div className="relative">
      <Button
        onClick={toggleWalletOptions}
        className={`p-2 rounded-lg flex items-center bg-${isDarkMode ? 'gray-800' : 'gray-100'} text-${isDarkMode ? 'white' : 'black'}`}
        aria-haspopup="true"
        aria-expanded={showWalletOptions}
      >
        <span className="ml-2">Select Wallet</span>
      </Button>
      {showWalletOptions && (
        <div
          className={`absolute top-12 right-0 bg-${isDarkMode ? 'gray-800' : 'white'} text-${isDarkMode ? 'white' : 'black'} rounded-lg shadow-lg p-2 z-50`}
          aria-label="Wallet Options"
        >
          <WalletMultiButton className="wallet-adapter-button-trigger" />
        </div>
      )}
    </div>
  );
};

export default ConnectWalletButton;
