# TrustCert — Decentralized Institutional Registry

TrustCert is a high-fidelity academic credentialing platform built on the **Stellar Blockchain** and **Next.js 14**. It provides institutions with an immutable command center for issuing, verifying, and managing professional certifications.

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js** 18.x or later
- **MongoDB Atlas** account
- **Freighter Wallet** extension (for institutional signing)

### 2. Installation
```bash
git clone https://github.com/your-username/trustcert.git
cd trustcert
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory:
```env
# Database & Auth
MONGODB_URI=mongodb+srv://...
NEXTAUTH_SECRET=your_secret_hash
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Stellar Configuration
NEXT_PUBLIC_STELLAR_NETWORK=testnet
NEXT_PUBLIC_HORIZON_URL=https://horizon-testnet.stellar.org

# Optional
ENABLE_ANALYTICS=true
```

### 4. Run Development Server
```bash
npm run dev
```

## 🛠️ Key Features

- **Stellar Settlement**: All credentials are hash-settled on the Stellar ledger via `ManageData` operations.
- **Institutional Command Center**: Real-time analytics, verification trends, and geographic insights.
- **Headless API**: Public endpoints (`/api/v1/verify`) with CORS support for third-party HR portals.
- **Phishing Protection**: High-fidelity coordination between registered domains and verification hostnames.
- **Master Registry**: A searchable, indexed ledger of all issued and revoked credentials.

## 🔒 Security & Performance

- **Zero-Emerald Branding**: Strict Indigo/Violet/Fuchsia visual system with 3001v-Enrolled coordination.
- **Hashed API Keys**: Institutional secret keys are SHA-256 hashed on the identity registry.
- **Optimized Indexing**: MongoDB text indexes on recipient names and unique indexes on certificate IDs.
- **HSTS & CSP**: Hardened production headers enforced via `vercel.json`.

## 🌐 Blockchain Integration

TrustCert uses the **Stellar Testnet** for alpha development.
- **Institution Account**: Create an account on the [Stellar Laboratory](https://laboratory.stellar.org/#account-creator?network=testnet) and fund it via **Friendbot**.
- **Signing**: All administrative actions (Issuance/Revocation) require a cryptographic signature from the institution's primary wallet.

---


