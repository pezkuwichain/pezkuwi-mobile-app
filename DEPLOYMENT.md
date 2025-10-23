# PezkuwiChain Mobile App - Deployment Guide

This guide explains how to build and deploy the PezkuwiChain mobile app to App Store and Play Store.

## 📋 Prerequisites

### Required Accounts

1. **Apple Developer Account** ($99/year)
   - Sign up at: https://developer.apple.com/programs/
   - Required for iOS App Store submission

2. **Google Play Developer Account** ($25 one-time)
   - Sign up at: https://play.google.com/console/signup
   - Required for Android Play Store submission

3. **Expo Account** (Free)
   - Sign up at: https://expo.dev/signup
   - Required for EAS Build

### Required Tools

```bash
# Install Expo CLI
npm install -g expo-cli

# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login
```

## 🚀 Build Process

### 1. Configure EAS Build

```bash
cd pezkuwi-mobile-app

# Initialize EAS
eas build:configure
```

This creates `eas.json`:

```json
{
  "cli": {
    "version": ">= 5.2.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {
      "android": {
        "buildType": "apk"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

### 2. Update app.json

Edit `app.json` with production values:

```json
{
  "expo": {
    "name": "PezkuwiChain",
    "slug": "pezkuwichain",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#F08080"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "io.pezkuwichain.mobile",
      "buildNumber": "1.0.0"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#F08080"
      },
      "package": "io.pezkuwichain.mobile",
      "versionCode": 1
    },
    "web": {
      "favicon": "./assets/favicon.png"
    }
  }
}
```

### 3. Prepare Assets

Create required assets:

```bash
# Icon (1024x1024 PNG)
# Place at: assets/icon.png

# Splash screen (1242x2436 PNG)
# Place at: assets/splash.png

# Adaptive icon (Android, 1024x1024 PNG)
# Place at: assets/adaptive-icon.png

# Favicon (48x48 PNG)
# Place at: assets/favicon.png
```

## 📱 iOS Build & Deployment

### Step 1: Build for iOS

```bash
# Production build
eas build --platform ios --profile production

# This will:
# 1. Upload your code to Expo servers
# 2. Build the app on Expo's infrastructure
# 3. Generate an .ipa file
# 4. Provide a download link
```

### Step 2: Submit to App Store

```bash
# Submit to App Store
eas submit --platform ios

# You'll be prompted for:
# - Apple ID
# - App-specific password
# - Bundle identifier
```

### Step 3: App Store Connect

1. Go to https://appstoreconnect.apple.com
2. Create a new app
3. Fill in app information:
   - **Name**: PezkuwiChain
   - **Primary Language**: English
   - **Bundle ID**: io.pezkuwichain.mobile
   - **SKU**: pezkuwichain-mobile

4. Upload screenshots (required sizes):
   - 6.5" Display: 1242 x 2688 pixels
   - 5.5" Display: 1242 x 2208 pixels

5. Fill in app description:

```
PezkuwiChain - Your Digital Citizenship Platform

The official mobile app for PezkuwiChain, the Kurdish digital citizenship platform built on blockchain technology.

Features:
• Manage HEZ and PEZ tokens
• Participate in democratic governance
• Digital identity verification
• Educational certificate management
• Trust score system
• Referral rewards program
• Merchant payment acceptance
• Token exchange

Building the future of Kurdish digital infrastructure.
```

6. Submit for review

### Step 4: App Review

- Review typically takes 1-3 days
- Monitor status in App Store Connect
- Respond to any reviewer questions

## 🤖 Android Build & Deployment

### Step 1: Build for Android

```bash
# Production build (APK)
eas build --platform android --profile production

# Or build AAB (recommended for Play Store)
eas build --platform android --profile production --type app-bundle
```

### Step 2: Submit to Play Store

```bash
# Submit to Play Store
eas submit --platform android

# You'll be prompted for:
# - Google Service Account JSON key
# - Package name
```

### Step 3: Google Play Console

1. Go to https://play.google.com/console
2. Create a new app
3. Fill in app information:
   - **App name**: PezkuwiChain
   - **Default language**: English
   - **App or game**: App
   - **Free or paid**: Free

4. Upload screenshots (required):
   - Phone: 1080 x 1920 pixels (minimum 2)
   - 7-inch tablet: 1024 x 1920 pixels (optional)
   - 10-inch tablet: 2048 x 3072 pixels (optional)

5. Fill in store listing:

**Short description** (80 characters):
```
Kurdish digital citizenship platform. Manage tokens, vote, verify identity.
```

**Full description** (4000 characters):
```
PezkuwiChain - Your Digital Citizenship Platform

The official mobile app for PezkuwiChain, the Kurdish digital citizenship platform built on blockchain technology.

🌟 KEY FEATURES

💰 Dual-Token Wallet
• Manage HEZ (The People's Currency)
• Manage PEZ (Governance Token)
• Send and receive tokens
• Stake HEZ for rewards
• View transaction history

🗳️ Democratic Governance (Welati)
• Vote on community proposals
• Create new proposals
• Track voting results
• Participate in decision-making
• Parliamentary NFT system

🆔 Digital Identity
• KYC-verified digital citizenship
• Trust score system
• Secure identity verification
• QR code for easy sharing

🎓 Education (Perwerde)
• Manage educational certificates
• Blockchain-verified credentials
• Share certificates securely
• NFT-based diplomas

🎁 Referral Program
• Earn PEZ by inviting friends
• Track referral statistics
• Monthly rewards
• Build your network

💼 Business Hub
• Accept HEZ/PEZ payments
• Generate invoices
• Track revenue
• Merchant dashboard

🔄 Token Exchange
• Swap HEZ ↔ PEZ
• Real-time exchange rates
• Low fees
• Instant transactions

🔐 SECURITY
• Private keys stored securely
• Biometric authentication
• Transaction confirmation
• Open-source codebase

🌍 MULTI-LANGUAGE SUPPORT
• English
• Kurdish (Kurmanji)
• Kurdish (Sorani)
• Turkish
• Arabic
• Persian

📱 ABOUT PEZKUWICHAIN

PezkuwiChain is a Layer 1 blockchain built with Substrate/Polkadot SDK, designed specifically for the Kurdish digital ecosystem. Our mission is to provide digital citizenship, governance, and economic infrastructure for the Kurdish people worldwide.

🔗 TECHNOLOGY
• Built on Substrate framework
• Trust-enhanced Nominated Proof-of-Stake (TNPoS) consensus
• BABE block production
• GRANDPA finality
• WebAssembly smart contracts

📞 CONTACT
• Website: https://www.pezkuwichain.io
• Email: support@pezkuwichain.io
• GitHub: https://github.com/pezkuwichain

Building the future of Kurdish digital infrastructure 🌟
```

6. Content rating questionnaire
7. Submit for review

### Step 4: App Review

- Review typically takes 1-7 days
- Monitor status in Play Console
- Respond to any reviewer questions

## 🔄 Update Process

### Version Bump

1. Update version in `app.json`:

```json
{
  "expo": {
    "version": "1.0.1",
    "ios": {
      "buildNumber": "1.0.1"
    },
    "android": {
      "versionCode": 2
    }
  }
}
```

2. Commit changes:

```bash
git add app.json
git commit -m "Bump version to 1.0.1"
git push
```

3. Build and submit:

```bash
# iOS
eas build --platform ios --profile production
eas submit --platform ios

# Android
eas build --platform android --profile production
eas submit --platform android
```

## 🧪 Testing Builds

### Internal Testing (TestFlight for iOS)

```bash
# Build for internal testing
eas build --platform ios --profile preview

# Invite testers in App Store Connect
```

### Internal Testing (Play Store)

```bash
# Build for internal testing
eas build --platform android --profile preview

# Create internal testing track in Play Console
# Upload build and invite testers
```

## 📊 Analytics & Monitoring

### Recommended Services

1. **Sentry** (Error tracking)
   ```bash
   npm install @sentry/react-native
   ```

2. **Firebase Analytics**
   ```bash
   expo install @react-native-firebase/app @react-native-firebase/analytics
   ```

3. **Amplitude** (User analytics)
   ```bash
   npm install @amplitude/analytics-react-native
   ```

## 🔐 Environment Variables

Create `.env` for sensitive data:

```bash
# .env
TESTNET_RPC_URL=wss://testnet-rpc.pezkuwichain.io
MAINNET_RPC_URL=wss://mainnet-rpc.pezkuwichain.io
SENTRY_DSN=your_sentry_dsn
AMPLITUDE_API_KEY=your_amplitude_key
```

Add to `.gitignore`:
```
.env
.env.local
```

## 📝 Checklist Before Submission

### iOS

- [ ] App icon (1024x1024)
- [ ] Splash screen
- [ ] Screenshots (all required sizes)
- [ ] App description
- [ ] Keywords
- [ ] Support URL
- [ ] Privacy policy URL
- [ ] Age rating
- [ ] Test on real device
- [ ] Check for crashes
- [ ] Verify all features work

### Android

- [ ] App icon
- [ ] Feature graphic (1024x500)
- [ ] Screenshots (all required sizes)
- [ ] Short description
- [ ] Full description
- [ ] Privacy policy URL
- [ ] Content rating
- [ ] Test on real device
- [ ] Check for crashes
- [ ] Verify all features work

## 🚨 Common Issues

### iOS

**Issue**: "Missing compliance"
**Solution**: Add to `app.json`:
```json
{
  "expo": {
    "ios": {
      "config": {
        "usesNonExemptEncryption": false
      }
    }
  }
}
```

**Issue**: "Invalid bundle identifier"
**Solution**: Ensure bundle ID matches in app.json and Apple Developer account

### Android

**Issue**: "Package name already exists"
**Solution**: Use unique package name: `io.pezkuwichain.mobile`

**Issue**: "Missing permissions"
**Solution**: Add required permissions to `app.json`:
```json
{
  "expo": {
    "android": {
      "permissions": [
        "CAMERA",
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE"
      ]
    }
  }
}
```

## 📞 Support

If you encounter issues:

1. Check Expo documentation: https://docs.expo.dev
2. EAS Build documentation: https://docs.expo.dev/build/introduction/
3. Contact: dev@pezkuwichain.io

## 🎉 Launch Checklist

- [ ] App submitted to App Store
- [ ] App submitted to Play Store
- [ ] Press release prepared
- [ ] Social media posts scheduled
- [ ] Website updated
- [ ] Email to users sent
- [ ] Monitor reviews
- [ ] Respond to user feedback
- [ ] Track analytics
- [ ] Plan next update

---

**Good luck with your launch! 🚀**

Building the future of Kurdish digital infrastructure 🌟

