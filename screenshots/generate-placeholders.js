#!/usr/bin/env node
/**
 * Generates SVG placeholder images for README screenshots
 * Run: node screenshots/generate-placeholders.js
 * Then replace with real screenshots after running the app
 */

const fs = require('fs')
const path = require('path')

const APP_NAME = process.env.APP_NAME || 'TrustCert'
const PRIMARY_COLOR = process.env.PRIMARY_COLOR || '#f59e0b'
const BG_COLOR = '#0d0d1f'
const TEXT_COLOR = '#94a3b8'

const placeholders = [
  {
    filename: 'desktop/01-landing.png',
    label: 'Landing Page',
    sublabel: 'Replace with real screenshot',
    width: 1280,
    height: 720
  },
  {
    filename: 'desktop/02-wallet-connected.png',
    label: 'Wallet Connected + Balance',
    sublabel: 'Freighter connected • XLM balance shown • Stellar Testnet',
    width: 1280,
    height: 400
  },
  {
    filename: 'desktop/03-dashboard.png',
    label: 'Dashboard Overview',
    sublabel: 'Stats • Charts • Navigation',
    width: 1280,
    height: 720
  },
  {
    filename: 'desktop/04-transaction-success.png',
    label: 'Transaction Confirmed',
    sublabel: 'txHash • Amount • Balance • Stellar Expert link',
    width: 600,
    height: 700
  },
  {
    filename: 'desktop/05-mobile-view.png',
    label: 'Mobile Responsive (375px)',
    sublabel: 'iPhone SE • Fully responsive',
    width: 375,
    height: 812
  },
  {
    filename: 'desktop/06-ci-pipeline.png',
    label: 'CI/CD Pipeline',
    sublabel: 'GitHub Actions • All checks passing',
    width: 1280,
    height: 500
  },
  {
    filename: 'mobile/01-landing-mobile.png',
    label: 'Mobile Landing',
    sublabel: '375px width',
    width: 375,
    height: 812
  },
  {
    filename: 'mobile/02-dashboard-mobile.png',
    label: 'Mobile Dashboard',
    sublabel: '375px width',
    width: 375,
    height: 812
  },
  {
    filename: 'mobile/03-vote-or-action-mobile.png',
    label: 'Mobile Action',
    sublabel: '375px width',
    width: 375,
    height: 812
  }
]

// Create directories
const dirs = ['desktop', 'mobile']
dirs.forEach(dir => {
  const dirPath = path.join(__dirname, dir)
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
    console.log(`Created: screenshots/${dir}/`)
  }
})

// Generate SVG placeholders
placeholders.forEach(({ filename, label, sublabel, width, height }) => {
  const svg = `<svg width="${width}" height="${height}" 
    viewBox="0 0 ${width} ${height}" 
    xmlns="http://www.w3.org/2000/svg">
    
    <!-- Background -->
    <rect width="${width}" height="${height}" fill="${BG_COLOR}"/>
    
    <!-- Border -->
    <rect width="${width}" height="${height}" 
      fill="none" 
      stroke="${PRIMARY_COLOR}" 
      stroke-width="2" 
      stroke-opacity="0.3"/>
    
    <!-- Center content -->
    <text 
      x="${width / 2}" 
      y="${height / 2 - 40}"
      text-anchor="middle" 
      font-family="monospace" 
      font-size="18" 
      fill="${PRIMARY_COLOR}"
      font-weight="bold">
      ${APP_NAME}
    </text>
    
    <text 
      x="${width / 2}" 
      y="${height / 2}"
      text-anchor="middle" 
      font-family="monospace" 
      font-size="14" 
      fill="${TEXT_COLOR}">
      ${label}
    </text>
    
    <text 
      x="${width / 2}" 
      y="${height / 2 + 30}"
      text-anchor="middle" 
      font-family="monospace" 
      font-size="11" 
      fill="${TEXT_COLOR}"
      opacity="0.6">
      ${sublabel}
    </text>
    
    <text 
      x="${width / 2}" 
      y="${height / 2 + 70}"
      text-anchor="middle" 
      font-family="monospace" 
      font-size="11" 
      fill="${PRIMARY_COLOR}"
      opacity="0.5">
      Replace with real screenshot after running app
    </text>
    
    <!-- Dimensions label -->
    <text 
      x="${width - 10}" 
      y="${height - 10}"
      text-anchor="end" 
      font-family="monospace" 
      font-size="10" 
      fill="${TEXT_COLOR}"
      opacity="0.4">
      ${width}×${height}
    </text>
  </svg>`

  // Save as .svg first
  const svgPath = path.join(
    __dirname, 
    filename.replace('.png', '.svg')
  )
  fs.writeFileSync(svgPath, svg)
  console.log(`Generated: screenshots/${filename.replace('.png', '.svg')}`)
})

console.log('\n✅ Placeholder images generated!')
console.log('\n📝 Next steps:')
console.log('1. Run the app: npm run dev')
console.log('2. Visit: http://localhost:3000/screenshots')
console.log('3. Take real screenshots and save to screenshots/ folder')
console.log('4. Replace .svg placeholders with real .png screenshots')
console.log('5. Update README.md image paths if needed')
