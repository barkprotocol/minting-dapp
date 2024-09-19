# BARK Minter: Mint Your Exclusive NFT
**Project template**

Welcome to the BARK Minter! This application allows you to mint exclusive NFTs on the Solana blockchain. Follow the instructions below to get started.

![BARK Minter Screenshot](public/images/screenshot.jpg)

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Setup](#setup)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Overview

The BARK Minter is a web application built with Next.js and TypeScript that enables users to mint NFTs on the Solana blockchain. It integrates with various Solana wallets and provides a user-friendly interface for creating and managing NFTs.

## Features

- **Mint NFTs**: Create and mint exclusive NFTs on the Solana blockchain.
- **Wallet Integration**: Supports Phantom, Solflare, and Backpack wallets.
- **Error Handling**: Comprehensive error handling for smooth user experience.
- **Responsive Design**: Works seamlessly on both desktop and mobile devices.

## Setup

### Prerequisites

- Node.js (>=18.x)
- Yarn or npm
- A Solana wallet (Phantom, Solflare, or Backpack)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/barkprotocol/bark-minter-dapp.git
   cd bark-minter-dapp
   ```

2. **Install dependencies:**

   ```bash
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables:**

   Create a `.env.local` file in the root of the project and add the following environment variables:

   ```env
   SECRET_KEY=your-secret-key-here
   JWT_SECRET=your-jwt-secret-key-here
   NODE_ENV=development

   NEXT_PUBLIC_CANDY_MACHINE_ID=
   NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
   NEXT_PUBLIC_SOLANA_DEVNET_RPC_URL=https://api.devnet.solana.com
   HELIUS_API_URL=
   FALLBACK_RPC_ENDPOINT=

   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   NEXT_PUBLIC_SOLANA_NETWORK=devnet
   NEXT_PUBLIC_SOLANA_RPC_URL=
   NEXT_PUBLIC_MINT_API_URL=

   TOKEN_PROGRAM_ID=TokenkegQfeZyiNwAJbNbGKPFXkQd5J8X8wnF8MPzYx
   CNFT_PROGRAM_ID=
   DEFAULT_WALLET_ADDRESS=
   METADATA_SERVICE_URL=https://api.example.com/upload-metadata
   ```

## Usage

1. **Start the development server:**

   ```bash
   yarn dev
   # or
   npm run dev
   ```

2. **Open your browser and navigate to `http://localhost:3000`** to access the application.

3. **Mint an NFT:**
   - Connect your Solana wallet.
   - Enter the NFT details such as title, description, and image.
   - Submit the form to mint your NFT.

## API Endpoints

- **POST `/api/transfer`**: Initiates a transfer transaction on the Solana blockchain.

  **Request Body:**
  ```json
  {
    "fromPublicKey": "string",
    "toPublicKey": "string",
    "lamports": 1000
  }
  ```

  **Response:**
  ```json
  {
    "signature": "transaction-signature"
  }
  ```

## Deployment

To deploy the application on Vercel:

1. **Push your code to GitHub.**

2. **Connect your GitHub repository to Vercel** and follow the prompts to deploy.

3. **Set up environment variables in Vercel** under the Project Settings > Environment Variables.

## Contributing

We welcome contributions to improve the BARK Minter. Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Make your changes.
4. Commit your changes (`git commit -am 'Add new feature'`).
5. Push to the branch (`git push origin feature/your-feature`).
6. Open a pull request.

## License

MIT License. See the [LICENSE](LICENSE) file for details.
```

This `README.md` now includes a screenshot section with the image located at `public/images/screenshot.jpg`, giving users a preview of what the BARK Minter looks like. Make sure the screenshot file is properly placed in the specified path within your project.