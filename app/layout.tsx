import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/shared/SessionProvider";
import { ToastProvider } from "@/lib/context/ToastContext";
import ToastContainer from "@/components/shared/Toast";
import SessionWatcher from "@/components/shared/SessionWatcher";
import dbConnect from "@/lib/db";

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "TrustCert | Decentralized Identity Layer",
  description: "Secure, verifiable academic credentials on the Stellar blockchain.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${jetbrainsMono.variable} font-mono antialiased`}>
        <SessionProvider refetchInterval={300}>
          <ToastProvider>
            <div className="relative z-10 min-h-screen flex flex-col">
              {children}
            </div>
            <ToastContainer />
            <SessionWatcher />
            
            {/* Global Ambient Background */}
            <div className="ambient-bg">
              <div className="ambient-blob-3" />
            </div>
          </ToastProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
