import { NextRequest, NextResponse } from 'next/server'
import { Server } from '@stellar/stellar-sdk'

const HORIZON_URL = process.env.NEXT_PUBLIC_STELLAR_HORIZON || 'https://horizon-testnet.stellar.org'
const server = new Server(HORIZON_URL)

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const address = searchParams.get('address')

  if (!address) return NextResponse.json({ error: 'Address is required' }, { status: 400 })

  try {
    const account = await server.loadAccount(address)
    const nativeBalance = account.balances.find(b => b.asset_type === 'native')
    const balance = nativeBalance ? parseFloat(nativeBalance.balance) : 0
    return NextResponse.json({ address, balance, funded: true })
  } catch (error: any) {
    if (error.response?.status === 404) {
      return NextResponse.json({ address, balance: 0, funded: false })
    }
    return NextResponse.json({ error: 'Failed to fetch balance' }, { status: 500 })
  }
}
