import { NextRequest, NextResponse } from 'next/server'
import { Server } from '@stellar/stellar-sdk'

const HORIZON_URL = process.env.NEXT_PUBLIC_STELLAR_HORIZON || 'https://horizon-testnet.stellar.org'
const server = new Server(HORIZON_URL)

export async function POST(req: NextRequest) {
  try {
    const { txHash } = await req.json()
    if (!txHash) return NextResponse.json({ error: 'Transaction hash is required' }, { status: 400 })

    const tx = await server.transactions().transaction(txHash).call()
    if (!tx) return NextResponse.json({ verified: false, error: 'Transaction not found' }, { status: 404 })

    return NextResponse.json({
      verified: true,
      txDetails: {
        hash: tx.hash,
        ledger: tx.ledger_attr,
        createdAt: tx.created_at,
        source: tx.source_account,
        fee: tx.fee_value,
        memo: tx.memo,
        successful: tx.successful
      }
    })
  } catch (error: any) {
    return NextResponse.json({ verified: false, error: 'Failed to verify transaction' }, { status: 500 })
  }
}
