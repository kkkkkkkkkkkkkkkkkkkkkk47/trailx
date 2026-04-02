// TrailX Trading Platform - Global State Management

import { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import type {
  Security,
  Order,
  Position,
  ChartTab,
  ChartInstance,
  Indicator,
  PriceUpdate,
  OHLCData,
  ChartSettings,
} from '@/types';
import { ChartType, Timeframe, OrderStatus } from '@/types';
import {
  allSecurities,
  mockOrders,
  mockPositions,
  generateOHLCData,
  defaultChartSettings,
} from '@/data/mockData';

// ============================================
// State Interface
// ============================================

interface TradingState {
  // Navigation
  currentView: 'markets' | 'quotes' | 'instrument';
  selectedSecurityId: string | null;
  activeInstrumentTab: 'about' | 'chart' | 'properties' | 'order';
  
  // Data
  securities: Security[];
  orders: Order[];
  positions: Position[];
  favorites: string[];
  
  // Chart State
  chartTabs: ChartTab[];
  activeChartTabId: string;
  chartSettings: ChartSettings;
  
  // UI State
  sidebarCollapsed: boolean;
  darkMode: boolean;
  showOrderPanel: boolean;
  
  // Real-time
  priceUpdates: Map<string, PriceUpdate>;
  chartData: Map<string, OHLCData[]>;
}

// ============================================
// Initial State
// ============================================

const defaultChartTab: ChartTab = {
  id: 'tab-1',
  name: 'Chart 1',
  layout: '1x1',
  charts: [
    {
      id: 'chart-1',
      securityId: 'AAPL',
      type: ChartType.CANDLESTICK,
      timeframe: Timeframe.H1,
      indicators: [],
      settings: defaultChartSettings,
      data: [],
      linked: false,
    },
  ],
  active: true,
};

const initialState: TradingState = {
  currentView: 'markets',
  selectedSecurityId: null,
  activeInstrumentTab: 'chart',
  securities: allSecurities,
  orders: mockOrders,
  positions: mockPositions,
  favorites: ['AAPL', 'MSFT', 'NVDA', 'EURUSD', 'BTCUSD'],
  chartTabs: [defaultChartTab],
  activeChartTabId: 'tab-1',
  chartSettings: defaultChartSettings,
  sidebarCollapsed: false,
  darkMode: true,
  showOrderPanel: false,
  priceUpdates: new Map(),
  chartData: new Map(),
};

// ============================================
// Action Types
// ============================================

type Action =
  | { type: 'SET_VIEW'; payload: 'markets' | 'quotes' | 'instrument' }
  | { type: 'SELECT_SECURITY'; payload: string | null }
  | { type: 'SET_INSTRUMENT_TAB'; payload: 'about' | 'chart' | 'properties' | 'order' }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'TOGGLE_DARK_MODE' }
  | { type: 'TOGGLE_FAVORITE'; payload: string }
  | { type: 'ADD_ORDER'; payload: Order }
  | { type: 'UPDATE_ORDER'; payload: Order }
  | { type: 'CANCEL_ORDER'; payload: string }
  | { type: 'ADD_CHART_TAB'; payload: ChartTab }
  | { type: 'REMOVE_CHART_TAB'; payload: string }
  | { type: 'SET_ACTIVE_CHART_TAB'; payload: string }
  | { type: 'UPDATE_CHART'; payload: { chartId: string; updates: Partial<ChartInstance> } }
  | { type: 'ADD_CHART_TO_TAB'; payload: { tabId: string; chart: ChartInstance } }
  | { type: 'REMOVE_CHART_FROM_TAB'; payload: { tabId: string; chartId: string } }
  | { type: 'UPDATE_CHART_LAYOUT'; payload: { tabId: string; layout: ChartTab['layout'] } }
  | { type: 'ADD_INDICATOR'; payload: { chartId: string; indicator: Indicator } }
  | { type: 'REMOVE_INDICATOR'; payload: { chartId: string; indicatorId: string } }
  | { type: 'UPDATE_CHART_SETTINGS'; payload: Partial<ChartSettings> }
  | { type: 'UPDATE_PRICE'; payload: PriceUpdate }
  | { type: 'SET_CHART_DATA'; payload: { securityId: string; data: OHLCData[] } }
  | { type: 'TOGGLE_ORDER_PANEL' }
  | { type: 'UPDATE_SECURITY'; payload: Security };

// ============================================
// Reducer
// ============================================

function tradingReducer(state: TradingState, action: Action): TradingState {
  switch (action.type) {
    case 'SET_VIEW':
      return { ...state, currentView: action.payload };
    
    case 'SELECT_SECURITY':
      return { 
        ...state, 
        selectedSecurityId: action.payload,
        currentView: action.payload ? 'instrument' : state.currentView,
      };
    
    case 'SET_INSTRUMENT_TAB':
      return { ...state, activeInstrumentTab: action.payload };
    
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarCollapsed: !state.sidebarCollapsed };
    
    case 'TOGGLE_DARK_MODE':
      return { ...state, darkMode: !state.darkMode };
    
    case 'TOGGLE_FAVORITE': {
      const securityId = action.payload;
      const isFavorite = state.favorites.includes(securityId);
      return {
        ...state,
        favorites: isFavorite
          ? state.favorites.filter(id => id !== securityId)
          : [...state.favorites, securityId],
        securities: state.securities.map(sec =>
          sec.id === securityId ? { ...sec, isFavorite: !isFavorite } : sec
        ),
      };
    }
    
    case 'ADD_ORDER':
      return { ...state, orders: [...state.orders, action.payload] };
    
    case 'UPDATE_ORDER':
      return {
        ...state,
        orders: state.orders.map(order =>
          order.id === action.payload.id ? action.payload : order
        ),
      };
    
    case 'CANCEL_ORDER':
      return {
        ...state,
        orders: state.orders.map(order =>
          order.id === action.payload ? { ...order, status: OrderStatus.CANCELLED } : order
        ),
      };
    
    case 'ADD_CHART_TAB':
      return {
        ...state,
        chartTabs: [...state.chartTabs, action.payload],
        activeChartTabId: action.payload.id,
      };
    
    case 'REMOVE_CHART_TAB':
      if (state.chartTabs.length <= 1) return state;
      const filteredTabs = state.chartTabs.filter(tab => tab.id !== action.payload);
      return {
        ...state,
        chartTabs: filteredTabs,
        activeChartTabId: filteredTabs[0]?.id || '',
      };
    
    case 'SET_ACTIVE_CHART_TAB':
      return {
        ...state,
        activeChartTabId: action.payload,
        chartTabs: state.chartTabs.map(tab => ({
          ...tab,
          active: tab.id === action.payload,
        })),
      };
    
    case 'UPDATE_CHART': {
      const { chartId, updates } = action.payload;
      return {
        ...state,
        chartTabs: state.chartTabs.map(tab => ({
          ...tab,
          charts: tab.charts.map(chart =>
            chart.id === chartId ? { ...chart, ...updates } : chart
          ),
        })),
      };
    }
    
    case 'ADD_CHART_TO_TAB': {
      const { tabId, chart } = action.payload;
      return {
        ...state,
        chartTabs: state.chartTabs.map(tab =>
          tab.id === tabId ? { ...tab, charts: [...tab.charts, chart] } : tab
        ),
      };
    }
    
    case 'REMOVE_CHART_FROM_TAB': {
      const { tabId, chartId } = action.payload;
      return {
        ...state,
        chartTabs: state.chartTabs.map(tab =>
          tab.id === tabId
            ? { ...tab, charts: tab.charts.filter(c => c.id !== chartId) }
            : tab
        ),
      };
    }
    
    case 'UPDATE_CHART_LAYOUT': {
      const { tabId, layout } = action.payload;
      return {
        ...state,
        chartTabs: state.chartTabs.map(tab =>
          tab.id === tabId ? { ...tab, layout } : tab
        ),
      };
    }
    
    case 'ADD_INDICATOR': {
      const { chartId, indicator } = action.payload;
      return {
        ...state,
        chartTabs: state.chartTabs.map(tab => ({
          ...tab,
          charts: tab.charts.map(chart =>
            chart.id === chartId
              ? { ...chart, indicators: [...chart.indicators, indicator] }
              : chart
          ),
        })),
      };
    }
    
    case 'REMOVE_INDICATOR': {
      const { chartId, indicatorId } = action.payload;
      return {
        ...state,
        chartTabs: state.chartTabs.map(tab => ({
          ...tab,
          charts: tab.charts.map(chart =>
            chart.id === chartId
              ? { ...chart, indicators: chart.indicators.filter(i => i.id !== indicatorId) }
              : chart
          ),
        })),
      };
    }
    
    case 'UPDATE_CHART_SETTINGS':
      return { ...state, chartSettings: { ...state.chartSettings, ...action.payload } };
    
    case 'UPDATE_PRICE': {
      const updates = new Map(state.priceUpdates);
      updates.set(action.payload.securityId, action.payload);
      return { ...state, priceUpdates: updates };
    }
    
    case 'SET_CHART_DATA': {
      const data = new Map(state.chartData);
      data.set(action.payload.securityId, action.payload.data);
      return { ...state, chartData: data };
    }
    
    case 'TOGGLE_ORDER_PANEL':
      return { ...state, showOrderPanel: !state.showOrderPanel };
    
    case 'UPDATE_SECURITY':
      return {
        ...state,
        securities: state.securities.map(sec =>
          sec.id === action.payload.id ? action.payload : sec
        ),
      };
    
    default:
      return state;
  }
}

// ============================================
// Context
// ============================================

interface TradingContextType {
  state: TradingState;
  dispatch: React.Dispatch<Action>;
  // Helper functions
  selectSecurity: (securityId: string | null) => void;
  setView: (view: 'markets' | 'quotes' | 'instrument') => void;
  setInstrumentTab: (tab: 'about' | 'chart' | 'properties' | 'order') => void;
  toggleFavorite: (securityId: string) => void;
  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => void;
  cancelOrder: (orderId: string) => void;
  getSecurityById: (securityId: string) => Security | undefined;
  getSelectedSecurity: () => Security | undefined;
  getSecuritiesByCategory: (category: string) => Security[];
  getFavorites: () => Security[];
  updateChartTimeframe: (chartId: string, timeframe: Timeframe) => void;
  updateChartType: (chartId: string, type: ChartType) => void;
  addIndicator: (chartId: string, indicator: Indicator) => void;
  removeIndicator: (chartId: string, indicatorId: string) => void;
  updateChartData: (securityId: string, timeframe: Timeframe) => void;
}

const TradingContext = createContext<TradingContextType | undefined>(undefined);

// ============================================
// Provider
// ============================================

export function TradingProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(tradingReducer, initialState);

  // Helper functions
  const selectSecurity = useCallback((securityId: string | null) => {
    dispatch({ type: 'SELECT_SECURITY', payload: securityId });
  }, []);

  const setView = useCallback((view: 'markets' | 'quotes' | 'instrument') => {
    dispatch({ type: 'SET_VIEW', payload: view });
  }, []);

  const setInstrumentTab = useCallback((tab: 'about' | 'chart' | 'properties' | 'order') => {
    dispatch({ type: 'SET_INSTRUMENT_TAB', payload: tab });
  }, []);

  const toggleFavorite = useCallback((securityId: string) => {
    dispatch({ type: 'TOGGLE_FAVORITE', payload: securityId });
  }, []);

  const addOrder = useCallback((orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => {
    const order: Order = {
      ...orderData,
      id: `order-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    dispatch({ type: 'ADD_ORDER', payload: order });
  }, []);

  const cancelOrder = useCallback((orderId: string) => {
    dispatch({ type: 'CANCEL_ORDER', payload: orderId });
  }, []);

  const getSecurityById = useCallback((securityId: string) => {
    return state.securities.find(sec => sec.id === securityId);
  }, [state.securities]);

  const getSelectedSecurity = useCallback(() => {
    if (!state.selectedSecurityId) return undefined;
    return getSecurityById(state.selectedSecurityId);
  }, [state.selectedSecurityId, getSecurityById]);

  const getSecuritiesByCategory = useCallback((category: string) => {
    return state.securities.filter(sec => sec.category === category);
  }, [state.securities]);

  const getFavorites = useCallback(() => {
    return state.securities.filter(sec => state.favorites.includes(sec.id));
  }, [state.securities, state.favorites]);

  const updateChartTimeframe = useCallback((chartId: string, timeframe: Timeframe) => {
    dispatch({ type: 'UPDATE_CHART', payload: { chartId, updates: { timeframe } } });
  }, []);

  const updateChartType = useCallback((chartId: string, type: ChartType) => {
    dispatch({ type: 'UPDATE_CHART', payload: { chartId, updates: { type } } });
  }, []);

  const addIndicator = useCallback((chartId: string, indicator: Indicator) => {
    dispatch({ type: 'ADD_INDICATOR', payload: { chartId, indicator } });
  }, []);

  const removeIndicator = useCallback((chartId: string, indicatorId: string) => {
    dispatch({ type: 'REMOVE_INDICATOR', payload: { chartId, indicatorId } });
  }, []);

  const updateChartData = useCallback((securityId: string, timeframe: Timeframe) => {
    const security = getSecurityById(securityId);
    if (security) {
      const data = generateOHLCData(security.priceStats.close, 200, timeframe);
      dispatch({ type: 'SET_CHART_DATA', payload: { securityId, data } });
    }
  }, [getSecurityById]);

  // Simulate real-time price updates
  useEffect(() => {
    const interval = setInterval(() => {
      state.securities.forEach(security => {
        const volatility = security.priceStats.close * 0.001;
        const change = (Math.random() - 0.5) * volatility;
        
        const priceUpdate: PriceUpdate = {
          securityId: security.id,
          bid: security.priceStats.bid + change,
          ask: security.priceStats.ask + change,
          lastPrice: security.priceStats.close + change,
          volume: security.priceStats.volume + Math.floor(Math.random() * 1000),
          timestamp: Date.now(),
        };
        
        dispatch({ type: 'UPDATE_PRICE', payload: priceUpdate });
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [state.securities]);

  // Initialize chart data for selected security
  useEffect(() => {
    if (state.selectedSecurityId) {
      updateChartData(state.selectedSecurityId, Timeframe.H1);
    }
  }, [state.selectedSecurityId]);

  const value: TradingContextType = {
    state,
    dispatch,
    selectSecurity,
    setView,
    setInstrumentTab,
    toggleFavorite,
    addOrder,
    cancelOrder,
    getSecurityById,
    getSelectedSecurity,
    getSecuritiesByCategory,
    getFavorites,
    updateChartTimeframe,
    updateChartType,
    addIndicator,
    removeIndicator,
    updateChartData,
  };

  return (
    <TradingContext.Provider value={value}>
      {children}
    </TradingContext.Provider>
  );
}

// ============================================
// Hook
// ============================================

export function useTrading() {
  const context = useContext(TradingContext);
  if (context === undefined) {
    throw new Error('useTrading must be used within a TradingProvider');
  }
  return context;
}
