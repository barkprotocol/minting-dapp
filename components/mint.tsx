"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWallet } from "@solana/wallet-adapter-react";
import { Transaction, SystemProgram, Connection, PublicKey } from "@solana/web3.js";
import { Metaplex } from "@metaplex-foundation/js";
import { useState } from "react";
import {
  XMarkIcon as XIcon,
  GlobeAltIcon as MediumIcon,
  TwitterIcon,
  GlobeIcon as DiscordIcon,
  GithubIcon as GitHubIcon,
  InstagramIcon,
  PaperAirplaneIcon as TelegramIcon,
} from "@heroicons/react/24/solid";

// Function to get the appropriate Solana network URL
const getSolanaNetwork = () => {
  const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet'; // Default to 'devnet'
  const networkUrls = {
    mainnet: 'https://api.mainnet-beta.solana.com',
    testnet: 'https://api.testnet.solana.com',
    devnet: 'https://api.devnet.solana.com',
  };
  return networkUrls[network] || networkUrls.devnet;
};

export default function MintNFTComponent() {
  const connection = new Connection(getSolanaNetwork());
  const { publicKey, sendTransaction, connect, disconnect, connected } = useWallet();
  const [nftName, setNftName] = useState("");
  const [metadataUri, setMetadataUri] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize Metaplex instance
  const metaplex = new Metaplex(connection);

  const handleMintNFT = async () => {
    if (!publicKey) {
      setError("Wallet not connected!");
      return;
    }

    if (!nftName || !metadataUri) {
      setError("Please fill out all fields.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Create the NFT using Metaplex
      const { uri } = await metaplex.nfts().create({
        name: nftName,
        uri: metadataUri,
        sellerFeeBasisPoints: 500, // 5% royalty
        creators: [
          {
            address: publicKey.toBase58(),
            verified: true,
            share: 100,
          },
        ],
      });

      // Construct the transaction
      const mintTransaction = new Transaction();
      // Replace with actual mint public key if available
      const mintPublicKey = new PublicKey(uri); 

      mintTransaction.add(
        SystemProgram.createAccount({
          fromPubkey: publicKey,
          newAccountPubkey: mintPublicKey,
          lamports: await connection.getMinimumBalanceForRentExemption(mintTransaction.data.length),
          space: mintTransaction.data.length,
          programId: mintPublicKey,
        })
      );

      const signature = await sendTransaction(mintTransaction, connection);
      await connection.confirmTransaction(signature, "confirmed");
      console.log("NFT Minted: ", signature);
    } catch (error) {
      setError("Failed to mint NFT. Please try again.");
      console.error("Failed to mint NFT", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = async () => {
    try {
      await connect();
    } catch (error) {
      console.error("Failed to connect wallet", error);
      setError("Failed to connect wallet.");
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
    } catch (error) {
      console.error("Failed to disconnect wallet", error);
      setError("Failed to disconnect wallet.");
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white flex flex-col">
      <header className="bg-black shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-white flex items-center">
            <img 
              src="https://ucarecdn.com/f242e5dc-8813-47b4-af80-6e6dd43945a9/barkicon.png" 
              alt="Logo" 
              className="h-8 w-auto" 
            />
            <span className="ml-4">NFT Minter</span>
          </div>
          <div className="hidden md:flex space-x-8">
            <a href="#" className="text-gray-300 hover:text-white">Home</a>
            <a href="#" className="text-gray-300 hover:text-white">About</a>
            <a href="#" className="text-gray-300 hover:text-white">Services</a>
            <a href="#" className="text-gray-300 hover:text-white">FAQ</a>
          </div>
          <div className="relative">
            {!connected ? (
              <Button onClick={handleConnect} className="bg-gray-800 text-white p-2 rounded-lg">
                Connect Wallet
              </Button>
            ) : (
              <Button onClick={handleDisconnect} className="bg-gray-800 text-white p-2 rounded-lg">
                Disconnect Wallet
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="py-16 flex-grow">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-extrabold text-white mb-4">
            Mint Your <span className="text-[#CBB5A7]">Exclusive NFT</span>
          </h1>
          <p className="text-lg text-gray-400 mb-10">
            Enter your NFT details to mint an NFT on the Solana blockchain.
          </p>

          <div className="bg-gray-800 rounded-lg shadow-lg p-8 max-w-3xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                type="text"
                placeholder="NFT Name"
                value={nftName}
                onChange={(e) => setNftName(e.target.value)}
                className="w-full border border-gray-700 rounded-lg p-2 bg-gray-900 text-white placeholder-gray-600"
              />
              <Input
                type="text"
                placeholder="Metadata URI"
                value={metadataUri}
                onChange={(e) => setMetadataUri(e.target.value)}
                className="w-full border border-gray-700 rounded-lg p-2 bg-gray-900 text-white placeholder-gray-600"
              />
            </div>
            {error && <p className="text-red-500 mt-4">{error}</p>}
            <div className="mt-6">
              <Button 
                onClick={handleMintNFT} 
                className={`w-full p-4 rounded-lg ${isLoading ? 'bg-gray-400' : 'bg-white text-gray-900'}`} 
                disabled={isLoading}
              >
                {isLoading ? 'Minting...' : 'Mint NFT'}
              </Button>
            </div>
          </div>

          <div className="mt-16">
            <h2 className="text-3xl font-bold mb-6 text-white">Recently Minted NFTs</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Example NFT Cards */}
              <div className="bg-gray-800 rounded-lg shadow-lg p-4">
                <img src="https://ucarecdn.com/9d42462f-cd40-40ac-a218-00932eaae06a/donation_sol.png" alt="NFT Example" className="rounded-t-lg" />
                <div className="p-4">
                  <h3 className="text-lg font-bold text-white">NFT Name 1</h3>
                  <p className="text-gray-400">Metadata: Description here</p>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg shadow-lg p-4">
                <img src="https://ucarecdn.com/9d42462f-cd40-40ac-a218-00932eaae06a/donation_sol.png" alt="NFT Example" className="rounded-t-lg" />
                <div className="p-4">
                  <h3 className="text-lg font-bold text-white">NFT Name 2</h3>
                  <p className="text-gray-400">Metadata: Description here</p>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg shadow-lg p-4">
                <img src="https://ucarecdn.com/9d42462f-cd40-40ac-a218-00932eaae06a/donation_sol.png" alt="NFT Example" className="rounded-t-lg" />
                <div className="p-4">
                  <h3 className="text-lg font-bold text-white">NFT Name 3</h3>
                  <p className="text-gray-400">Metadata: Description here</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-black text-gray-400 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between">
          <div>
            <p className="text-sm">© 2024 BARK Protocol. All rights reserved.</p>
          </div>
          <div className="flex space-x-6">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <TwitterIcon className="h-6 w-6 text-gray-300 hover:text-white" />
            </a>
            <a href="https://discord.com" target="_blank" rel="noopener noreferrer">
              <DiscordIcon className="h-6 w-6 text-gray-300 hover:text-white" />
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
              <GitHubIcon className="h-6 w-6 text-gray-300 hover:text-white" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <InstagramIcon className="h-6 w-6 text-gray-300 hover:text-white" />
            </a>
            <a href="https://telegram.org" target="_blank" rel="noopener noreferrer">
              <TelegramIcon className="h-6 w-6 text-gray-300 hover:text-white" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
