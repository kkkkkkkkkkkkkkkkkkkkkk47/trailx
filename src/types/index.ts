// TrailX Trading Platform - Type Definitions

// ============================================
// Core Security/Instrument Types
// ============================================

export interface PriceStats {
  bid: number;
  bidHigh: number;
  bidLow: number;
  ask: number;
  askHigh: number;
  askLow: number;
  open: number;
  close: number;
  high: number;
  low: number;
  volume: number;
  change: number;
  changePercent: number;
}

export interface Session {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  days: number[]; // 0-6 (Sunday-Saturday)
  isActive: boolean;
}

export interface Sessions {
  quoteSessions: Session[];
  tradeSessions: Session[];
}

export interface CompanyProfile {
  description: string;
  sector: string;
  industry: string;
  employees: number;
  headquarters: string;
  website: string;
  ceo: string;
  founded: number;
  marketCap: number;
  peRatio: number;
  dividendYield: number;
}

export interface Financials {
  revenue: number;
  netIncome: number;
  totalAssets: number;
  totalDebt: number;
  cashFlow: number;
  grossMargin: number;
  operatingMargin: number;
  profitMargin: number;
  roe: number;
  roa: number;
}

export interface Highlight {
  label: string;
  value: string;
  trend?: 'up' | 'down' | 'neutral';
}

// Asset Category as const object
export const AssetCategory = {
  STOCKS: 'stocks',
  FOREX: 'forex',
  CRYPTO: 'crypto',
  COMMODITIES: 'commodities',
  INDICES: 'indices',
  BONDS: 'bonds',
  ETFS: 'etfs',
  FUTURES: 'futures',
} as const;

export type AssetCategory = typeof AssetCategory[keyof typeof AssetCategory];

export interface Security {
  id: string;
  symbol: string;
  name: string;
  category: AssetCategory;
  subCategory: string;
  exchange: string;
  currency: string;
  priceStats: PriceStats;
  sessions: Sessions;
  companyProfile?: CompanyProfile;
  financials?: Financials;
  highlights?: Highlight[];
  isFavorite: boolean;
}

// ============================================
// Chart Types
// ============================================

export const ChartType = {
  LINE: 'line',
  CANDLESTICK: 'candlestick',
  HEIKEN_ASHI: 'heiken_ashi',
  RENKO: 'renko',
  KAGI: 'kagi',
  FOOTPRINT: 'footprint',
  VOLUME_PROFILE: 'volume_profile',
  MARKET_PROFILE: 'market_profile',
  DOM: 'dom',
  BREAK_EVEN: 'break_even',
} as const;

export type ChartType = typeof ChartType[keyof typeof ChartType];

export const Timeframe = {
  TICK_1: '1t',
  TICK_10: '10t',
  TICK_100: '100t',
  TICK_1000: '1000t',
  M1: '1m',
  M5: '5m',
  M15: '15m',
  M30: '30m',
  H1: '1h',
  H4: '4h',
  D1: '1d',
  W1: '1w',
  MN1: '1M',
} as const;

export type Timeframe = typeof Timeframe[keyof typeof Timeframe];

export interface OHLCData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface TickData {
  time: number;
  price: number;
  volume: number;
  side: 'buy' | 'sell';
}

// ============================================
// Indicator Types
// ============================================

export const IndicatorType = {
  // Trend Indicators
  SMA: 'sma',
  EMA: 'ema',
  WMA: 'wma',
  VWMA: 'vwma',
  HMA: 'hma',
  DEMA: 'dema',
  TEMA: 'tema',
  
  // Oscillators
  RSI: 'rsi',
  MACD: 'macd',
  STOCHASTIC: 'stochastic',
  CCI: 'cci',
  WILLIAMS_R: 'williams_r',
  MOMENTUM: 'momentum',
  
  // Volatility
  BOLLINGER_BANDS: 'bollinger_bands',
  ATR: 'atr',
  KELTNER_CHANNELS: 'keltner_channels',
  DONCHIAN_CHANNELS: 'donchian_channels',
  
  // Volume
  VOLUME: 'volume',
  OBV: 'obv',
  VWAP: 'vwap',
  MFI: 'mfi',
  ADL: 'adl',
  
  // Custom
  CUSTOM: 'custom',
} as const;

export type IndicatorType = typeof IndicatorType[keyof typeof IndicatorType];

export interface IndicatorParameter {
  name: string;
  value: number | string | boolean;
  min?: number;
  max?: number;
  step?: number;
  options?: string[];
}

export interface Indicator {
  id: string;
  type: IndicatorType;
  name: string;
  parameters: IndicatorParameter[];
  color: string;
  lineStyle: 'solid' | 'dashed' | 'dotted';
  lineWidth: number;
  visible: boolean;
  overlay: boolean; // true = overlay on price, false = separate pane
  paneId?: string;
}

// ============================================
// Chart Layout Types
// ============================================

export type ChartLayout = 
  | '1x1' | '1x2' | '1x3' | '1x4'
  | '2x1' | '2x2' | '2x3' | '2x4'
  | '3x1' | '3x2' | '3x3' | '3x4'
  | '4x1' | '4x2' | '4x3' | '4x4';

export interface ChartInstance {
  id: string;
  securityId: string;
  type: ChartType;
  timeframe: Timeframe;
  indicators: Indicator[];
  settings: ChartSettings;
  data: OHLCData[];
  linked: boolean;
}

export interface ChartSettings {
  backgroundColor: string;
  gridColor: string;
  textColor: string;
  borderColor: string;
  
  // Candle colors
  bullishColor: string;
  bearishColor: string;
  wickVisible: boolean;
  
  // Line settings
  lineWidth: number;
  candleWidth: number;
  
  // Display options
  showOHLC: boolean;
  showVolume: boolean;
  showGrid: boolean;
  showCrosshair: boolean;
  
  // Price scale
  priceScaleMode: 'normal' | 'logarithmic' | 'percentage';
  
  // Time scale
  timeScaleVisible: boolean;
  timeScaleSecondsVisible: boolean;
}

export interface ChartTab {
  id: string;
  name: string;
  layout: ChartLayout;
  charts: ChartInstance[];
  active: boolean;
}

// ============================================
// Drawing Tools Types
// ============================================

export const DrawingToolType = {
  TREND_LINE: 'trend_line',
  HORIZONTAL_LINE: 'horizontal_line',
  VERTICAL_LINE: 'vertical_line',
  RAY: 'ray',
  CHANNEL: 'channel',
  FIBONACCI_RETRACEMENT: 'fibonacci_retracement',
  FIBONACCI_EXTENSION: 'fibonacci_extension',
  FIBONACCI_FAN: 'fibonacci_fan',
  RECTANGLE: 'rectangle',
  CIRCLE: 'circle',
  TRIANGLE: 'triangle',
  TEXT: 'text',
  CALLout: 'callout',
  BRUSH: 'brush',
  MEASURE: 'measure',
} as const;

export type DrawingToolType = typeof DrawingToolType[keyof typeof DrawingToolType];

export interface DrawingTool {
  id: string;
  type: DrawingToolType;
  points: { x: number; y: number }[];
  color: string;
  lineWidth: number;
  lineStyle: 'solid' | 'dashed' | 'dotted';
  text?: string;
  visible: boolean;
}

// ============================================
// Order/Trade Types
// ============================================

export const OrderType = {
  MARKET: 'market',
  LIMIT: 'limit',
  STOP: 'stop',
  STOP_LIMIT: 'stop_limit',
  TRAILING_STOP: 'trailing_stop',
  OCO: 'oco',
  ICEBERG: 'iceberg',
} as const;

export type OrderType = typeof OrderType[keyof typeof OrderType];

export const OrderSide = {
  BUY: 'buy',
  SELL: 'sell',
} as const;

export type OrderSide = typeof OrderSide[keyof typeof OrderSide];

export const OrderStatus = {
  PENDING: 'pending',
  OPEN: 'open',
  FILLED: 'filled',
  PARTIAL: 'partial',
  CANCELLED: 'cancelled',
  REJECTED: 'rejected',
  EXPIRED: 'expired',
} as const;

export type OrderStatus = typeof OrderStatus[keyof typeof OrderStatus];

export interface Order {
  id: string;
  securityId: string;
  symbol: string;
  side: OrderSide;
  type: OrderType;
  quantity: number;
  price?: number;
  stopPrice?: number;
  status: OrderStatus;
  filledQuantity: number;
  filledPrice?: number;
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
}

export interface Position {
  id: string;
  securityId: string;
  symbol: string;
  side: OrderSide;
  quantity: number;
  entryPrice: number;
  currentPrice: number;
  unrealizedPnL: number;
  realizedPnL: number;
  openedAt: Date;
}

// ============================================
// Replay System Types
// ============================================

export interface ReplayState {
  isPlaying: boolean;
  currentIndex: number;
  speed: number; // 1x, 2x, 5x, 10x
  startIndex: number;
  endIndex: number;
  data: OHLCData[];
}

// ============================================
// Quant Library Types
// ============================================

export interface Pattern {
  id: string;
  name: string;
  type: 'chart' | 'candlestick' | 'trend';
  confidence: number;
  startTime: number;
  endTime: number;
  points: { x: number; y: number }[];
  description: string;
}

export interface QuantModel {
  id: string;
  name: string;
  description: string;
  parameters: IndicatorParameter[];
  signals: {
    time: number;
    type: 'buy' | 'sell' | 'neutral';
    strength: number;
    message: string;
  }[];
  isCustom: boolean;
}

// ============================================
// UI State Types
// ============================================

export type ViewMode = 'markets' | 'quotes' | 'instrument';

export type InstrumentTab = 'about' | 'chart' | 'properties' | 'order';

export interface AppState {
  currentView: ViewMode;
  selectedSecurityId: string | null;
  activeInstrumentTab: InstrumentTab;
  sidebarCollapsed: boolean;
  darkMode: boolean;
}

// ============================================
// Market Thematic Types
// ============================================

export interface MarketThematic {
  id: string;
  name: string;
  description: string;
  icon: string;
  securities: string[]; // security IDs
  performance: number;
  trend: 'up' | 'down' | 'neutral';
}

// ============================================
// WebSocket Message Types
// ============================================

export interface PriceUpdate {
  securityId: string;
  bid: number;
  ask: number;
  lastPrice: number;
  volume: number;
  timestamp: number;
}
