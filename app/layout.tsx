import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Load local fonts
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// Define metadata for the application
export const metadata: Metadata = {
  title: "BARK | NFT Minter",
  description: "A decentralized application for minting and managing exclusive NFTs on the Solana blockchain.",
  openGraph: {
    title: "BARK | NFT Minter",
    description: "Mint and manage exclusive NFTs with BARK on Solana.",
    url: "https://mint.barkprotocol.app",
    siteName: "BARK NFT Minter",
    images: [
      {
        url: "https://mint.barkprotocol.app/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "BARK NFT Minter Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BARK | NFT Minter",
    description: "Mint and manage exclusive NFTs with BARK on Solana.",
    images: ["https://ucarecdn.com/9d42462f-cd40-40ac-a218-00932eaae06a/donation_sol.png"],
  },
};

// Define the RootLayout component
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Meta tags for better SEO and social sharing */}
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content={metadata.description} />
        <link rel="icon" href="/favicon.ico" />
        {/* Add additional meta tags or links if needed */}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
