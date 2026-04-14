'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { 
  isFreighterInstalled, 
  connectFreighter, 
  disconnectWallet, 
  getXLMBalance, 
  fundWithFriendbot,
  getFreighterNetwork 
} from '@/lib/stellar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Loader2, Wallet, AlertTriangle, CheckCircle2, RefreshCw, Copy, ExternalLink, Unlink, Info } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export default function WalletManager() {
  const [status, setStatus] = useState<'LOADING' | 'NOT_INSTALLED' | 'WRONG_NETWORK' | 'DISCONNECTED' | 'CONNECTING' | 'CONNECTED'>('LOADING')
  const [address, setAddress] = useState('')
  const [balance, setBalance] = useState<number>(0)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isFunding, setIsFunding] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const checkStatus = useCallback(async () => {
    try {
      const installed = await isFreighterInstalled()
      if (!installed) {
        setStatus('NOT_INSTALLED')
        return
      }

      const network = await getFreighterNetwork()
      if (network !== 'TESTNET' && network !== 'UNKNOWN') {
        setStatus('WRONG_NETWORK')
        return
      }

      const savedAddress = localStorage.getItem('stellar_address')
      if (savedAddress) {
        setAddress(savedAddress)
        const bal = await getXLMBalance(savedAddress)
        setBalance(bal)
        setStatus('CONNECTED')
      } else {
        setStatus('DISCONNECTED')
      }
    } catch (err) {
      setStatus('DISCONNECTED')
    }
  }, [])

  useEffect(() => {
    checkStatus()
  }, [checkStatus])

  useEffect(() => {
    if (status === 'CONNECTED' && address) {
      const interval = setInterval(async () => {
        const bal = await getXLMBalance(address)
        setBalance(bal)
      }, 60000)
      return () => clearInterval(interval)
    }
  }, [status, address])

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [error])

  const handleConnect = async () => {
    setStatus('CONNECTING')
    setError(null)
    try {
      const { publicKey } = await connectFreighter()
      setAddress(publicKey)
      localStorage.setItem('stellar_address', publicKey)
      const bal = await getXLMBalance(publicKey)
      setBalance(bal)
      setStatus('CONNECTED')
    } catch (err: any) {
      setError(err.message)
      setStatus('DISCONNECTED')
    }
  }

  const handleDisconnect = () => {
    disconnectWallet()
    localStorage.removeItem('stellar_address')
    setAddress('')
    setBalance(0)
    setStatus('DISCONNECTED')
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    const bal = await getXLMBalance(address)
    setBalance(bal)
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  const handleFund = async () => {
    setIsFunding(true)
    setError(null)
    try {
      const result = await fundWithFriendbot(address)
      if (result.success) {
        await handleRefresh()
      } else {
        setError(result.message)
      }
    } catch (err) {
      setError('Funding failed. Try again later.')
    } finally {
      setIsFunding(false)
    }
  }

  const copyAddress = () => {
    navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (status === 'LOADING') {
    return (
      <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
        <CardContent className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    )
  }

  if (status === 'NOT_INSTALLED') {
    return (
      <Card className="border-amber-500/50 bg-amber-500/5">
        <CardHeader>
          <div className="flex items-center gap-2 text-amber-500">
            <AlertTriangle className="h-5 w-5" />
            <CardTitle className="text-lg">Freighter Wallet Required</CardTitle>
          </div>
          <CardDescription>Install Freighter to use TrustCert on Stellar Testnet</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            className="w-full bg-amber-500 hover:bg-amber-600 text-white"
            onClick={() => window.open('https://freighter.app', '_blank')}
          >
            Install Freighter
          </Button>
          <Button variant="outline" className="w-full" onClick={() => window.location.reload()}>
            Refresh Page
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (status === 'WRONG_NETWORK') {
    return (
      <Card className="border-rose-500/50 bg-rose-500/5">
        <CardHeader>
          <div className="flex items-center gap-2 text-rose-500">
            <AlertTriangle className="h-5 w-5" />
            <CardTitle className="text-lg">Wrong Network Detected</CardTitle>
          </div>
          <CardDescription>Please switch Freighter to Stellar Testnet</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-black/10 p-3 text-sm space-y-2">
            <p className="font-medium">To fix this:</p>
            <ol className="list-decimal list-inside space-y-1 text-xs">
              <li>Open Freighter Extension</li>
              <li>Click Settings (gear icon)</li>
              <li>Go to Network</li>
              <li>Select <strong>Testnet</strong></li>
            </ol>
          </div>
          <Button className="w-full bg-rose-500 hover:bg-rose-600 text-white" onClick={checkStatus}>
            Check Network Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (status === 'DISCONNECTED' || status === 'CONNECTING') {
    return (
      <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Wallet className={`h-6 w-6 text-primary ${status === 'DISCONNECTED' ? 'animate-pulse' : ''}`} />
          </div>
          <CardTitle>Connect Your Stellar Wallet</CardTitle>
          <CardDescription>Required to sign transactions on Stellar Testnet</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            className="w-full py-6 text-lg bg-primary hover:bg-primary/90" 
            disabled={status === 'CONNECTING'}
            onClick={handleConnect}
          >
            {status === 'CONNECTING' ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              'Connect Freighter'
            )}
          </Button>
          {status === 'CONNECTING' && (
            <p className="text-center text-xs text-muted-foreground animate-pulse">
              Please approve the connection in Freighter
            </p>
          )}
          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-rose-500/10 p-3 text-sm text-rose-500">
              <AlertTriangle className="h-4 w-4" />
              {error}
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-primary/40 bg-card shadow-lg overflow-hidden">
      <div className="bg-primary/5 px-6 py-3 flex items-center justify-between border-b border-primary/10">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Connected to Stellar Testnet</span>
        </div>
      </div>
      
      <CardContent className="p-6 space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Wallet Address</label>
          <div className="flex items-center gap-2">
            <code className="flex-1 rounded bg-muted px-3 py-2 text-sm font-mono tracking-tight overflow-hidden text-ellipsis">
              {address.slice(0, 8)}...{address.slice(-8)}
            </code>
            <Button variant="ghost" size="icon" className="h-9 w-9" onClick={copyAddress}>
              {copied ? <CheckCircle2 className="h-4 w-4 text-amber-500" /> : <Copy className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => window.open(`https://stellar.expert/explorer/testnet/account/${address}`, '_blank')}>
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">XLM Balance</label>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-primary tracking-tighter">
              {balance.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 })}
            </span>
            <span className="text-sm font-bold text-muted-foreground">XLM</span>
          </div>
          <Badge variant="outline" className="text-[9px] font-black uppercase tracking-tighter bg-primary/5 text-primary border-primary/20">
            Stellar Testnet
          </Badge>
          
          {balance === 0 && (
            <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/10 flex flex-col items-center gap-3">
              <div className="flex items-center gap-2 text-xs text-primary/80">
                <Info className="h-3 w-3" />
                <span>New wallet — fund with Friendbot to start</span>
              </div>
              <Button size="sm" className="w-full bg-primary" onClick={handleFund} disabled={isFunding}>
                {isFunding ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : 'Fund with 10,000 XLM'}
              </Button>
            </div>
          )}
        </div>

        <Button 
          variant="ghost" 
          className="w-full mt-2 text-muted-foreground hover:text-rose-500 hover:bg-rose-500/5 group"
          onClick={handleDisconnect}
        >
          <Unlink className="h-4 w-4 mr-2 group-hover:animate-bounce" />
          Disconnect Wallet
        </Button>

        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-rose-500/10 p-3 text-sm text-rose-500">
            <AlertTriangle className="h-4 w-4" />
            {error}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
