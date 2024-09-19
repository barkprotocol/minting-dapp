"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Transaction, SystemProgram, Connection, PublicKey } from "@solana/web3.js";
import { Metaplex } from "@metaplex-foundation/js";
import { Coins, ShieldCheck, Zap, Image } from 'lucide-react';
import { cn } from "@/lib/utils";
import Link from 'next/link';

const getSolanaNetwork = () => {
  const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet';
  const networkUrls = {
    mainnet: 'https://api.mainnet-beta.solana.com',
    testnet: 'https://api.testnet.solana.com',
    devnet: 'https://api.devnet.solana.com',
  };
  return networkUrls[network] || networkUrls.devnet;
};

const isValidUrl = (string: string) => {
  try {
    new URL(string);
    return true;
  } catch {
    return false;
  }
};

export default function MintNFTComponent() {
  const connection = new Connection(getSolanaNetwork());
  const { publicKey, sendTransaction, connected, connect, disconnect } = useWallet();
  const [nftName, setNftName] = useState("");
  const [metadataUri, setMetadataUri] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [mintedNfts, setMintedNfts] = useState<Array<{ name: string; imageUrl: string; metadata: string }>>([]);

  const metaplex = new Metaplex(connection);

  useEffect(() => {
    if (connected) {
      setError(undefined);
      fetchMintedNfts();
    }
  }, [connected]);

  const fetchMintedNfts = async () => {
    try {
      // Replace with real data fetching
      const mockNfts = [
        { name: "BNFT 1", imageUrl: "https://ucarecdn.com/2138a07e-c7e0-4482-820e-105a49d39ede/donation_bark.png", metadata: "metadata1" },
        { name: "BNFT 2", imageUrl: "https://ucarecdn.com/2138a07e-c7e0-4482-820e-105a49d39ede/donation_bark.png", metadata: "metadata2" },
        { name: "BNFT 3", imageUrl: "https://ucarecdn.com/2138a07e-c7e0-4482-820e-105a49d39ede/donation_bark.png", metadata: "metadata3" },
      ];
      setMintedNfts(mockNfts);
    } catch (error) {
      setError("Failed to fetch minted NFTs.");
      console.error("Failed to fetch minted NFTs", error);
    }
  };

  const handleMintNFT = async () => {
    if (!publicKey) {
      setError("Wallet not connected!");
      return;
    }

    if (!nftName.trim()) {
      setError("Please enter a valid NFT name.");
      return;
    }

    if (!metadataUri.trim() || !isValidUrl(metadataUri)) {
      setError("Please enter a valid metadata URI.");
      return;
    }

    setIsLoading(true);
    setError(undefined);

    try {
      const { uri } = await metaplex.nfts().create({
        name: nftName,
        uri: metadataUri,
        sellerFeeBasisPoints: 500,
        creators: [
          {
            address: publicKey.toBase58(),
            verified: true,
            share: 100,
          },
        ],
      });

      const mintPublicKey = new PublicKey(uri);
      const mintTransaction = new Transaction();

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

      await fetchMintedNfts();
      console.log("BARK CNFT Minted: ", signature);
    } catch (error) {
      setError(`Failed to mint NFT: ${error.message}`);
      console.error("Failed to mint NFT", error);
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    { title: "Easy Minting", description: "Create NFTs with just a few clicks", icon: <Image size={48} /> },
    { title: "Low Fees", description: "Benefit from Solana's low transaction costs", icon: <Coins size={48} /> },
    { title: "Fast Transactions", description: "Instant minting and trading", icon: <Zap size={48} /> },
    { title: "Secure Storage", description: "Your NFTs are safely stored on the blockchain", icon: <ShieldCheck size={48} /> },
  ];

  return (
    <div className="bg-gray-900 min-h-screen text-white flex flex-col">
      <header className="bg-gray-900 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-white flex items-center">
            <img
              src="https://ucarecdn.com/f242e5dc-8813-47b4-af80-6e6dd43945a9/barkicon.png"
              alt="Logo"
              className="h-7 w-auto"
            />
            <span className="ml-4">BARK NFT Minter</span>
          </div>
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-300 hover:text-white">Home</Link>
            <Link href="/about" className="text-gray-300 hover:text-white">About</Link>
            <Link href="/services" className="text-gray-300 hover:text-white">Services</Link>
            <Link href="/faq" className="text-gray-300 hover:text-white">FAQ</Link>
          </nav>
          <div className="flex items-center space-x-4">
            {connected ? (
              <Button
                onClick={disconnect}
                className="bg-gray-100 text-gray-900 border border-gray-200 hover:bg-gray-200"
              >
                Disconnect Wallet
              </Button>
            ) : (
              <Button
                onClick={() => connect()}
                className="bg-gray-100 text-gray-900 border border-gray-200 hover:bg-gray-200"
              >
                Connect Wallet
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
          <p className="text-lg text-gray-300 mb-10">
            Enter your NFT details to mint an NFT on the Solana blockchain.
          </p>

          <div className="bg-gray-800 rounded-lg shadow-lg p-8 max-w-3xl mx-auto mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                type="text"
                placeholder="NFT Name"
                value={nftName}
                onChange={(e) => setNftName(e.target.value)}
                className="bg-gray-800 text-white border border-gray-500 placeholder-gray-400"
              />
              <Input
                type="text"
                placeholder="Metadata URI"
                value={metadataUri}
                onChange={(e) => setMetadataUri(e.target.value)}
                className="bg-gray-800 text-white border border-gray-500 placeholder-gray-400"
              />
            </div>
            <Button
              onClick={handleMintNFT}
              disabled={isLoading || !connected}
              className={cn(
                "bg-white text-black hover:bg-gray-1000 rounded-sm py-4 text-xl font-medium w-full mt-6 transition-all",
                (isLoading || !connected) && "opacity-50 cursor-not-allowed"
              )}
            >
              {isLoading ? "Minting..." : connected ? "Mint NFT" : "Connect Wallet"}
            </Button>
            {error && <p className="text-red-500 mt-4">{error}</p>}
          </div>
        </section>

        <section className="bg-gray-900 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Minted NFTs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {mintedNfts.length > 0 ? (
                mintedNfts.map((nft, index) => (
                  <div key={index} className="bg-gray-800 p-6 rounded-lg shadow-lg">
                    <img src={nft.imageUrl} alt={nft.name} className="w-full h-32 object-cover rounded-t-sm mb-4" />
                    <h3 className="text-lg font-semibold mb-2">{nft.name}</h3>
                    <p className="text-gray-400">{nft.metadata}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">No NFTs minted yet.</p>
              )}
            </div>
          </div>
        </section>

        <section className="bg-gray-900 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
                  <div className="text-4xl mb-4 text-[#CBB5A7]">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400">
          <p>&copy; 2024 BARK Protocol. All rights reserved.</p>
          <div className="mt-4">
            <Link href="/terms" className="text-gray-500 hover:text-white">Terms of Use</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
