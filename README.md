# PezkuwiChain Mobile App

Official mobile application for PezkuwiChain - The Kurdish Digital Citizenship Platform.

## 🚀 Features

- **Dual-Token Wallet**: Manage HEZ and PEZ tokens
- **Governance (Welati)**: Vote on proposals and participate in democratic decision-making
- **Digital Identity**: KYC-verified digital citizenship
- **Education (Perwerde)**: Manage and verify educational certificates
- **Trust System**: Build and track your trust score
- **Parliamentary NFTs**: For elected digital parliament members
- **Referral Program**: Earn rewards by inviting others
- **Business Hub**: Accept payments and manage merchant operations
- **Exchange**: Swap between HEZ and PEZ tokens

## 📱 Tech Stack

- **Framework**: React Native (Expo)
- **Language**: TypeScript
- **Navigation**: React Navigation
- **Blockchain**: Polkadot.js API
- **State Management**: React Hooks
- **Styling**: StyleSheet (React Native)

## 🛠️ Installation

### Prerequisites

- Node.js 18+ and npm/yarn
- Expo CLI: `npm install -g expo-cli`
- iOS Simulator (Mac) or Android Emulator

### Setup

```bash
# Clone the repository
git clone https://github.com/pezkuwichain/pezkuwi-mobile-app.git
cd pezkuwi-mobile-app

# Install dependencies
npm install

# Start the development server
npm start
```

### Running on Device

#### iOS
```bash
npm run ios
```

#### Android
```bash
npm run android
```

#### Web
```bash
npm run web
```

### Using Expo Go App

1. Install Expo Go on your phone:
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. Start the development server:
   ```bash
   npm start
   ```

3. Scan the QR code with:
   - **iOS**: Camera app
   - **Android**: Expo Go app

## 🔗 Blockchain Configuration

The app connects to PezkuwiChain nodes:

- **Testnet**: `wss://testnet-rpc.pezkuwichain.io`
- **Mainnet**: `wss://mainnet-rpc.pezkuwichain.io`

Configuration can be changed in `src/constants/blockchain.ts`.

## 📂 Project Structure

```
pezkuwi-mobile-app/
├── src/
│   ├── screens/          # Screen components
│   │   ├── Auth/         # Authentication screens
│   │   ├── Home/         # Home dashboard
│   │   ├── Wallet/       # Wallet management
│   │   ├── Governance/   # Welati governance
│   │   ├── Identity/     # Digital identity
│   │   ├── Education/    # Perwerde certificates
│   │   ├── Profile/      # User profile
│   │   ├── Referral/     # Referral program
│   │   ├── Business/     # Merchant hub
│   │   └── Exchange/     # Token swap
│   ├── components/       # Reusable components
│   ├── navigation/       # Navigation configuration
│   ├── services/         # Blockchain and API services
│   ├── constants/        # Colors, theme, blockchain config
│   ├── types/            # TypeScript type definitions
│   ├── hooks/            # Custom React hooks
│   └── utils/            # Utility functions
├── assets/               # Images, fonts, etc.
├── App.tsx               # Root component
└── package.json          # Dependencies
```

## 🎨 Design System

### Colors

The app uses a soft, elegant Kurdish-inspired color palette:

- **Coral** (#F08080): Primary actions, Home
- **Mint** (#98D8C8): Governance, Vote
- **Gold** (#E8C896): Trust score, Parliamentary
- **Peach** (#F5B895): Create, Update actions
- **Teal** (#7DD3C0): Identity, Receive
- **Lavender** (#C8B6D6): Education, Stake

### Typography

- **Font Sizes**: 10px (tiny) to 40px (hero)
- **Font Weights**: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

### Spacing

- **xs**: 4px
- **sm**: 8px
- **md**: 12px
- **lg**: 16px
- **xl**: 20px
- **xxl**: 24px
- **xxxl**: 32px

## 🔐 Security

- Private keys are stored securely using Expo SecureStore
- All transactions require user confirmation
- Biometric authentication support (coming soon)

## 🌍 Internationalization

Supported languages:
- English
- Kurdish (Kurmanji)
- Kurdish (Sorani)
- Turkish
- Arabic
- Persian

## 📦 Building for Production

### iOS

```bash
# Build for App Store
eas build --platform ios

# Submit to App Store
eas submit --platform ios
```

### Android

```bash
# Build for Play Store
eas build --platform android

# Submit to Play Store
eas submit --platform android
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 📝 License

MIT License - see LICENSE file for details

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) first.

## 📞 Contact & Social Media

### Official Links

- **Website**: https://pezkuwichain.org
- **GitHub**: https://github.com/pezkuwichain
- **Documentation**: https://docs.pezkuwichain.org
- **Email**: info@pezkuwichain.io

### Social Media

- **Twitter/X**: https://x.com/PezkuwiChain (Kurdistan Tech Ministry)
- **YouTube**: https://www.youtube.com/@SatoshiQazi (DKSpezkuwichain_Kurdistan)
- **Telegram Bot**: https://t.me/pezkuwichainbot
- **Telegram Channel**: https://t.me/PezkuwiApp
- **Discord**: DKSPezkuwichain (Username: kurdistan_tech_ministry)
- **Facebook**: Satoshi Qazi Muhammed

## 🙏 Acknowledgments

- Built with [Expo](https://expo.dev/)
- Blockchain integration via [Polkadot.js](https://polkadot.js.org/)
- Icons by [Ionicons](https://ionic.io/ionicons)

---

**Version**: 1.0.0  
**Last Updated**: October 23, 2025  
**Status**: Beta

🌟 Building the future of Kurdish digital infrastructure

