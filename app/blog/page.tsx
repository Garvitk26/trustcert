import React from "react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

export default function BlogPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#020d0a]">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="p-12 rounded-3xl border border-amber-500/10 bg-amber-500/5 backdrop-blur-md max-w-2xl w-full">
          <h1 className="text-4xl font-bold text-white mb-4 font-mono uppercase tracking-widest">BLOG</h1>
          <p className="text-muted-foreground leading-relaxed italic border-l-4 border-amber-500 pl-4 py-2 bg-amber-500/5">
            This module is currently initializing on the network. Please check back later.
          </p>
          <div className="mt-8 flex justify-center gap-4">
             <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
             <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse delay-75" />
             <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse delay-150" />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
