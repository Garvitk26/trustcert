# TrustCert — On-chain Certificate Verification

![CI](https://github.com/parth1241/trustcert/actions/workflows/ci.yml/badge.svg)
![Vercel](https://img.shields.io/badge/deployed-vercel-black)
![Stellar](https://img.shields.io/badge/blockchain-Stellar%20Testnet-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 🌐 Live Demo
**[YOUR_VERCEL_URL]**

> Built on **Stellar Testnet** — no real funds used.

## 📱 Screenshots

### Wallet Connected + Balance Display
> Screenshot of WalletStatusBar showing connected address + XLM balance.

### Successful Testnet Transaction
> Screenshot of TransactionSuccessCard after issuing a certificate.
> Shows: txHash, amount, wallet address, updated balance, Stellar Expert link.

### Mobile Responsive View
> Screenshot of the app on 375px mobile width.

### CI/CD Pipeline
> GitHub Actions tab showing green CI run.

---

## 📋 What It Does
TrustCert is a decentralized platform for issuing and verifying academic and professional certificates. By leveraging the Stellar blockchain, TrustCert ensures that every certificate is immutable, verifiable, and globally accessible. Issuers can create certificates as on-chain records, and verifiers can instantly validate authenticity by checking the blockchain, eliminating credential fraud and the need for manual background checks.

## ⚙️ Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 App Router + TypeScript |
| Styling | TailwindCSS + shadcn/ui |
| Blockchain | Stellar SDK + Freighter Wallet |
| Database | MongoDB Atlas |
| Auth | NextAuth.js (JWT) |
| Deployment | Vercel |
| Network | Stellar Testnet |

## 🔗 Blockchain Details

### Network
- **Network:** Stellar Testnet
- **Horizon:** https://horizon-testnet.stellar.org
- **Explorer:** https://stellar.expert/explorer/testnet

### Wallet Addresses Used
| Role | Address | Purpose |
|------|---------|---------|
| Issuer | [WALLET_ADDRESS] | Minting/Issuing certificates |
| Recipient | [WALLET_ADDRESS] | Receiving certificate proof |

### Asset / Token Details
- **Asset Code:** XLM (Native)
- **Explorer Link:** https://stellar.expert/explorer/testnet/asset/XLM

## 🚀 Setup Instructions (Run Locally)

### Prerequisites
- [ ] Node.js 18+
- [ ] MongoDB Atlas account
- [ ] Freighter wallet extension
- [ ] Git

### Step 1 — Clone Repository
```bash
git clone https://github.com/parth1241/trustcert.git
cd trustcert
```

### Step 2 — Install Dependencies
```bash
npm install
```

### Step 3 — Configure Environment Variables
```bash
cp .env.example .env.local
```

### Step 4 — Set Up MongoDB Atlas
1. Visit https://cloud.mongodb.com and create a free M0 cluster.
2. Add a database user and allow network access (0.0.0.0/0).
3. Copy the driver connection string into `MONGODB_URI` in `.env.local`.

### Step 5 — Set Up Freighter Wallet
1. Install Freighter and switch to **Testnet**.
2. Fund your wallet at https://friendbot.stellar.org/?addr=YOUR_PUBLIC_KEY.

### Step 6 — Run Development Server
```bash
npm run dev
```

### Step 7 — Create Account + Connect Wallet
1. Visit http://localhost:3000/signup
2. After login, click "Connect Wallet" and approve in Freighter.

### Step 8 — Test a Transaction
1. Sign up as Issuer.
2. Certificates → Issue New Certificate.
3. Fill details and click "Publish to Stellar".
4. Approve in Freighter → transaction confirmed.

## 📁 Project Structure
```
/src
  /app
    /(auth)          → Login + signup pages
    /issuer          → Issuer dashboard
    /verify          → Public verification portal
    /api             → Next.js API routes
  /components
    /shared          → Reusable components
    /ui              → shadcn/ui components
  /lib
    db.ts            ← MongoDB connection
    stellar.ts       ← Stellar SDK functions
  /hooks
    useWallet.ts     ← Centralized wallet state
/middleware.ts       ← Route protection
```

## 🔒 Security
- Client-side signing via Freighter.
- No storage of private keys.
- Role-based access control via NextAuth middleware.

## 🌱 Deployment (Vercel)
1. Push to GitHub.
2. Import to Vercel and add environment variables.
3. Update `NEXTAUTH_URL` to your Vercel URL.

## 📝 Commit History
10+ meaningful commits following conventional format.

## 🏆 Hackathon
Built for the **Antigravity x Stellar Builder Track Belt Progression**.
- Level 1-4 Complete ✅

## 📄 License
MIT — see LICENSE file
