import type { Metadata } from "next";
import { Space_Grotesk, DotGothic16 } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const space = Space_Grotesk({ 
  subsets: ["latin"], 
  variable: "--font-space" 
});

const dot = DotGothic16({ 
  weight: "400", 
  subsets: ["latin"], 
  variable: "--font-dot" 
});

export const metadata: Metadata = {
  title: "KURUMACHI | Companion",
  description: "Advanced companion device interface",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${space.variable} ${dot.variable} font-sans min-h-screen selection:bg-nothing-red selection:text-white`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}