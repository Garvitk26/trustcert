'use client'

import React, { useState, useEffect } from 'react'
import { getXLMBalance } from '@/lib/stellar'
import { Button } from '@/components/ui/button'
import { RefreshCw, Send, ExternalLink } from 'lucide-react'
import SendXLMPanel from './SendXLMPanel'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function WalletStatusBar() {
  const [address, setAddress] = useState('')
  const [balance, setBalance] = useState<number | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    const savedAddress = localStorage.getItem('stellar_address')
    if (savedAddress) {
      setAddress(savedAddress)
      refresh()
    }
  }, [])

  const refresh = async () => {
    const savedAddress = localStorage.getItem('stellar_address')
    if (!savedAddress) return
    setIsRefreshing(true)
    const bal = await getXLMBalance(savedAddress)
    setBalance(bal)
    setTimeout(() => setIsRefreshing(false), 800)
  }

  if (!address) return null

  return (
    <div className="h-14 w-full border-b bg-card/50 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
          <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest text-primary">Connected</span>
          <span className="text-[11px] font-mono text-muted-foreground opacity-60">
            {address.slice(0, 6)}...{address.slice(-6)}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="text-lg font-black tracking-tighter text-primary">
            {balance !== null ? balance.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 }) : '---'}
          </span>
          <span className="text-[10px] font-bold text-muted-foreground mr-1">XLM</span>
          <button onClick={refresh} disabled={isRefreshing} className="p-1 hover:bg-primary/10 rounded-full transition-colors">
            <RefreshCw className={`h-3 w-3 text-primary ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-primary hover:bg-primary/90 text-white h-9 px-4 font-bold shadow-lg shadow-primary/20">
              <Send className="h-3.5 w-3.5 mr-2" />
              Send XLM
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[480px] p-0 border-none bg-transparent">
            <SendXLMPanel />
          </DialogContent>
        </Dialog>

        <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-primary" onClick={() => window.open(`https://stellar.expert/explorer/testnet/account/${address}`, '_blank')}>
          <ExternalLink className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
