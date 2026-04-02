import { 
  Tag, 
  Clock, 
  DollarSign, 
  Globe,
  BarChart3,
  Activity,
  Layers
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Security } from '@/types';
import { AssetCategory } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface PropertiesSectionProps {
  security: Security;
}

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function PropertiesSection({ security }: PropertiesSectionProps) {
  const { category, subCategory, exchange, currency, sessions, priceStats } = security;

  const getCategoryIcon = (cat: AssetCategory) => {
    switch (cat) {
      case AssetCategory.STOCKS: return <BarChart3 className="w-5 h-5" />;
      case AssetCategory.FOREX: return <Globe className="w-5 h-5" />;
      case AssetCategory.CRYPTO: return <Activity className="w-5 h-5" />;
      case AssetCategory.COMMODITIES: return <Layers className="w-5 h-5" />;
      default: return <Tag className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (cat: AssetCategory) => {
    switch (cat) {
      case AssetCategory.STOCKS: return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case AssetCategory.FOREX: return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case AssetCategory.CRYPTO: return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case AssetCategory.COMMODITIES: return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case AssetCategory.INDICES: return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        {/* Asset Classification */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="w-5 h-5" />
              Asset Classification
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={cn(
                'p-4 rounded-lg border',
                getCategoryColor(category)
              )}>
                <div className="flex items-center gap-2 mb-2">
                  {getCategoryIcon(category)}
                  <span className="text-sm font-medium opacity-70">Category</span>
                </div>
                <p className="text-lg font-semibold capitalize">{category}</p>
              </div>
              
              <div className="p-4 rounded-lg border bg-muted/50">
                <div className="flex items-center gap-2 mb-2">
                  <Layers className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">Sub-Category</span>
                </div>
                <p className="text-lg font-semibold">{subCategory}</p>
              </div>
              
              <div className="p-4 rounded-lg border bg-muted/50">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">Exchange</span>
                </div>
                <p className="text-lg font-semibold">{exchange}</p>
                <p className="text-sm text-muted-foreground">Currency: {currency}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Market Timing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Market Timing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="quote" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="quote">Quote Sessions</TabsTrigger>
                <TabsTrigger value="trade">Trade Sessions</TabsTrigger>
              </TabsList>
              
              <TabsContent value="quote" className="mt-4">
                <div className="space-y-3">
                  {sessions.quoteSessions.map((session) => (
                    <div
                      key={session.id}
                      className={cn(
                        'flex items-center justify-between p-3 rounded-lg border',
                        session.isActive 
                          ? 'bg-bullish/5 border-bullish/20' 
                          : 'bg-muted/30 border-muted'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          'w-2 h-2 rounded-full',
                          session.isActive ? 'bg-bullish animate-pulse' : 'bg-muted-foreground'
                        )} />
                        <div>
                          <p className="font-medium">{session.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {session.startTime} - {session.endTime}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 justify-end max-w-[200px]">
                        {session.days.map((day) => (
                          <Badge 
                            key={day} 
                            variant="outline" 
                            className="text-xs"
                          >
                            {daysOfWeek[day].slice(0, 3)}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="trade" className="mt-4">
                <div className="space-y-3">
                  {sessions.tradeSessions.map((session) => (
                    <div
                      key={session.id}
                      className={cn(
                        'flex items-center justify-between p-3 rounded-lg border',
                        session.isActive 
                          ? 'bg-bullish/5 border-bullish/20' 
                          : 'bg-muted/30 border-muted'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          'w-2 h-2 rounded-full',
                          session.isActive ? 'bg-bullish animate-pulse' : 'bg-muted-foreground'
                        )} />
                        <div>
                          <p className="font-medium">{session.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {session.startTime} - {session.endTime}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 justify-end max-w-[200px]">
                        {session.days.map((day) => (
                          <Badge 
                            key={day} 
                            variant="outline" 
                            className="text-xs"
                          >
                            {daysOfWeek[day].slice(0, 3)}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Price Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Price Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Bid Section */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Bid</p>
                <div className="p-3 bg-bullish/5 border border-bullish/20 rounded-lg">
                  <p className="text-2xl font-mono font-bold text-bullish">
                    {priceStats.bid.toFixed(2)}
                  </p>
                  <div className="mt-2 space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">High</span>
                      <span className="font-mono">{priceStats.bidHigh.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Low</span>
                      <span className="font-mono">{priceStats.bidLow.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ask Section */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Ask</p>
                <div className="p-3 bg-bearish/5 border border-bearish/20 rounded-lg">
                  <p className="text-2xl font-mono font-bold text-bearish">
                    {priceStats.ask.toFixed(2)}
                  </p>
                  <div className="mt-2 space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">High</span>
                      <span className="font-mono">{priceStats.askHigh.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Low</span>
                      <span className="font-mono">{priceStats.askLow.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Session Prices */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Session</p>
                <div className="p-3 bg-muted/50 border border-muted rounded-lg space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Open</span>
                    <span className="font-mono font-medium">{priceStats.open.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Close</span>
                    <span className="font-mono font-medium">{priceStats.close.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-border my-1" />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">High</span>
                    <span className="font-mono font-medium">{priceStats.high.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Low</span>
                    <span className="font-mono font-medium">{priceStats.low.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Change & Volume */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Change</p>
                <div className="p-3 bg-muted/50 border border-muted rounded-lg space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Change</span>
                    <span className={cn(
                      'font-mono font-medium',
                      priceStats.change >= 0 ? 'text-bullish' : 'text-bearish'
                    )}>
                      {priceStats.change >= 0 ? '+' : ''}
                      {priceStats.change.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Change %</span>
                    <span className={cn(
                      'font-mono font-medium',
                      priceStats.changePercent >= 0 ? 'text-bullish' : 'text-bearish'
                    )}>
                      {priceStats.changePercent >= 0 ? '+' : ''}
                      {priceStats.changePercent.toFixed(2)}%
                    </span>
                  </div>
                  <div className="border-t border-border my-1" />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Volume</span>
                    <span className="font-mono font-medium">
                      {(priceStats.volume / 1000000).toFixed(2)}M
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trading Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Trading Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Spread</p>
                <p className="font-mono font-medium">
                  {(priceStats.ask - priceStats.bid).toFixed(4)}
                </p>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Tick Size</p>
                <p className="font-mono font-medium">
                  {category === AssetCategory.FOREX ? '0.00001' : '0.01'}
                </p>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Contract Size</p>
                <p className="font-mono font-medium">
                  {category === AssetCategory.FOREX ? '100,000' : '1'}
                </p>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Margin Requirement</p>
                <p className="font-mono font-medium">
                  {category === AssetCategory.CRYPTO ? '50%' : '10%'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
}
