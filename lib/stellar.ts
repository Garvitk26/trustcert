import {
  Server,
  Networks,
  Operation,
  TransactionBuilder,
  BASE_FEE,
  Memo,
  Asset,
  Keypair
} from '@stellar/stellar-sdk'
import { 
  isConnected, 
  getPublicKey, 
  getNetworkDetails,
  signTransaction 
} from '@stellar/freighter-api'

const HORIZON_URL = process.env.NEXT_PUBLIC_STELLAR_HORIZON 
  || 'https://horizon-testnet.stellar.org'
const NETWORK_PASSPHRASE = Networks.TESTNET
const server = new Server(HORIZON_URL)

// ── 1. WALLET SETUP ──────────────────────────────────────────

export async function isFreighterInstalled(): Promise<boolean> {
  const result = await isConnected();
  return !result.error && result.isConnected;
}

export async function isFreighterConnected(): Promise<boolean> {
  const result = await isConnected();
  return !result.error && result.isConnected;
}

export async function getFreighterNetwork(): Promise<string> {
  try {
    const details = await getNetworkDetails();
    if (details.networkPassphrase === Networks.PUBLIC) return 'PUBLIC';
    if (details.networkPassphrase === Networks.TESTNET) return 'TESTNET';
    if (details.networkPassphrase === Networks.FUTURENET) return 'FUTURENET';
    return 'UNKNOWN';
  } catch {
    return 'UNKNOWN';
  }
}

// ── 2. WALLET CONNECT / DISCONNECT ───────────────────────────

export async function connectFreighter(): Promise<{
  publicKey: string
  network: string
}> {
  const installed = await isFreighterInstalled();
  if (!installed) throw new Error('Freighter not installed');

  try {
    const publicKey = await getPublicKey();
    const network = await getFreighterNetwork();
    if (network !== 'TESTNET') throw new Error('Please switch Freighter to Stellar Testnet');
    return { publicKey, network };
  } catch (error: any) {
    if (error.message.includes('User rejected')) throw new Error('User rejected connection');
    throw error;
  }
}

export function disconnectWallet(): { success: boolean } {
  return { success: true };
}

// ── 3. BALANCE HANDLING ───────────────────────────────────────

export async function getXLMBalance(address: string): Promise<number> {
  try {
    const account = await server.loadAccount(address);
    const nativeBalance = account.balances.find(b => b.asset_type === 'native');
    return nativeBalance ? parseFloat(nativeBalance.balance) : 0;
  } catch {
    return 0;
  }
}

export async function fundWithFriendbot(address: string): Promise<{
  success: boolean,
  message: string
}> {
  try {
    const response = await fetch(`https://friendbot.stellar.org?addr=${address}`);
    if (response.ok) return { success: true, message: 'Wallet funded with 10,000 XLM' };
    const data = await response.json();
    return { success: false, message: data.detail || 'Friendbot funding failed' };
  } catch {
    return { success: false, message: 'Network error funding wallet' };
  }
}

// ── 4. TRANSACTION FLOW ───────────────────────────────────────

export type SendXLMResult = 
  | {
      success: true
      txHash: string
      ledger: number
      timestamp: string
      amount: string
      destination: string
      fee: string
    }
  | {
      success: false
      error: string
      code?: string
    }

export async function sendXLM(params: {
  sourcePublicKey: string
  destinationAddress: string
  amountXLM: string
  memo?: string
}): Promise<SendXLMResult> {
  try {
    const sourceAccount = await server.loadAccount(params.sourcePublicKey);
    const builder = new TransactionBuilder(sourceAccount, {
      fee: BASE_FEE,
      networkPassphrase: NETWORK_PASSPHRASE,
    }).addOperation(
      Operation.payment({
        destination: params.destinationAddress,
        asset: Asset.native(),
        amount: params.amountXLM,
      })
    );

    if (params.memo) builder.addMemo(Memo.text(params.memo));
    const transaction = builder.setTimeout(30).build();
    const xdr = transaction.toXDR();
    const signedXdr = await signTransaction(xdr, { network: 'TESTNET' });
    const result = await server.submitTransaction(signedXdr);

    return {
      success: true,
      txHash: result.hash,
      ledger: result.ledger,
      timestamp: new Date().toISOString(),
      amount: params.amountXLM,
      destination: params.destinationAddress,
      fee: (parseFloat(BASE_FEE) / 10000000).toString(),
    };
  } catch (error: any) {
    return {
      success: false,
      error: parseStellarError(error),
      code: error.response?.data?.extras?.result_codes?.transaction || 'error',
    };
  }
}

export function validateStellarAddress(address: string): {
  valid: boolean,
  error?: string
} {
  try {
    Keypair.fromPublicKey(address);
    return { valid: true };
  } catch {
    return { valid: false, error: 'Invalid Stellar address format' };
  }
}

export async function getTransactionByHash(txHash: string): Promise<{
  txHash: string
  ledger: number
  createdAt: string
  sourceAccount: string
  fee: string
  memo?: string
  successful: boolean
} | null> {
  try {
    const tx = await server.transactions().transaction(txHash).call();
    return {
      txHash: tx.hash,
      ledger: tx.ledger_attr,
      createdAt: tx.created_at,
      sourceAccount: tx.source_account,
      fee: tx.fee_value,
      memo: tx.memo,
      successful: tx.successful,
    };
  } catch {
    return null;
  }
}

export function parseStellarError(error: any): string {
  const resultCodes = error.response?.data?.extras?.result_codes;
  const mainCode = resultCodes?.transaction;
  const opCode = resultCodes?.operations?.[0];

  const errorMap: Record<string, string> = {
    'op_underfunded': 'Insufficient XLM balance for this transaction',
    'op_no_destination': 'Destination wallet does not exist on Stellar yet',
    'tx_bad_seq': 'Transaction sequence error. Please try again.',
    'op_low_reserve': 'Your wallet needs more XLM to meet the minimum reserve',
    'tx_insufficient_fee': 'Transaction fee too low. Please try again.',
  }

  if (error.message === 'User rejected') return 'Transaction rejected in Freighter';
  return errorMap[opCode] || errorMap[mainCode] || error.message || 'An unexpected Stellar error occurred';
}
