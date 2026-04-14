'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Copy, ExternalLink, X, Wallet, ArrowRight, Clock, Hash, Activity } from 'lucide-react'
import { triggerConfetti } from './Confetti'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface TransactionSuccessCardProps {
  title: string
  subtitle: string
  txHash: string
  amount?: string
  walletAddress?: string
  walletBalance?: string
  network?: string
  timestamp?: string
  extraDetails?: { label: string; value: string }[]
  onClose?: () => void
  onViewExplorer?: () => void
}

export default function TransactionSuccessCard({
  title,
  subtitle,
  txHash,
  amount,
  walletAddress,
  walletBalance,
  network = "Stellar Testnet",
  timestamp = new Date().toLocaleString(),
  extraDetails,
  onClose,
  onViewExplorer
}: TransactionSuccessCardProps) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    triggerConfetti()
  }, [])

  const copyHash = () => {
    navigator.clipboard.writeText(txHash)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const truncateAddress = (addr: string) => {
    if (!addr) return ""
    return `${addr.slice(0, 6)}...${addr.slice(-6)}`
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-[#0d0d1f] border border-white/10 shadow-2xl"
      >
        {/* Animated Border Effect */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 rounded-3xl border-2 border-transparent" 
               style={{ 
                 background: 'linear-gradient(90deg, transparent, var(--color-primary), transparent) border-box',
                 WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
                 WebkitMaskComposite: 'destination-out',
                 maskComposite: 'exclude',
                 animation: 'rotateBorder 3s linear infinite'
               }} 
          />
        </div>

        <div className="relative p-8 flex flex-col items-center">
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-white transition-colors"
          >
            <X size={20} />
          </button>

          {/* Animated Checkmark */}
          <div className="relative mb-6">
            <svg className="w-20 h-20 text-primary" viewBox="0 0 52 52">
              <circle 
                className="stroke-current fill-none" 
                cx="26" cy="26" r="25" 
                strokeWidth="2"
                style={{
                  strokeDasharray: 157,
                  strokeDashoffset: 157,
                  animation: 'checkmarkCircle 0.6s ease-in-out forwards'
                }}
              />
              <path 
                className="stroke-current fill-none" 
                d="M14.1 27.2l7.1 7.2 16.7-16.8" 
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  strokeDasharray: 48,
                  strokeDashoffset: 48,
                  animation: 'checkmarkPath 0.3s 0.6s ease-in-out forwards'
                }}
              />
            </svg>
          </div>

          <h2 className="text-3xl font-bold gradient-text mb-2 text-center">{title}</h2>
          <p className="text-muted-foreground mb-6 text-center">{subtitle}</p>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary mb-8">
            <Check size={12} /> {network}
          </div>

          {/* Wallet Section */}
          <div className="w-full bg-white/5 rounded-2xl p-5 mb-4 border border-white/5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Wallet size={16} />
                <span>Connected Wallet</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-white uppercase">{truncateAddress(walletAddress || "")}</span>
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Wallet Balance</div>
              <div className="text-2xl font-bold text-primary">
                {walletBalance || "0.00"} <span className="text-sm font-medium text-muted-foreground">XLM</span>
              </div>
            </div>
          </div>

          {/* Transaction Section */}
          <div className="w-full space-y-3 mb-8 px-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground flex items-center gap-2"><Hash size={14} /> Hash</span>
              <button 
                onClick={copyHash}
                className="font-mono text-[10px] text-white/60 hover:text-white flex items-center gap-2 transition-colors bg-white/5 px-2 py-1 rounded"
              >
                {txHash.slice(0, 12)}...{txHash.slice(-12)}
                {copied ? <Check size={12} className="text-amber-400" /> : <Copy size={12} />}
              </button>
            </div>

            {amount && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground flex items-center gap-2"><Activity size={14} /> Amount</span>
                <span className="font-bold text-white">{amount} XLM</span>
              </div>
            )}

            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground flex items-center gap-2"><Clock size={14} /> Timestamp</span>
              <span className="text-white/80">{timestamp}</span>
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground flex items-center gap-2"><Check size={14} /> Status</span>
              <span className="text-primary font-bold">Confirmed ✓</span>
            </div>

            {extraDetails?.map((detail, idx) => (
              <div key={idx} className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">{detail.label}</span>
                <span className="text-white font-medium">{detail.value}</span>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4 w-full">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="rounded-xl border-white/10 hover:bg-white/5"
            >
              Close
            </Button>
            <Button 
              onClick={() => {
                window.open(`https://stellar.expert/explorer/testnet/tx/${txHash}`, '_blank')
                onViewExplorer?.()
              }}
              className="btn-primary rounded-xl flex items-center gap-2"
            >
              Explorer <ExternalLink size={16} />
            </Button>
          </div>
        </div>
      </motion.div>

      <style jsx global>{`
        @keyframes rotateBorder {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes checkmarkCircle {
          0% { stroke-dashoffset: 157; opacity: 0; }
          100% { stroke-dashoffset: 0; opacity: 1; }
        }
        @keyframes checkmarkPath {
          0% { stroke-dashoffset: 48; }
          100% { stroke-dashoffset: 0; }
        }
      `}</style>
    </div>
  )
}
