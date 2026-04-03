import { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Star, 
  Filter,
  Grid3X3,
  List,
  Search
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTrading } from '@/store/TradingContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import type { Security } from '@/types';
import { AssetCategory } from '@/types';

const categories = [
  { id: 'all', label: 'All', count: null },
  { id: AssetCategory.STOCKS, label: 'Stocks', count: 10 },
  { id: AssetCategory.FOREX, label: 'Forex', count: 5 },
  { id: AssetCategory.CRYPTO, label: 'Crypto', count: 4 },
  { id: AssetCategory.COMMODITIES, label: 'Commodities', count: 3 },
  { id: AssetCategory.INDICES, label: 'Indices', count: 3 },
];

export function MarketsModule() {
  const { state, selectSecurity, toggleFavorite } = useTrading();
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredSecurities = state.securities.filter((security) => {
    const matchesCategory = selectedCategory === 'all' || security.category === selectedCategory;
    const matchesSearch = 
      security.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      security.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSecurityClick = (security: Security) => {
    selectSecurity(security.id);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold">Markets</h1>
          <p className="text-sm text-muted-foreground">
            Browse and trade financial instruments
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search markets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-64"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="w-4 h-4" />
          </Button>
          <div className="flex items-center border rounded-lg">
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('list')}
              className="rounded-none rounded-l-lg"
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('grid')}
              className="rounded-none rounded-r-lg"
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="border-b border-border flex-shrink-0">
        <div className="flex items-center gap-1 p-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                selectedCategory === category.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              {category.label}
              {category.count && (
                <span className="ml-2 text-xs opacity-70">({category.count})</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {viewMode === 'list' ? (
          <div className="p-2 sm:p-4">
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              {/* Table Header - Hidden on mobile */}
              <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-3 bg-muted/50 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <div className="col-span-1">Fav</div>
                <div className="col-span-2">Symbol</div>
                <div className="col-span-3">Name</div>
                <div className="col-span-2 text-right">Price</div>
                <div className="col-span-2 text-right">Change</div>
                <div className="col-span-2 text-right">Volume</div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-border">
                {filteredSecurities.map((security) => (
                  <div
                    key={security.id}
                    onClick={() => handleSecurityClick(security)}
                    className="grid grid-cols-12 gap-2 sm:gap-4 px-2 sm:px-4 py-3 items-center hover:bg-muted/50 cursor-pointer transition-colors"
                  >
                    <div className="col-span-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(security.id);
                        }}
                        className={cn(
                          'p-1 rounded transition-colors',
                          security.isFavorite ? 'text-yellow-500' : 'text-muted-foreground hover:text-yellow-500'
                        )}
                      >
                        <Star className={cn('w-3 h-3 sm:w-4 sm:h-4', security.isFavorite && 'fill-current')} />
                      </button>
                    </div>
                    <div className="col-span-5 md:col-span-2">
                      <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2">
                        <span className="font-semibold text-sm sm:text-base">{security.symbol}</span>
                        <Badge variant="outline" className="text-xs w-fit">
                          {security.category}
                        </Badge>
                      </div>
                    </div>
                    <div className="hidden md:block md:col-span-3">
                      <span className="text-sm text-muted-foreground">{security.name}</span>
                    </div>
                    <div className="col-span-3 md:col-span-2 text-right">
                      <span className="font-mono font-medium text-sm sm:text-base">
                        {security.priceStats.close.toFixed(2)}
                      </span>
                    </div>
                    <div className="col-span-3 md:col-span-2 text-right">
                      <div className={cn(
                        'flex items-center justify-end gap-0.5 sm:gap-1',
                        security.priceStats.change >= 0 ? 'text-bullish' : 'text-bearish'
                      )}>
                        {security.priceStats.change >= 0 ? (
                          <TrendingUp className="w-2 h-2 sm:w-3 sm:h-3" />
                        ) : (
                          <TrendingDown className="w-2 h-2 sm:w-3 sm:h-3" />
                        )}
                        <span className="font-mono text-xs sm:text-sm">
                          {security.priceStats.change >= 0 ? '+' : ''}
                          {security.priceStats.changePercent.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                    <div className="hidden md:block md:col-span-2 text-right">
                      <span className="font-mono text-sm text-muted-foreground">
                        {(security.priceStats.volume / 1000000).toFixed(1)}M
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredSecurities.map((security) => (
              <div
                key={security.id}
                onClick={() => handleSecurityClick(security)}
                className="bg-card border border-border rounded-lg p-4 hover:border-primary/50 cursor-pointer transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg">{security.symbol}</span>
                      <Badge variant="outline" className="text-xs">
                        {security.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{security.name}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(security.id);
                    }}
                    className={cn(
                      'p-1.5 rounded-lg transition-colors',
                      security.isFavorite ? 'text-yellow-500' : 'text-muted-foreground hover:text-yellow-500'
                    )}
                  >
                    <Star className={cn('w-5 h-5', security.isFavorite && 'fill-current')} />
                  </button>
                </div>

                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-2xl font-bold font-mono">
                      {security.priceStats.close.toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Vol: {(security.priceStats.volume / 1000000).toFixed(1)}M
                    </p>
                  </div>
                  <div className={cn(
                    'flex items-center gap-1 px-2 py-1 rounded-lg',
                    security.priceStats.change >= 0 ? 'bg-bullish/10 text-bullish' : 'bg-bearish/10 text-bearish'
                  )}>
                    {security.priceStats.change >= 0 ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    <span className="font-mono font-medium">
                      {security.priceStats.change >= 0 ? '+' : ''}
                      {security.priceStats.changePercent.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
