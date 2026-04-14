'use client'

import React from 'react'
import WalletStatusBar from '@/components/shared/WalletStatusBar'
import TransactionSuccessCard from '@/components/shared/TransactionSuccessCard'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Camera, Smartphone, Clock, CheckCircle2, Info } from 'lucide-react'

export default function ScreenshotsPage() {
  const demoTxHash = "a3f8c2d1e9b47f6c8d2e4a1b9c3f7e5d8a2b4c6e1f3a5b7c9d2e4f6a8b1c3d5"
  
  return (
    <div className="min-h-screen bg-[#0d0d1f] text-slate-300 p-8 font-sans">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-12 border-b border-amber-500/30 pb-8">
        <div className="flex items-center gap-3 mb-4">
          <Camera className="text-amber-400 w-8 h-8" />
          <h1 className="text-4xl font-bold text-white tracking-tight">
            📸 Screenshot Helper — TrustCert
          </h1>
        </div>
        <p className="text-slate-400 text-lg mb-6">
          Use this page to capture all required submission screenshots for the Stellar Builder Track.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl flex gap-3 italic text-sm">
            <Info className="text-amber-400 shrink-0" />
            <p>Open DevTools (F12) → No device mode needed for sections 1-3. For Section 4: Toggle device toolbar → iPhone SE → Capture.</p>
          </div>
          <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl flex gap-3 text-sm">
            <CheckCircle2 className="text-amber-400 shrink-0" />
            <p className="text-amber-200">DEMO PAGE — Not a real transaction. For documentation purposes only.</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto space-y-24">
        {/* Section 1 */}
        <section id="section-1" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
              <span className="bg-amber-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
              Wallet Connected State
            </h2>
            <span className="text-amber-400 text-sm font-mono uppercase tracking-widest">Screenshot 1: Wallet Connected + Balance</span>
          </div>
          <Card className="p-0 overflow-hidden border-amber-500/30 bg-[#161633] shadow-2xl">
            <WalletStatusBar />
            <div className="p-12 text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-xs font-bold uppercase tracking-wider">
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                Freighter Connected
              </div>
              <div className="space-y-2">
                <p className="text-slate-400 text-sm font-medium">Connected Wallet</p>
                <p className="text-2xl font-mono text-white opacity-80">GDEMO...ADDR</p>
              </div>
              <div className="space-y-2">
                <p className="text-slate-400 text-sm font-medium">XLM Balance</p>
                <div className="text-6xl font-black text-amber-400 tracking-tighter">
                  9,842.4231 <span className="text-2xl text-slate-500">XLM</span>
                </div>
              </div>
              <div className="inline-block px-4 py-1 bg-amber-600 text-white rounded text-xs font-bold uppercase tracking-widest">
                Stellar Testnet
              </div>
            </div>
          </Card>
          <p className="text-slate-500 text-sm italic text-center">Caption below: "Screenshot 1: Wallet Connected + Balance"</p>
        </section>

        {/* Section 2 */}
        <section id="section-2" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
              <span className="bg-amber-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
              Balance Display
            </h2>
            <span className="text-amber-400 text-sm font-mono uppercase tracking-widest">Screenshot 2: Balance Display</span>
          </div>
          <Card className="p-24 flex flex-col items-center justify-center border-amber-500/30 bg-[#161633] shadow-2xl space-y-8">
            <div className="text-center space-y-2">
              <h3 className="text-7xl font-black text-amber-400 tracking-tighter">
                9,842.4231 XLM
              </h3>
              <p className="text-slate-400 text-lg uppercase tracking-widest font-medium">Available on Stellar Testnet</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg border border-white/10 text-xs text-slate-400">
                <Clock className="w-4 h-4" />
                Last updated: {new Date().toLocaleString()}
              </div>
              <Button variant="outline" className="border-amber-500/50 text-amber-400 hover:bg-amber-500/10">
                Refresh Balance
              </Button>
            </div>
          </Card>
          <p className="text-slate-500 text-sm italic text-center">Caption below: "Screenshot 2: Balance Display"</p>
        </section>

        {/* Section 3 */}
        <section id="section-3" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
              <span className="bg-amber-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
              Transaction Success (Static Demo)
            </h2>
            <span className="text-amber-400 text-sm font-mono uppercase tracking-widest">Screenshot 3: Transaction Success</span>
          </div>
          <div className="flex justify-center p-12 bg-amber-500/5 rounded-3xl border border-amber-500/10">
            <TransactionSuccessCard 
              title="Certificate Issued!"
              subtitle="Credential permanently recorded on Stellar Testnet"
              txHash={demoTxHash}
              amount="0.0000100 XLM"
              walletAddress="GDEMO...ADDR"
              walletBalance="9,341.2847 XLM"
              extraDetails={[
                { label: "Certificate ID", value: "CERT-2025-0042" },
                { label: "Recipient", value: "Parth D." },
                { label: "Asset Code", value: "CERT2025A8" },
                { label: "Course", value: "Blockchain Development" }
              ]}
              onClose={() => {}}
            />
          </div>
          <p className="text-slate-500 text-sm italic text-center">Caption below: "Screenshot 3: Transaction Success"</p>
        </section>

        {/* Section 4 */}
        <section id="section-4" className="space-y-6 pb-24">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
              <span className="bg-amber-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">4</span>
              Mobile Preview (Responsive Demo)
            </h2>
            <span className="text-amber-400 text-sm font-mono uppercase tracking-widest">Screenshot 4: Mobile Responsive View</span>
          </div>
          <div className="flex flex-col items-center gap-8">
            <div className="relative border-[12px] border-[#1e1e3f] rounded-[3rem] w-[375px] h-[700px] shadow-2xl overflow-hidden bg-[#0d0d1f]">
               <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-6 bg-[#1e1e3f] rounded-b-2xl z-50 flex items-center justify-center">
                 <div className="w-12 h-1 bg-white/10 rounded-full" />
               </div>
               <iframe 
                 src="/" 
                 className="w-full h-full border-none pointer-events-none"
                 title="Mobile Preview"
               />
               <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-4 py-1 bg-black/50 backdrop-blur-md rounded-full text-[10px] font-bold text-white uppercase tracking-tighter border border-white/10">
                 375px — iPhone SE
               </div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Smartphone className="text-amber-400 w-12 h-12" />
              <p className="text-slate-400 font-medium tracking-wide">iPhone SE Viewport Simulation</p>
            </div>
          </div>
          <p className="text-slate-500 text-sm italic text-center">Caption below: "Screenshot 4: Mobile Responsive View"</p>
        </section>
      </div>

      {/* Footer Banner */}
      <div className="fixed top-0 left-0 right-0 py-2 bg-amber-600/20 backdrop-blur-md border-b border-amber-500/30 text-center z-50 pointer-events-none">
        <p className="text-[10px] font-bold text-amber-300 uppercase tracking-[0.3em]">
          Internal Documentation Helper — Remove from production before final launch
        </p>
      </div>
    </div>
  )
}
