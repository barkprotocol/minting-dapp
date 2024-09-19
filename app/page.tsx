'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useWallet } from "@solana/wallet-adapter-react"
import { Transaction, SystemProgram, Connection, PublicKey } from "@solana/web3.js"
import { Metaplex } from "@metaplex-foundation/js"
import { useState, useEffect } from "react"
import { FaTwitter, FaDiscord, FaTelegram, FaMedium } from "react-icons/fa"
import { cn } from "@/lib/utils"

// Function to get the appropriate Solana network URL
const getSolanaNetwork = () => {
  const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet'
  const networkUrls = {
    mainnet: 'https://api.mainnet-beta.solana.com',
    testnet: 'https://api.testnet.solana.com',
    devnet: 'https://api.devnet.solana.com',
  }
  return networkUrls[network] || networkUrls.devnet
}

// Helper function to validate URL
const isValidUrl = (string: string) => {
  try {
    new URL(string)
    return true
  } catch (_) {
    return false
  }
}

export default function MintNFTComponent() {
  const connection = new Connection(getSolanaNetwork())
  const { publicKey, sendTransaction, connect, disconnect, connected } = useWallet()
  const [nftName, setNftName] = useState("")
  const [metadataUri, setMetadataUri] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | undefined>(undefined)
  const [mintedNfts, setMintedNfts] = useState<Array<{ name: string; imageUrl: string; metadata: string }>>([])

  // Initialize Metaplex instance
  const metaplex = new Metaplex(connection)

  useEffect(() => {
    if (connected) {
      setError(undefined)
      fetchMintedNfts()
    }
  }, [connected])

  // Fetch recently minted NFTs (placeholder implementation)
  const fetchMintedNfts = async () => {
    try {
      // This is a placeholder. Replace with actual API call or Metaplex method
      const mockNfts = [
        { name: "NFT 1", imageUrl: "https://placeholder.com/150", metadata: "metadata1" },
        { name: "NFT 2", imageUrl: "https://placeholder.com/150", metadata: "metadata2" },
        { name: "NFT 3", imageUrl: "https://placeholder.com/150", metadata: "metadata3" },
      ]
      setMintedNfts(mockNfts)
    } catch (error) {
      console.error("Failed to fetch minted NFTs", error)
    }
  }

  const handleMintNFT = async () => {
    if (!publicKey) {
      setError("Wallet not connected!")
      return
    }

    if (!nftName.trim()) {
      setError("Please enter a valid NFT name.")
      return
    }

    if (!metadataUri.trim() || !isValidUrl(metadataUri)) {
      setError("Please enter a valid metadata URI.")
      return
    }

    setIsLoading(true)
    setError(undefined)

    try {
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
      })

      // Handle NFT minting process
      const mintTransaction = new Transaction()
      const mintPublicKey = new PublicKey(uri) // Replace with actual mint public key

      mintTransaction.add(
        SystemProgram.createAccount({
          fromPubkey: publicKey,
          newAccountPubkey: mintPublicKey,
          lamports: await connection.getMinimumBalanceForRentExemption(mintTransaction.data.length),
          space: mintTransaction.data.length,
          programId: mintPublicKey,
        })
      )

      const signature = await sendTransaction(mintTransaction, connection)
      await connection.confirmTransaction(signature, "confirmed")

      await fetchMintedNfts()
      
      console.log("NFT Minted: ", signature)
    } catch (error) {
      setError(`Failed to mint NFT: ${error.message}`)
      console.error("Failed to mint NFT", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleConnect = async () => {
    try {
      await connect()
    } catch (error) {
      console.error("Failed to connect wallet", error)
      setError(`Failed to connect wallet: ${error.message}`)
    }
  }

  const handleDisconnect = async () => {
    try {
      await disconnect()
    } catch (error) {
      console.error("Failed to disconnect wallet", error)
      setError(`Failed to disconnect wallet: ${error.message}`)
    }
  }

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
          <nav className="hidden md:flex space-x-8">
            <a href="#" className="text-gray-300 hover:text-white">Home</a>
            <a href="/pages/about" className="text-gray-300 hover:text-white">About</a>
            <a href="/pages/services" className="text-gray-300 hover:text-white">Services</a>
            <a href="/pages/faq" className="text-gray-300 hover:text-white">FAQ</a>
          </nav>
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
                aria-label="NFT Name"
              />
              <Input
                type="text"
                placeholder="Metadata URI"
                value={metadataUri}
                onChange={(e) => setMetadataUri(e.target.value)}
                className="w-full border border-gray-700 rounded-lg p-2 bg-gray-900 text-white placeholder-gray-600"
                aria-label="Metadata URI"
              />
            </div>
            {error && <p className="text-red-500 mt-4" role="alert">{error}</p>}
            <div className="mt-6">
              <Button 
                onClick={handleMintNFT} 
                className={cn("w-full p-4 rounded-lg", isLoading ? 'bg-gray-400' : 'bg-white text-gray-900')} 
                disabled={isLoading}
                aria-busy={isLoading}
              >
                {isLoading ? 'Minting...' : 'Mint NFT'}
              </Button>
            </div>
          </div>

          <div className="mt-16">
            <h2 className="text-3xl font-bold mb-6 text-white">Recently Minted NFTs</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {mintedNfts.length ? mintedNfts.map((nft, index) => (
                <div key={index} className="bg-gray-800 rounded-lg shadow-lg p-4">
                  <img src={nft.imageUrl} alt={`NFT ${index + 1}`} className="rounded-t-lg w-full h-48 object-cover" />
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-white">{nft.name}</h3>
                    <p className="text-gray-400">Metadata: {nft.metadata}</p>
                  </div>
                </div>
              )) : (
                <p className="text-gray-400 col-span-3">No NFTs minted yet.</p>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center space-x-6">
            <a href="#" aria-label="Twitter" className="text-gray-400 hover:text-white">
              <FaTwitter className="h-6 w-6" />
            </a>
            <a href="#" aria-label="Discord" className="text-gray-400 hover:text-white">
              <FaDiscord className="h-6 w-6" />
            </a>
            <a href="#" aria-label="Telegram" className="text-gray-400 hover:text-white">
              <FaTelegram className="h-6 w-6" />
            </a>
            <a href="#" aria-label="Medium" className="text-gray-400 hover:text-white">
              <FaMedium className="h-6 w-6" />
            </a>
          </div>
          <p className="mt-8 text-center text-base text-gray-400">
            &copy; 2023 NFT Minter. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}