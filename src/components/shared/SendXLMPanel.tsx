'use client'

import React, { useState, useEffect } from 'react'
import { 
  validateStellarAddress, 
  sendXLM, 
  getXLMBalance, 
  SendXLMResult 
} from '@/lib/stellar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Loader2, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  ExternalLink, 
  RefreshCw, 
  Clipboard
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import confetti from 'canvas-confetti'

interface SendXLMPanelProps {
  defaultMemo?: string
  onSuccess?: (result: SendXLMResult) => void
  compact?: boolean
}

export default function SendXLMPanel({ defaultMemo = '', onSuccess, compact = false }: SendXLMPanelProps) {
  const [step, setStep] = useState<'FORM' | 'BUILDING' | 'SIGNING' | 'BROADCASTING' | 'SUCCESS' | 'FAILURE'>('FORM')
  const [destination, setDestination] = useState('')
  const [amount, setAmount] = useState('')
  const [memo, setMemo] = useState(defaultMemo)
  const [balance, setBalance] = useState<number>(0)
  const [address, setAddress] = useState('')
  const [errors, setErrors] = useState<{ destination?: string; amount?: string }>({})
  const [txResult, setTxResult] = useState<SendXLMResult | null>(null)
  const [copied, setCopied] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedAddress = localStorage.getItem('stellar_address')
    if (savedAddress) {
      setAddress(savedAddress)
      getXLMBalance(savedAddress).then(setBalance)
    }
  }, [])

  const validate = () => {
    const newErrors: { destination?: string; amount?: string } = {}
    const { valid } = validateStellarAddress(destination)
    if (!valid) newErrors.destination = 'Invalid Stellar address'
    
    const numAmount = parseFloat(amount)
    if (isNaN(numAmount) || numAmount <= 0) {
      newErrors.amount = 'Enter a valid amount'
    } else if (numAmount > balance - 0.1) {
      newErrors.amount = 'Insufficient balance (reserve 0.1 XLM for fees)'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSend = async () => {
    if (!validate()) return

    setStep('BUILDING')
    setTimeout(async () => {
      setStep('SIGNING')
      try {
        const result = await sendXLM({
          sourcePublicKey: address,
          destinationAddress: destination,
          amountXLM: amount,
          memo: memo
        })

        if (result.success) {
          setTxResult(result)
          setStep('SUCCESS')
          confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#f59e0b', '#a78bfa', '#22d3ee']
          })
          const newBal = await getXLMBalance(address)
          setBalance(newBal)
          if (onSuccess) onSuccess(result)
        } else {
          setTxResult(result)
          setStep('FAILURE')
        }
      } catch (err: any) {
        setTxResult({ success: false, error: err.message })
        setStep('FAILURE')
      }
    }, 500)
  }

  const resetForm = () => {
    setStep('FORM')
    setAmount('')
    setDestination('')
    setMemo(defaultMemo)
    setTxResult(null)
  }

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      setDestination(text)
    } catch {}
  }

  if (step === 'BUILDING' || step === 'SIGNING' || step === 'BROADCASTING') {
    return (
      <Card className="border-primary/20 bg-card/50 backdrop-blur-sm shadow-xl">
        <CardContent className="flex flex-col items-center justify-center p-12 space-y-6">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <div className="text-center space-y-2">
            <h3 className="text-lg font-bold">
              {step === 'BUILDING' && 'Building transaction...'}
              {step === 'SIGNING' && 'Waiting for Freighter signature...'}
              {step === 'BROADCASTING' && 'Broadcasting to Stellar Testnet...'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {step === 'SIGNING' && 'Please approve the transaction in your Freighter wallet.'}
              {step === 'BROADCASTING' && 'This typically takes 3-5 seconds on the network.'}
            </p>
          </div>
          {step === 'SIGNING' && (
            <Button variant="ghost" size="sm" onClick={resetForm} className="text-muted-foreground hover:text-rose-500">
              Cancel Transaction
            </Button>
          )}
        </CardContent>
      </Card>
    )
  }

  if (step === 'SUCCESS' && txResult?.success) {
    return (
      <Card className="border-amber-500/20 bg-card shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="bg-amber-500/5 px-6 py-4 flex items-center justify-center border-b border-amber-500/10">
          <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center">
             <CheckCircle2 className="h-6 w-6 text-amber-500 stroke-[3px]" />
          </div>
        </div>
        
        <CardContent className="p-8 space-y-8">
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-black gradient-text tracking-tight">Transaction Confirmed!</h2>
            <p className="text-sm text-muted-foreground">
              Confirmed at {new Date(txResult.timestamp).toLocaleTimeString()}
            </p>
          </div>

          <div className="grid grid-cols-2 border rounded-xl overflow-hidden divide-x divide-y">
            <div className="p-4 bg-muted/30">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">Amount Sent</label>
              <p className="font-mono font-bold text-lg">{txResult.amount} XLM</p>
            </div>
            <div className="p-4 bg-muted/30 border-t-0">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">Network Fee</label>
              <p className="font-mono text-lg">{txResult.fee} XLM</p>
            </div>
            <div className="p-4">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">Status</label>
              <div className="flex items-center gap-1.5 text-amber-500 font-bold">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Confirmed</span>
              </div>
            </div>
            <div className="p-4">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">Network</label>
              <p className="text-sm font-semibold">Stellar Testnet</p>
            </div>
          </div>

          <div className="space-y-3">
             <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">Transaction Hash</label>
             <div className="flex gap-2 p-3 bg-muted rounded-lg border border-border/50">
                <code className="flex-1 text-xs font-mono break-all leading-tight opacity-70">
                  {txResult.txHash}
                </code>
                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => {
                  navigator.clipboard.writeText(txResult.txHash)
                  setCopied(true)
                  setTimeout(() => setCopied(false), 2000)
                }}>
                   {copied ? <CheckCircle2 className="h-4 w-4 text-amber-500" /> : <Copy className="h-4 w-4" />}
                </Button>
             </div>
          </div>

          <div className="pt-2 flex flex-col items-center gap-4">
            <div className="text-sm font-medium p-4 rounded-xl bg-primary/5 border border-primary/10 w-full text-center">
              <span className="text-muted-foreground">New Balance: </span>
              <span className="text-primary font-bold text-lg">{balance.toFixed(4)} XLM</span>
            </div>
            <div className="flex gap-3 w-full">
              <Button className="flex-1 bg-primary" onClick={() => window.open(`https://stellar.expert/explorer/testnet/tx/${txResult.txHash}`, '_blank')}>
                <ExternalLink className="mr-2 h-4 w-4" />
                Explorer
              </Button>
              <Button variant="outline" className="flex-1" onClick={resetForm}>
                Send Again
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (step === 'FAILURE' && txResult && !txResult.success) {
    return (
      <Card className="border-rose-500/20 bg-card overflow-hidden">
        <div className="bg-rose-500/5 px-6 py-8 flex flex-col items-center gap-4 border-b border-rose-500/10 text-center">
           <AlertCircle className="h-12 w-12 text-rose-500" />
           <div className="space-y-1">
             <h2 className="text-xl font-bold text-rose-500">Transaction Failed</h2>
             <p className="text-sm text-muted-foreground">{txResult.error}</p>
           </div>
        </div>
        <CardContent className="p-6">
           <Button className="w-full bg-primary" onClick={resetForm}>Try Again</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`border-border/40 bg-card overflow-hidden ${compact ? 'shadow-none border-none' : 'shadow-xl'}`}>
      <CardHeader className="bg-primary/5 border-b border-primary/10 py-5">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-black tracking-tight flex items-center gap-2 text-foreground">
            <Send className="h-5 w-5 text-primary" />
            Send XLM
          </CardTitle>
          <Badge variant="secondary" className="bg-primary/10 text-primary border-none text-[9px] font-bold px-2 py-0.5 uppercase tracking-wider">Testnet</Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="destination" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Destination Wallet</Label>
              <Button variant="ghost" size="sm" className="h-6 text-[10px] font-bold uppercase tracking-widest text-primary" onClick={handlePaste}>
                <Clipboard className="h-3 w-3 mr-1" />
                Paste
              </Button>
            </div>
            <div className="relative">
               <Input 
                id="destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                onBlur={() => validate()}
                placeholder="G... (Stellar public key)"
                className={`font-mono text-xs py-5 ${errors.destination ? 'border-rose-500 bg-rose-500/5' : 'focus:border-primary/50'}`}
              />
              {destination && !errors.destination && <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-500" />}
            </div>
            {errors.destination && <p className="text-[10px] font-bold text-rose-500">{errors.destination}</p>}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="amount" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Amount to Send</Label>
              <p className="text-[10px] font-medium text-muted-foreground">
                Available: <span className="text-primary font-bold">{balance.toFixed(4)} XLM</span>
              </p>
            </div>
            <div className="relative">
              <Input 
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.0000"
                className={`font-mono py-5 ${errors.amount ? 'border-rose-500 bg-rose-500/5' : 'focus:border-primary/50'}`}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <Button variant="ghost" size="sm" className="h-7 text-[10px] px-2 font-black border border-primary/20 text-primary" onClick={() => setAmount(Math.max(0, balance - 0.1).toFixed(7))}>MAX</Button>
                <span className="text-xs font-black text-muted-foreground opacity-50">XLM</span>
              </div>
            </div>
            {errors.amount && <p className="text-[10px] font-bold text-rose-500">{errors.amount}</p>}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="memo" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Memo (Optional)</Label>
              <span className={`text-[10px] font-bold ${memo.length > 28 ? 'text-rose-500' : 'text-muted-foreground'}`}>{memo.length}/28</span>
            </div>
            <Input 
              id="memo"
              value={memo}
              onChange={(e) => setMemo(e.target.value.slice(0, 28))}
              placeholder="Ref: TrustCert Fee"
              className="text-xs py-5"
            />
          </div>
        </div>

        <div className="pt-2">
           <Button 
            className="w-full py-7 text-lg bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 group transition-all"
            disabled={!destination || !amount || !!errors.destination || !!errors.amount}
            onClick={handleSend}
          >
            <Send className="mr-2 h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            Send XLM
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
