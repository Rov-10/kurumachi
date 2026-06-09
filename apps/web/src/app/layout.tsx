import type { Metadata } from "next";
import { Space_Grotesk, Silkscreen } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import AuthProvider from "@/components/AuthProvider";
import PageTransition from "@/components/PageTransition";

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
      <body className={`${space.variable} ${dot.variable} font-sans min-h-screen text-lg selection:bg-nothing-red selection:text-white`}>
        <AuthProvider>
          <Navbar />
          {/* Ми обгортаємо контент у наш новий компонент анімацій */}
          <PageTransition>
            {children}
          </PageTransition>
        </AuthProvider>
      </body>
    </html>
  );
}