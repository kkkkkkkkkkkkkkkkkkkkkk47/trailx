import { 
  ArrowLeft, 
  Star, 
  TrendingUp, 
  TrendingDown,
  Info,
  BarChart3,
  Settings,
  ShoppingCart
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTrading } from '@/store/TradingContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AboutSection } from './AboutSection';
import { ChartSection } from './ChartSection';
import { PropertiesSection } from './PropertiesSection';
import { OrderSection } from './OrderSection';

export function InstrumentView() {
  const { state, selectSecurity, toggleFavorite, setView, setInstrumentTab } = useTrading();
  const { selectedSecurityId, activeInstrumentTab } = state;

  const security = selectedSecurityId
    ? state.securities.find((s) => s.id === selectedSecurityId)
    : null;

  if (!security) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">No instrument selected</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => setView('markets')}
          >
            Go to Markets
          </Button>
        </div>
      </div>
    );
  }

  const priceUpdate = state.priceUpdates.get(security.id);
  const currentPrice = priceUpdate?.lastPrice || security.priceStats.close;
  const priceChange = security.priceStats.change;
  const priceChangePercent = security.priceStats.changePercent;

  return (
    <div className="h-full flex flex-col">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 py-3 border-b border-border flex-shrink-0 gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => selectSecurity(null)}
            className="h-8 w-8 flex-shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg sm:text-xl font-bold">{security.symbol}</h1>
              <Badge variant="outline" className="text-xs">{security.category}</Badge>
              <Badge variant="secondary" className="text-xs hidden sm:inline-flex">{security.exchange}</Badge>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground truncate">{security.name}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          {/* Price Display */}
          <div className="text-right">
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-bold font-mono">
                {currentPrice.toFixed(2)}
              </span>
              <span className={cn(
                'flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg text-xs sm:text-sm font-medium',
                priceChange >= 0 ? 'bg-bullish/10 text-bullish' : 'bg-bearish/10 text-bearish'
              )}>
                {priceChange >= 0 ? (
                  <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                ) : (
                  <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4" />
                )}
                {priceChange >= 0 ? '+' : ''}
                {priceChangePercent.toFixed(2)}%
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-3 text-xs text-muted-foreground mt-1">
              <span>Bid: {security.priceStats.bid.toFixed(2)}</span>
              <span>Ask: {security.priceStats.ask.toFixed(2)}</span>
              <span>Vol: {(security.priceStats.volume / 1000000).toFixed(1)}M</span>
            </div>
          </div>

          {/* Actions */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => toggleFavorite(security.id)}
            className={cn(
              'h-8 w-8 flex-shrink-0',
              security.isFavorite ? 'text-yellow-500' : 'text-muted-foreground'
            )}
          >
            <Star className={cn('w-4 h-4 sm:w-5 sm:h-5', security.isFavorite && 'fill-current')} />
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        value={activeInstrumentTab}
        onValueChange={(value) => setInstrumentTab(value as 'about' | 'chart' | 'properties' | 'order')}
        className="flex-1 flex flex-col min-h-0"
      >
        <TabsList className="w-full justify-start rounded-none border-b border-border bg-transparent h-auto px-2 sm:px-4 gap-2 sm:gap-6 flex-shrink-0 overflow-x-auto scrollbar-hide">
          <TabsTrigger
            value="about"
            className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-2 sm:px-0 text-xs sm:text-sm whitespace-nowrap"
          >
            <Info className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
            <span className="hidden sm:inline">About</span>
          </TabsTrigger>
          <TabsTrigger
            value="chart"
            className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-2 sm:px-0 text-xs sm:text-sm whitespace-nowrap"
          >
            <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
            <span className="hidden sm:inline">Chart</span>
          </TabsTrigger>
          <TabsTrigger
            value="properties"
            className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-2 sm:px-0 text-xs sm:text-sm whitespace-nowrap"
          >
            <Settings className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
            <span className="hidden sm:inline">Properties</span>
          </TabsTrigger>
          <TabsTrigger
            value="order"
            className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-2 sm:px-0 text-xs sm:text-sm whitespace-nowrap"
          >
            <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
            <span className="hidden sm:inline">New Order</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="about" className="m-0 flex-1 min-h-0 overflow-hidden">
          <AboutSection security={security} />
        </TabsContent>

        <TabsContent value="chart" className="m-0 flex-1 min-h-0 overflow-hidden">
          <ChartSection security={security} />
        </TabsContent>

        <TabsContent value="properties" className="m-0 flex-1 min-h-0 overflow-hidden">
          <PropertiesSection security={security} />
        </TabsContent>

        <TabsContent value="order" className="m-0 flex-1 min-h-0 overflow-hidden">
          <OrderSection security={security} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
