import type { Metadata } from "next";
import { Space_Grotesk, Silkscreen } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const space = Space_Grotesk({ 
  subsets: ["latin"], 
  variable: "--font-space" 
});

const dot = Silkscreen({ 
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
      {/* ДОДАНО клас text-lg до body */}
      <body className={`${space.variable} ${dot.variable} font-sans min-h-screen text-lg selection:bg-nothing-red selection:text-white`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}