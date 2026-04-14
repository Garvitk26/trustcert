import { NextRequest, NextResponse } from 'next/server'
import { Horizon, TransactionBuilder, Networks } from '@stellar/stellar-sdk'

const HORIZON_URL = process.env.NEXT_PUBLIC_STELLAR_HORIZON || 'https://horizon-testnet.stellar.org'
const server = new Horizon.Server(HORIZON_URL)

export async function POST(req: NextRequest) {
  try {
    const { signedXdr } = await req.json()
    const transaction = TransactionBuilder.fromXDR(signedXdr, Networks.TESTNET)
    const result = await server.submitTransaction(transaction)
    
    return NextResponse.json({ 
      success: true, 
      txHash: result.hash,
      ledger: result.ledger,
      fee: (result as any).fee_value || (result as any).fee_charged || "0"
    })
  } catch (error: any) {
    console.error('Submit Error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Failed to submit transaction' 
    }, { status: 500 })
  }
}
