# TrailX Trading Platform

A modern trading platform built with React, TypeScript, and Tailwind CSS. Available as both a web app and native mobile app.

## Features

- Real-time market data and price updates
- Interactive candlestick charts with technical indicators
- Multi-asset support (Stocks, Forex, Crypto, Commodities, Indices)
- Order management (Market, Limit, Stop orders)
- Customizable watchlists and favorites
- Market thematics and curated lists
- Responsive design for desktop and mobile

## Tech Stack

- React 19
- TypeScript
- Tailwind CSS
- Vite
- Capacitor (for mobile apps)
- Radix UI components
- Lightweight Charts

## Development

### Web App

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

### Mobile App

```bash
# Build web assets
npm run build

# Sync with native projects
npx cap sync

# Open in Android Studio
npx cap open android

# Open in Xcode (macOS only)
npx cap open ios
```

## Project Structure

```
src/
├── components/
│   ├── instrument/     # Instrument detail views
│   ├── layout/         # Header, Sidebar
│   ├── modules/        # Markets, Quotes modules
│   └── ui/            # Reusable UI components
├── data/              # Mock data
├── store/             # State management
└── types/             # TypeScript types
```

## Mobile App Setup

The app uses Capacitor to create native iOS and Android apps from the web codebase.

### Android

1. Install [Android Studio](https://developer.android.com/studio)
2. Run `npm run build` to build web assets
3. Run `npx cap sync android` to sync with Android project
4. Run `npx cap open android` to open in Android Studio
5. Build and run from Android Studio

### iOS (macOS only)

1. Install [Xcode](https://developer.apple.com/xcode/)
2. Run `npm run build` to build web assets
3. Run `npx cap add ios` to add iOS platform
4. Run `npx cap sync ios` to sync with iOS project
5. Run `npx cap open ios` to open in Xcode
6. Build and run from Xcode

## License

MIT
