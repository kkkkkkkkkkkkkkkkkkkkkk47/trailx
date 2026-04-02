import { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Star, 
  Cpu,
  Globe,
  Bitcoin,
  Zap,
  BarChart3,
  Brain,
  Shield,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTrading } from '@/store/TradingContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { marketThematics } from '@/data/mockData';

const iconMap: Record<string, React.ElementType> = {
  Cpu,
  Star,
  Brain,
  Bitcoin,
  Globe,
  Shield,
  Zap,
  TrendingUp,
  BarChart3,
};

export function QuotesModule() {
  const { state, selectSecurity, toggleFavorite } = useTrading();
  const [selectedThematic, setSelectedThematic] = useState<string | null>(null);

  const handleSecurityClick = (securityId: string) => {
    selectSecurity(securityId);
  };

  const getThematicSecurities = (thematicId: string) => {
    const thematic = marketThematics.find(t => t.id === thematicId);
    if (!thematic) return [];
    return state.securities.filter(s => thematic.securities.includes(s.id));
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border flex-shrink-0">
        <h1 className="text-2xl font-bold">Quotes</h1>
        <p className="text-sm text-muted-foreground">
          Market thematics and curated watchlists
        </p>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="p-4 space-y-6">
          {/* Market Thematics Grid */}
          <section>
            <h2 className="text-lg font-semibold mb-4">Market Thematics</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {marketThematics.map((thematic) => {
                const Icon = iconMap[thematic.icon] || TrendingUp;
                return (
                  <div
                    key={thematic.id}
                    onClick={() => setSelectedThematic(
                      selectedThematic === thematic.id ? null : thematic.id
                    )}
                    className={cn(
                      'bg-card border rounded-lg p-4 cursor-pointer transition-all',
                      selectedThematic === thematic.id
                        ? 'border-primary ring-1 ring-primary'
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className={cn(
                        'w-10 h-10 rounded-lg flex items-center justify-center',
                        thematic.trend === 'up' ? 'bg-bullish/10' : 'bg-bearish/10'
                      )}>
                        <Icon className={cn(
                          'w-5 h-5',
                          thematic.trend === 'up' ? 'text-bullish' : 'text-bearish'
                        )} />
                      </div>
                      <div className={cn(
                        'flex items-center gap-1 text-sm font-medium',
                        thematic.trend === 'up' ? 'text-bullish' : 'text-bearish'
                      )}>
                        {thematic.trend === 'up' ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : (
                          <TrendingDown className="w-4 h-4" />
                        )}
                        {thematic.performance >= 0 ? '+' : ''}
                        {thematic.performance.toFixed(2)}%
                      </div>
                    </div>
                    <h3 className="font-semibold mb-1">{thematic.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {thematic.description}
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {thematic.securities.length} instruments
                      </Badge>
                      {selectedThematic === thematic.id && (
                        <Badge className="text-xs">Selected</Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Selected Thematic Securities */}
          {selectedThematic && (
            <section className="animate-fade-in">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">
                  {marketThematics.find(t => t.id === selectedThematic)?.name} Instruments
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedThematic(null)}
                >
                  Clear Selection
                </Button>
              </div>
              
              <div className="bg-card border border-border rounded-lg overflow-hidden">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-muted/50 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  <div className="col-span-1">Fav</div>
                  <div className="col-span-2">Symbol</div>
                  <div className="col-span-3">Name</div>
                  <div className="col-span-2 text-right">Price</div>
                  <div className="col-span-2 text-right">Change</div>
                  <div className="col-span-2 text-right">Action</div>
                </div>

                {/* Table Body */}
                <div className="divide-y divide-border">
                  {getThematicSecurities(selectedThematic).map((security) => (
                    <div
                      key={security.id}
                      className="grid grid-cols-12 gap-4 px-4 py-3 items-center hover:bg-muted/50 transition-colors"
                    >
                      <div className="col-span-1">
                        <button
                          onClick={() => toggleFavorite(security.id)}
                          className={cn(
                            'p-1 rounded transition-colors',
                            security.isFavorite ? 'text-yellow-500' : 'text-muted-foreground hover:text-yellow-500'
                          )}
                        >
                          <Star className={cn('w-4 h-4', security.isFavorite && 'fill-current')} />
                        </button>
                      </div>
                      <div className="col-span-2">
                        <span className="font-semibold">{security.symbol}</span>
                      </div>
                      <div className="col-span-3">
                        <span className="text-sm text-muted-foreground">{security.name}</span>
                      </div>
                      <div className="col-span-2 text-right">
                        <span className="font-mono font-medium">
                          {security.priceStats.close.toFixed(2)}
                        </span>
                      </div>
                      <div className="col-span-2 text-right">
                        <div className={cn(
                          'flex items-center justify-end gap-1',
                          security.priceStats.change >= 0 ? 'text-bullish' : 'text-bearish'
                        )}>
                          {security.priceStats.change >= 0 ? (
                            <TrendingUp className="w-3 h-3" />
                          ) : (
                            <TrendingDown className="w-3 h-3" />
                          )}
                          <span className="font-mono">
                            {security.priceStats.change >= 0 ? '+' : ''}
                            {security.priceStats.changePercent.toFixed(2)}%
                          </span>
                        </div>
                      </div>
                      <div className="col-span-2 text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSecurityClick(security.id)}
                        >
                          Trade
                          <ArrowRight className="w-3 h-3 ml-1" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Quick Access - Favorites */}
          <section>
            <h2 className="text-lg font-semibold mb-4">Your Favorites</h2>
            {state.favorites.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {state.favorites.map((favId) => {
                  const security = state.securities.find(s => s.id === favId);
                  if (!security) return null;
                  return (
                    <div
                      key={favId}
                      onClick={() => handleSecurityClick(security.id)}
                      className="bg-card border border-border rounded-lg p-4 hover:border-primary/50 cursor-pointer transition-all"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <span className="font-bold">{security.symbol}</span>
                          <p className="text-xs text-muted-foreground">{security.name}</p>
                        </div>
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      </div>
                      <div className="flex items-end justify-between">
                        <span className="font-mono font-medium">
                          {security.priceStats.close.toFixed(2)}
                        </span>
                        <span className={cn(
                          'text-sm font-mono',
                          security.priceStats.change >= 0 ? 'text-bullish' : 'text-bearish'
                        )}>
                          {security.priceStats.change >= 0 ? '+' : ''}
                          {security.priceStats.changePercent.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Star className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No favorites yet. Star instruments to add them here.</p>
              </div>
            )}
          </section>

          {/* Market Overview */}
          <section>
            <h2 className="text-lg font-semibold mb-4">Market Overview</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {state.securities.slice(0, 4).map((security) => (
                <div
                  key={security.id}
                  onClick={() => handleSecurityClick(security.id)}
                  className="bg-card border border-border rounded-lg p-4 hover:border-primary/50 cursor-pointer transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">{security.symbol}</span>
                    <Badge variant="outline" className="text-xs">
                      {security.category}
                    </Badge>
                  </div>
                  <div className="flex items-end justify-between">
                    <span className="text-xl font-bold font-mono">
                      {security.priceStats.close.toFixed(2)}
                    </span>
                    <div className={cn(
                      'flex items-center gap-1 text-sm',
                      security.priceStats.change >= 0 ? 'text-bullish' : 'text-bearish'
                    )}>
                      {security.priceStats.change >= 0 ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      {Math.abs(security.priceStats.changePercent).toFixed(2)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
