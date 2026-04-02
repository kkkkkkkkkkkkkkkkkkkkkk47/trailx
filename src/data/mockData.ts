// TrailX Trading Platform - Mock Data

import type {
  Security,
  MarketThematic,
  OHLCData,
  Session,
  PriceStats,
  CompanyProfile,
  Financials,
  Highlight,
  Order,
  Position,
} from '@/types';
import { AssetCategory, OrderSide, OrderType, OrderStatus, Timeframe, IndicatorType } from '@/types';

// ============================================
// Helper Functions
// ============================================

const generatePriceStats = (basePrice: number): PriceStats => {
  const change = (Math.random() - 0.5) * basePrice * 0.05;
  const changePercent = (change / basePrice) * 100;
  const high = basePrice * (1 + Math.random() * 0.03);
  const low = basePrice * (1 - Math.random() * 0.03);
  
  return {
    bid: basePrice - 0.01,
    bidHigh: high - 0.01,
    bidLow: low - 0.01,
    ask: basePrice + 0.01,
    askHigh: high + 0.01,
    askLow: low + 0.01,
    open: basePrice - change * 0.3,
    close: basePrice,
    high,
    low,
    volume: Math.floor(Math.random() * 10000000),
    change,
    changePercent,
  };
};

const generateSessions = (): { quoteSessions: Session[]; tradeSessions: Session[] } => ({
  quoteSessions: [
    {
      id: 'qs1',
      name: 'Pre-Market',
      startTime: '04:00',
      endTime: '09:30',
      days: [1, 2, 3, 4, 5],
      isActive: true,
    },
    {
      id: 'qs2',
      name: 'Regular Hours',
      startTime: '09:30',
      endTime: '16:00',
      days: [1, 2, 3, 4, 5],
      isActive: true,
    },
    {
      id: 'qs3',
      name: 'After Hours',
      startTime: '16:00',
      endTime: '20:00',
      days: [1, 2, 3, 4, 5],
      isActive: true,
    },
  ],
  tradeSessions: [
    {
      id: 'ts1',
      name: 'Regular Trading',
      startTime: '09:30',
      endTime: '16:00',
      days: [1, 2, 3, 4, 5],
      isActive: true,
    },
  ],
});

const generateCompanyProfile = (name: string, sector: string): CompanyProfile => ({
  description: `${name} is a leading company in the ${sector} sector, providing innovative solutions and services to customers worldwide. With a strong focus on technology and customer satisfaction, the company continues to expand its market presence.`,
  sector,
  industry: `${sector} - Technology`,
  employees: Math.floor(Math.random() * 100000) + 1000,
  headquarters: 'United States',
  website: `https://www.${name.toLowerCase().replace(/\s+/g, '')}.com`,
  ceo: 'John Smith',
  founded: 1980 + Math.floor(Math.random() * 40),
  marketCap: Math.floor(Math.random() * 2000000000000),
  peRatio: 15 + Math.random() * 30,
  dividendYield: Math.random() * 0.05,
});

const generateFinancials = (): Financials => ({
  revenue: Math.floor(Math.random() * 500000000000),
  netIncome: Math.floor(Math.random() * 50000000000),
  totalAssets: Math.floor(Math.random() * 1000000000000),
  totalDebt: Math.floor(Math.random() * 200000000000),
  cashFlow: Math.floor(Math.random() * 30000000000),
  grossMargin: 30 + Math.random() * 40,
  operatingMargin: 10 + Math.random() * 25,
  profitMargin: 5 + Math.random() * 20,
  roe: 5 + Math.random() * 25,
  roa: 3 + Math.random() * 15,
});

const generateHighlights = (category: AssetCategory): Highlight[] => {
  const highlights: Highlight[] = [
    { label: '52W High', value: '$' + (100 + Math.random() * 200).toFixed(2), trend: 'up' },
    { label: '52W Low', value: '$' + (50 + Math.random() * 50).toFixed(2), trend: 'down' },
    { label: 'Avg Volume', value: (Math.floor(Math.random() * 50) + 10) + 'M', trend: 'neutral' },
    { label: 'Beta', value: (0.5 + Math.random() * 1.5).toFixed(2), trend: 'neutral' },
  ];
  
  if (category === AssetCategory.STOCKS) {
    highlights.push(
      { label: 'EPS', value: '$' + (2 + Math.random() * 10).toFixed(2), trend: 'up' },
      { label: 'Dividend', value: '$' + (Math.random() * 5).toFixed(2), trend: 'neutral' }
    );
  }
  
  return highlights;
};

// ============================================
// Stocks Data
// ============================================

export const stocks: Security[] = [
  {
    id: 'AAPL',
    symbol: 'AAPL',
    name: 'Apple Inc.',
    category: AssetCategory.STOCKS,
    subCategory: 'Technology',
    exchange: 'NASDAQ',
    currency: 'USD',
    priceStats: generatePriceStats(178.35),
    sessions: generateSessions(),
    companyProfile: generateCompanyProfile('Apple Inc.', 'Technology'),
    financials: generateFinancials(),
    highlights: generateHighlights(AssetCategory.STOCKS),
    isFavorite: true,
  },
  {
    id: 'MSFT',
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    category: AssetCategory.STOCKS,
    subCategory: 'Technology',
    exchange: 'NASDAQ',
    currency: 'USD',
    priceStats: generatePriceStats(412.58),
    sessions: generateSessions(),
    companyProfile: generateCompanyProfile('Microsoft Corporation', 'Technology'),
    financials: generateFinancials(),
    highlights: generateHighlights(AssetCategory.STOCKS),
    isFavorite: true,
  },
  {
    id: 'GOOGL',
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    category: AssetCategory.STOCKS,
    subCategory: 'Technology',
    exchange: 'NASDAQ',
    currency: 'USD',
    priceStats: generatePriceStats(165.42),
    sessions: generateSessions(),
    companyProfile: generateCompanyProfile('Alphabet Inc.', 'Technology'),
    financials: generateFinancials(),
    highlights: generateHighlights(AssetCategory.STOCKS),
    isFavorite: false,
  },
  {
    id: 'AMZN',
    symbol: 'AMZN',
    name: 'Amazon.com Inc.',
    category: AssetCategory.STOCKS,
    subCategory: 'Consumer Discretionary',
    exchange: 'NASDAQ',
    currency: 'USD',
    priceStats: generatePriceStats(185.20),
    sessions: generateSessions(),
    companyProfile: generateCompanyProfile('Amazon.com Inc.', 'Consumer Discretionary'),
    financials: generateFinancials(),
    highlights: generateHighlights(AssetCategory.STOCKS),
    isFavorite: true,
  },
  {
    id: 'TSLA',
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    category: AssetCategory.STOCKS,
    subCategory: 'Automotive',
    exchange: 'NASDAQ',
    currency: 'USD',
    priceStats: generatePriceStats(242.15),
    sessions: generateSessions(),
    companyProfile: generateCompanyProfile('Tesla Inc.', 'Automotive'),
    financials: generateFinancials(),
    highlights: generateHighlights(AssetCategory.STOCKS),
    isFavorite: false,
  },
  {
    id: 'NVDA',
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    category: AssetCategory.STOCKS,
    subCategory: 'Semiconductors',
    exchange: 'NASDAQ',
    currency: 'USD',
    priceStats: generatePriceStats(875.35),
    sessions: generateSessions(),
    companyProfile: generateCompanyProfile('NVIDIA Corporation', 'Semiconductors'),
    financials: generateFinancials(),
    highlights: generateHighlights(AssetCategory.STOCKS),
    isFavorite: true,
  },
  {
    id: 'META',
    symbol: 'META',
    name: 'Meta Platforms Inc.',
    category: AssetCategory.STOCKS,
    subCategory: 'Technology',
    exchange: 'NASDAQ',
    currency: 'USD',
    priceStats: generatePriceStats(498.75),
    sessions: generateSessions(),
    companyProfile: generateCompanyProfile('Meta Platforms Inc.', 'Technology'),
    financials: generateFinancials(),
    highlights: generateHighlights(AssetCategory.STOCKS),
    isFavorite: false,
  },
  {
    id: 'JPM',
    symbol: 'JPM',
    name: 'JPMorgan Chase & Co.',
    category: AssetCategory.STOCKS,
    subCategory: 'Financials',
    exchange: 'NYSE',
    currency: 'USD',
    priceStats: generatePriceStats(195.42),
    sessions: generateSessions(),
    companyProfile: generateCompanyProfile('JPMorgan Chase & Co.', 'Financials'),
    financials: generateFinancials(),
    highlights: generateHighlights(AssetCategory.STOCKS),
    isFavorite: false,
  },
  {
    id: 'JNJ',
    symbol: 'JNJ',
    name: 'Johnson & Johnson',
    category: AssetCategory.STOCKS,
    subCategory: 'Healthcare',
    exchange: 'NYSE',
    currency: 'USD',
    priceStats: generatePriceStats(152.80),
    sessions: generateSessions(),
    companyProfile: generateCompanyProfile('Johnson & Johnson', 'Healthcare'),
    financials: generateFinancials(),
    highlights: generateHighlights(AssetCategory.STOCKS),
    isFavorite: false,
  },
  {
    id: 'V',
    symbol: 'V',
    name: 'Visa Inc.',
    category: AssetCategory.STOCKS,
    subCategory: 'Financials',
    exchange: 'NYSE',
    currency: 'USD',
    priceStats: generatePriceStats(278.95),
    sessions: generateSessions(),
    companyProfile: generateCompanyProfile('Visa Inc.', 'Financials'),
    financials: generateFinancials(),
    highlights: generateHighlights(AssetCategory.STOCKS),
    isFavorite: false,
  },
];

// ============================================
// Forex Data
// ============================================

export const forexPairs: Security[] = [
  {
    id: 'EURUSD',
    symbol: 'EURUSD',
    name: 'EUR/USD',
    category: AssetCategory.FOREX,
    subCategory: 'Major',
    exchange: 'FOREX',
    currency: 'USD',
    priceStats: generatePriceStats(1.0845),
    sessions: {
      quoteSessions: [
        { id: 'fx1', name: 'Sydney', startTime: '22:00', endTime: '07:00', days: [1, 2, 3, 4, 5], isActive: true },
        { id: 'fx2', name: 'Tokyo', startTime: '00:00', endTime: '09:00', days: [1, 2, 3, 4, 5], isActive: true },
        { id: 'fx3', name: 'London', startTime: '08:00', endTime: '17:00', days: [1, 2, 3, 4, 5], isActive: true },
        { id: 'fx4', name: 'New York', startTime: '13:00', endTime: '22:00', days: [1, 2, 3, 4, 5], isActive: true },
      ],
      tradeSessions: [
        { id: 'fx-trade', name: '24H Trading', startTime: '00:00', endTime: '23:59', days: [1, 2, 3, 4, 5], isActive: true },
      ],
    },
    highlights: generateHighlights(AssetCategory.FOREX),
    isFavorite: true,
  },
  {
    id: 'GBPUSD',
    symbol: 'GBPUSD',
    name: 'GBP/USD',
    category: AssetCategory.FOREX,
    subCategory: 'Major',
    exchange: 'FOREX',
    currency: 'USD',
    priceStats: generatePriceStats(1.2650),
    sessions: {
      quoteSessions: [
        { id: 'fx1', name: 'Sydney', startTime: '22:00', endTime: '07:00', days: [1, 2, 3, 4, 5], isActive: true },
        { id: 'fx2', name: 'Tokyo', startTime: '00:00', endTime: '09:00', days: [1, 2, 3, 4, 5], isActive: true },
        { id: 'fx3', name: 'London', startTime: '08:00', endTime: '17:00', days: [1, 2, 3, 4, 5], isActive: true },
        { id: 'fx4', name: 'New York', startTime: '13:00', endTime: '22:00', days: [1, 2, 3, 4, 5], isActive: true },
      ],
      tradeSessions: [
        { id: 'fx-trade', name: '24H Trading', startTime: '00:00', endTime: '23:59', days: [1, 2, 3, 4, 5], isActive: true },
      ],
    },
    highlights: generateHighlights(AssetCategory.FOREX),
    isFavorite: false,
  },
  {
    id: 'USDJPY',
    symbol: 'USDJPY',
    name: 'USD/JPY',
    category: AssetCategory.FOREX,
    subCategory: 'Major',
    exchange: 'FOREX',
    currency: 'JPY',
    priceStats: generatePriceStats(151.75),
    sessions: {
      quoteSessions: [
        { id: 'fx1', name: 'Sydney', startTime: '22:00', endTime: '07:00', days: [1, 2, 3, 4, 5], isActive: true },
        { id: 'fx2', name: 'Tokyo', startTime: '00:00', endTime: '09:00', days: [1, 2, 3, 4, 5], isActive: true },
        { id: 'fx3', name: 'London', startTime: '08:00', endTime: '17:00', days: [1, 2, 3, 4, 5], isActive: true },
        { id: 'fx4', name: 'New York', startTime: '13:00', endTime: '22:00', days: [1, 2, 3, 4, 5], isActive: true },
      ],
      tradeSessions: [
        { id: 'fx-trade', name: '24H Trading', startTime: '00:00', endTime: '23:59', days: [1, 2, 3, 4, 5], isActive: true },
      ],
    },
    highlights: generateHighlights(AssetCategory.FOREX),
    isFavorite: true,
  },
  {
    id: 'USDCHF',
    symbol: 'USDCHF',
    name: 'USD/CHF',
    category: AssetCategory.FOREX,
    subCategory: 'Major',
    exchange: 'FOREX',
    currency: 'CHF',
    priceStats: generatePriceStats(0.9050),
    sessions: {
      quoteSessions: [
        { id: 'fx1', name: 'Sydney', startTime: '22:00', endTime: '07:00', days: [1, 2, 3, 4, 5], isActive: true },
        { id: 'fx2', name: 'Tokyo', startTime: '00:00', endTime: '09:00', days: [1, 2, 3, 4, 5], isActive: true },
        { id: 'fx3', name: 'London', startTime: '08:00', endTime: '17:00', days: [1, 2, 3, 4, 5], isActive: true },
        { id: 'fx4', name: 'New York', startTime: '13:00', endTime: '22:00', days: [1, 2, 3, 4, 5], isActive: true },
      ],
      tradeSessions: [
        { id: 'fx-trade', name: '24H Trading', startTime: '00:00', endTime: '23:59', days: [1, 2, 3, 4, 5], isActive: true },
      ],
    },
    highlights: generateHighlights(AssetCategory.FOREX),
    isFavorite: false,
  },
  {
    id: 'AUDUSD',
    symbol: 'AUDUSD',
    name: 'AUD/USD',
    category: AssetCategory.FOREX,
    subCategory: 'Major',
    exchange: 'FOREX',
    currency: 'USD',
    priceStats: generatePriceStats(0.6540),
    sessions: {
      quoteSessions: [
        { id: 'fx1', name: 'Sydney', startTime: '22:00', endTime: '07:00', days: [1, 2, 3, 4, 5], isActive: true },
        { id: 'fx2', name: 'Tokyo', startTime: '00:00', endTime: '09:00', days: [1, 2, 3, 4, 5], isActive: true },
        { id: 'fx3', name: 'London', startTime: '08:00', endTime: '17:00', days: [1, 2, 3, 4, 5], isActive: true },
        { id: 'fx4', name: 'New York', startTime: '13:00', endTime: '22:00', days: [1, 2, 3, 4, 5], isActive: true },
      ],
      tradeSessions: [
        { id: 'fx-trade', name: '24H Trading', startTime: '00:00', endTime: '23:59', days: [1, 2, 3, 4, 5], isActive: true },
      ],
    },
    highlights: generateHighlights(AssetCategory.FOREX),
    isFavorite: false,
  },
];

// ============================================
// Crypto Data
// ============================================

export const crypto: Security[] = [
  {
    id: 'BTCUSD',
    symbol: 'BTCUSD',
    name: 'Bitcoin',
    category: AssetCategory.CRYPTO,
    subCategory: 'Major',
    exchange: 'CRYPTO',
    currency: 'USD',
    priceStats: generatePriceStats(67250.00),
    sessions: {
      quoteSessions: [
        { id: 'crypto1', name: '24/7 Market', startTime: '00:00', endTime: '23:59', days: [0, 1, 2, 3, 4, 5, 6], isActive: true },
      ],
      tradeSessions: [
        { id: 'crypto-trade', name: '24/7 Trading', startTime: '00:00', endTime: '23:59', days: [0, 1, 2, 3, 4, 5, 6], isActive: true },
      ],
    },
    highlights: generateHighlights(AssetCategory.CRYPTO),
    isFavorite: true,
  },
  {
    id: 'ETHUSD',
    symbol: 'ETHUSD',
    name: 'Ethereum',
    category: AssetCategory.CRYPTO,
    subCategory: 'Major',
    exchange: 'CRYPTO',
    currency: 'USD',
    priceStats: generatePriceStats(3520.50),
    sessions: {
      quoteSessions: [
        { id: 'crypto1', name: '24/7 Market', startTime: '00:00', endTime: '23:59', days: [0, 1, 2, 3, 4, 5, 6], isActive: true },
      ],
      tradeSessions: [
        { id: 'crypto-trade', name: '24/7 Trading', startTime: '00:00', endTime: '23:59', days: [0, 1, 2, 3, 4, 5, 6], isActive: true },
      ],
    },
    highlights: generateHighlights(AssetCategory.CRYPTO),
    isFavorite: true,
  },
  {
    id: 'SOLUSD',
    symbol: 'SOLUSD',
    name: 'Solana',
    category: AssetCategory.CRYPTO,
    subCategory: 'Altcoin',
    exchange: 'CRYPTO',
    currency: 'USD',
    priceStats: generatePriceStats(185.25),
    sessions: {
      quoteSessions: [
        { id: 'crypto1', name: '24/7 Market', startTime: '00:00', endTime: '23:59', days: [0, 1, 2, 3, 4, 5, 6], isActive: true },
      ],
      tradeSessions: [
        { id: 'crypto-trade', name: '24/7 Trading', startTime: '00:00', endTime: '23:59', days: [0, 1, 2, 3, 4, 5, 6], isActive: true },
      ],
    },
    highlights: generateHighlights(AssetCategory.CRYPTO),
    isFavorite: false,
  },
  {
    id: 'XRPUSD',
    symbol: 'XRPUSD',
    name: 'Ripple',
    category: AssetCategory.CRYPTO,
    subCategory: 'Altcoin',
    exchange: 'CRYPTO',
    currency: 'USD',
    priceStats: generatePriceStats(0.62),
    sessions: {
      quoteSessions: [
        { id: 'crypto1', name: '24/7 Market', startTime: '00:00', endTime: '23:59', days: [0, 1, 2, 3, 4, 5, 6], isActive: true },
      ],
      tradeSessions: [
        { id: 'crypto-trade', name: '24/7 Trading', startTime: '00:00', endTime: '23:59', days: [0, 1, 2, 3, 4, 5, 6], isActive: true },
      ],
    },
    highlights: generateHighlights(AssetCategory.CRYPTO),
    isFavorite: false,
  },
];

// ============================================
// Commodities Data
// ============================================

export const commodities: Security[] = [
  {
    id: 'XAUUSD',
    symbol: 'XAUUSD',
    name: 'Gold',
    category: AssetCategory.COMMODITIES,
    subCategory: 'Precious Metals',
    exchange: 'COMEX',
    currency: 'USD',
    priceStats: generatePriceStats(2235.50),
    sessions: {
      quoteSessions: [
        { id: 'com1', name: 'Asian Session', startTime: '20:00', endTime: '05:00', days: [1, 2, 3, 4, 5], isActive: true },
        { id: 'com2', name: 'European Session', startTime: '03:00', endTime: '12:00', days: [1, 2, 3, 4, 5], isActive: true },
        { id: 'com3', name: 'US Session', startTime: '08:00', endTime: '17:00', days: [1, 2, 3, 4, 5], isActive: true },
      ],
      tradeSessions: [
        { id: 'com-trade', name: 'Trading Hours', startTime: '18:00', endTime: '17:00', days: [1, 2, 3, 4, 5], isActive: true },
      ],
    },
    highlights: generateHighlights(AssetCategory.COMMODITIES),
    isFavorite: true,
  },
  {
    id: 'XAGUSD',
    symbol: 'XAGUSD',
    name: 'Silver',
    category: AssetCategory.COMMODITIES,
    subCategory: 'Precious Metals',
    exchange: 'COMEX',
    currency: 'USD',
    priceStats: generatePriceStats(25.35),
    sessions: {
      quoteSessions: [
        { id: 'com1', name: 'Asian Session', startTime: '20:00', endTime: '05:00', days: [1, 2, 3, 4, 5], isActive: true },
        { id: 'com2', name: 'European Session', startTime: '03:00', endTime: '12:00', days: [1, 2, 3, 4, 5], isActive: true },
        { id: 'com3', name: 'US Session', startTime: '08:00', endTime: '17:00', days: [1, 2, 3, 4, 5], isActive: true },
      ],
      tradeSessions: [
        { id: 'com-trade', name: 'Trading Hours', startTime: '18:00', endTime: '17:00', days: [1, 2, 3, 4, 5], isActive: true },
      ],
    },
    highlights: generateHighlights(AssetCategory.COMMODITIES),
    isFavorite: false,
  },
  {
    id: 'USOIL',
    symbol: 'USOIL',
    name: 'Crude Oil WTI',
    category: AssetCategory.COMMODITIES,
    subCategory: 'Energy',
    exchange: 'NYMEX',
    currency: 'USD',
    priceStats: generatePriceStats(83.45),
    sessions: {
      quoteSessions: [
        { id: 'com1', name: 'Asian Session', startTime: '20:00', endTime: '05:00', days: [1, 2, 3, 4, 5], isActive: true },
        { id: 'com2', name: 'European Session', startTime: '03:00', endTime: '12:00', days: [1, 2, 3, 4, 5], isActive: true },
        { id: 'com3', name: 'US Session', startTime: '08:00', endTime: '17:00', days: [1, 2, 3, 4, 5], isActive: true },
      ],
      tradeSessions: [
        { id: 'com-trade', name: 'Trading Hours', startTime: '18:00', endTime: '17:00', days: [1, 2, 3, 4, 5], isActive: true },
      ],
    },
    highlights: generateHighlights(AssetCategory.COMMODITIES),
    isFavorite: true,
  },
];

// ============================================
// Indices Data
// ============================================

export const indices: Security[] = [
  {
    id: 'SPX',
    symbol: 'SPX',
    name: 'S&P 500',
    category: AssetCategory.INDICES,
    subCategory: 'US Indices',
    exchange: 'CBOE',
    currency: 'USD',
    priceStats: generatePriceStats(5200.50),
    sessions: generateSessions(),
    highlights: generateHighlights(AssetCategory.INDICES),
    isFavorite: true,
  },
  {
    id: 'NDX',
    symbol: 'NDX',
    name: 'NASDAQ 100',
    category: AssetCategory.INDICES,
    subCategory: 'US Indices',
    exchange: 'NASDAQ',
    currency: 'USD',
    priceStats: generatePriceStats(18250.75),
    sessions: generateSessions(),
    highlights: generateHighlights(AssetCategory.INDICES),
    isFavorite: true,
  },
  {
    id: 'DJI',
    symbol: 'DJI',
    name: 'Dow Jones',
    category: AssetCategory.INDICES,
    subCategory: 'US Indices',
    exchange: 'NYSE',
    currency: 'USD',
    priceStats: generatePriceStats(39150.25),
    sessions: generateSessions(),
    highlights: generateHighlights(AssetCategory.INDICES),
    isFavorite: false,
  },
];

// ============================================
// All Securities
// ============================================

export const allSecurities: Security[] = [
  ...stocks,
  ...forexPairs,
  ...crypto,
  ...commodities,
  ...indices,
];

// ============================================
// Market Thematics
// ============================================

export const marketThematics: MarketThematic[] = [
  {
    id: 'tech-giants',
    name: 'Tech Giants',
    description: 'Leading technology companies driving innovation',
    icon: 'Cpu',
    securities: ['AAPL', 'MSFT', 'GOOGL', 'META', 'NVDA'],
    performance: 15.8,
    trend: 'up',
  },
  {
    id: 'magnificent-seven',
    name: 'Magnificent Seven',
    description: 'The seven most influential tech stocks',
    icon: 'Star',
    securities: ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'NVDA', 'META'],
    performance: 22.4,
    trend: 'up',
  },
  {
    id: 'ai-revolution',
    name: 'AI Revolution',
    description: 'Companies leading the artificial intelligence transformation',
    icon: 'Brain',
    securities: ['NVDA', 'MSFT', 'GOOGL', 'META'],
    performance: 35.2,
    trend: 'up',
  },
  {
    id: 'crypto-leaders',
    name: 'Crypto Leaders',
    description: 'Top cryptocurrencies by market capitalization',
    icon: 'Bitcoin',
    securities: ['BTCUSD', 'ETHUSD', 'SOLUSD'],
    performance: 45.8,
    trend: 'up',
  },
  {
    id: 'forex-majors',
    name: 'Forex Majors',
    description: 'Most traded currency pairs',
    icon: 'Globe',
    securities: ['EURUSD', 'GBPUSD', 'USDJPY', 'USDCHF'],
    performance: -2.1,
    trend: 'down',
  },
  {
    id: 'safe-haven',
    name: 'Safe Haven Assets',
    description: 'Assets typically sought during market uncertainty',
    icon: 'Shield',
    securities: ['XAUUSD', 'USDJPY', 'USDCHF'],
    performance: 8.5,
    trend: 'up',
  },
  {
    id: 'energy-commodities',
    name: 'Energy Commodities',
    description: 'Key energy market instruments',
    icon: 'Zap',
    securities: ['USOIL'],
    performance: 12.3,
    trend: 'up',
  },
  {
    id: 'us-indices',
    name: 'US Major Indices',
    description: 'Primary US stock market indices',
    icon: 'TrendingUp',
    securities: ['SPX', 'NDX', 'DJI'],
    performance: 10.2,
    trend: 'up',
  },
];

// ============================================
// Generate OHLC Data
// ============================================

export const generateOHLCData = (
  basePrice: number,
  count: number = 100,
  timeframe: Timeframe = Timeframe.H1
): OHLCData[] => {
  const data: OHLCData[] = [];
  let currentPrice = basePrice;
  const now = Date.now();
  
  // Determine time multiplier based on timeframe
  let timeMultiplier = 3600000; // 1 hour default
  switch (timeframe) {
    case Timeframe.M1: timeMultiplier = 60000; break;
    case Timeframe.M5: timeMultiplier = 300000; break;
    case Timeframe.M15: timeMultiplier = 900000; break;
    case Timeframe.M30: timeMultiplier = 1800000; break;
    case Timeframe.H1: timeMultiplier = 3600000; break;
    case Timeframe.H4: timeMultiplier = 14400000; break;
    case Timeframe.D1: timeMultiplier = 86400000; break;
    case Timeframe.W1: timeMultiplier = 604800000; break;
    default: timeMultiplier = 3600000;
  }
  
  for (let i = count - 1; i >= 0; i--) {
    const volatility = basePrice * 0.02;
    const change = (Math.random() - 0.5) * volatility;
    
    const open = currentPrice;
    const close = currentPrice + change;
    const high = Math.max(open, close) + Math.random() * volatility * 0.3;
    const low = Math.min(open, close) - Math.random() * volatility * 0.3;
    const volume = Math.floor(Math.random() * 1000000) + 100000;
    
    data.unshift({
      time: now - i * timeMultiplier,
      open,
      high,
      low,
      close,
      volume,
    });
    
    currentPrice = close;
  }
  
  return data;
};

// ============================================
// Mock Orders
// ============================================

export const mockOrders: Order[] = [
  {
    id: 'order-1',
    securityId: 'AAPL',
    symbol: 'AAPL',
    side: OrderSide.BUY,
    type: OrderType.LIMIT,
    quantity: 100,
    price: 175.00,
    status: OrderStatus.OPEN,
    filledQuantity: 0,
    createdAt: new Date(Date.now() - 3600000),
    updatedAt: new Date(Date.now() - 3600000),
  },
  {
    id: 'order-2',
    securityId: 'NVDA',
    symbol: 'NVDA',
    side: OrderSide.BUY,
    type: OrderType.MARKET,
    quantity: 50,
    status: OrderStatus.FILLED,
    filledQuantity: 50,
    filledPrice: 870.25,
    createdAt: new Date(Date.now() - 7200000),
    updatedAt: new Date(Date.now() - 7100000),
  },
  {
    id: 'order-3',
    securityId: 'TSLA',
    symbol: 'TSLA',
    side: OrderSide.SELL,
    type: OrderType.STOP,
    quantity: 25,
    stopPrice: 230.00,
    status: OrderStatus.OPEN,
    filledQuantity: 0,
    createdAt: new Date(Date.now() - 1800000),
    updatedAt: new Date(Date.now() - 1800000),
  },
];

// ============================================
// Mock Positions
// ============================================

export const mockPositions: Position[] = [
  {
    id: 'pos-1',
    securityId: 'AAPL',
    symbol: 'AAPL',
    side: OrderSide.BUY,
    quantity: 150,
    entryPrice: 165.50,
    currentPrice: 178.35,
    unrealizedPnL: 1927.50,
    realizedPnL: 0,
    openedAt: new Date(Date.now() - 86400000 * 7),
  },
  {
    id: 'pos-2',
    securityId: 'MSFT',
    symbol: 'MSFT',
    side: OrderSide.BUY,
    quantity: 75,
    entryPrice: 395.00,
    currentPrice: 412.58,
    unrealizedPnL: 1318.50,
    realizedPnL: 250.00,
    openedAt: new Date(Date.now() - 86400000 * 14),
  },
  {
    id: 'pos-3',
    securityId: 'EURUSD',
    symbol: 'EURUSD',
    side: OrderSide.SELL,
    quantity: 100000,
    entryPrice: 1.0950,
    currentPrice: 1.0845,
    unrealizedPnL: 1050.00,
    realizedPnL: 0,
    openedAt: new Date(Date.now() - 86400000 * 2),
  },
];

// ============================================
// Chart Presets
// ============================================

export const defaultChartSettings = {
  backgroundColor: '#0a0a0a',
  gridColor: '#1a1a1a',
  textColor: '#e5e5e5',
  borderColor: '#2a2a2a',
  bullishColor: '#22c55e',
  bearishColor: '#ef4444',
  wickVisible: true,
  lineWidth: 2,
  candleWidth: 8,
  showOHLC: true,
  showVolume: true,
  showGrid: true,
  showCrosshair: true,
  priceScaleMode: 'normal' as const,
  timeScaleVisible: true,
  timeScaleSecondsVisible: false,
};

// ============================================
// Indicators List
// ============================================

export const availableIndicators = [
  { type: IndicatorType.SMA, name: 'Simple Moving Average', category: 'Trend' },
  { type: IndicatorType.EMA, name: 'Exponential Moving Average', category: 'Trend' },
  { type: IndicatorType.WMA, name: 'Weighted Moving Average', category: 'Trend' },
  { type: IndicatorType.VWMA, name: 'Volume Weighted MA', category: 'Trend' },
  { type: IndicatorType.RSI, name: 'Relative Strength Index', category: 'Oscillator' },
  { type: IndicatorType.MACD, name: 'MACD', category: 'Oscillator' },
  { type: IndicatorType.STOCHASTIC, name: 'Stochastic', category: 'Oscillator' },
  { type: IndicatorType.CCI, name: 'Commodity Channel Index', category: 'Oscillator' },
  { type: IndicatorType.BOLLINGER_BANDS, name: 'Bollinger Bands', category: 'Volatility' },
  { type: IndicatorType.ATR, name: 'Average True Range', category: 'Volatility' },
  { type: IndicatorType.VOLUME, name: 'Volume', category: 'Volume' },
  { type: IndicatorType.VWAP, name: 'VWAP', category: 'Volume' },
  { type: IndicatorType.OBV, name: 'On Balance Volume', category: 'Volume' },
  { type: IndicatorType.MFI, name: 'Money Flow Index', category: 'Volume' },
  { type: IndicatorType.WILLIAMS_R, name: 'Williams %R', category: 'Oscillator' },
];
