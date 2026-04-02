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
      <div className="flex items-center justify-between px-4 py-3 border-b border-border flex-shrink-0">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => selectSecurity(null)}
            className="h-8 w-8"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold">{security.symbol}</h1>
              <Badge variant="outline">{security.category}</Badge>
              <Badge variant="secondary">{security.exchange}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">{security.name}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Price Display */}
          <div className="text-right">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold font-mono">
                {currentPrice.toFixed(2)}
              </span>
              <span className={cn(
                'flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-medium',
                priceChange >= 0 ? 'bg-bullish/10 text-bullish' : 'bg-bearish/10 text-bearish'
              )}>
                {priceChange >= 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                {priceChange >= 0 ? '+' : ''}
                {priceChangePercent.toFixed(2)}%
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
              <span>Bid: {security.priceStats.bid.toFixed(2)}</span>
              <span>Ask: {security.priceStats.ask.toFixed(2)}</span>
              <span>Vol: {(security.priceStats.volume / 1000000).toFixed(1)}M</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => toggleFavorite(security.id)}
              className={cn(
                security.isFavorite ? 'text-yellow-500' : 'text-muted-foreground'
              )}
            >
              <Star className={cn('w-5 h-5', security.isFavorite && 'fill-current')} />
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        value={activeInstrumentTab}
        onValueChange={(value) => setInstrumentTab(value as 'about' | 'chart' | 'properties' | 'order')}
        className="flex-1 flex flex-col min-h-0"
      >
        <TabsList className="w-full justify-start rounded-none border-b border-border bg-transparent h-12 px-4 gap-6 flex-shrink-0">
          <TabsTrigger
            value="about"
            className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-0"
          >
            <Info className="w-4 h-4 mr-2" />
            About
          </TabsTrigger>
          <TabsTrigger
            value="chart"
            className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-0"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Chart
          </TabsTrigger>
          <TabsTrigger
            value="properties"
            className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-0"
          >
            <Settings className="w-4 h-4 mr-2" />
            Properties
          </TabsTrigger>
          <TabsTrigger
            value="order"
            className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-0"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            New Order
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
