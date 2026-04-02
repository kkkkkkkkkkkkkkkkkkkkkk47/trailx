import { useState } from 'react';
import { 
  Search, 
  Bell, 
  User,
  TrendingUp,
  TrendingDown,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTrading } from '@/store/TradingContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Security } from '@/types';

export function Header() {
  const { state, selectSecurity } = useTrading();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);

  const filteredSecurities = searchQuery
    ? state.securities.filter(
        (s) =>
          s.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleSecuritySelect = (security: Security) => {
    selectSecurity(security.id);
    setSearchQuery('');
    setShowSearchResults(false);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'stocks': return 'bg-blue-500/20 text-blue-400';
      case 'forex': return 'bg-purple-500/20 text-purple-400';
      case 'crypto': return 'bg-orange-500/20 text-orange-400';
      case 'commodities': return 'bg-yellow-500/20 text-yellow-400';
      case 'indices': return 'bg-green-500/20 text-green-400';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <header className="h-14 bg-card border-b border-border flex items-center justify-between px-4">
      {/* Left Section - Search */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search instruments..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchResults(e.target.value.length > 0);
            }}
            onFocus={() => setShowSearchResults(searchQuery.length > 0)}
            className="pl-9 h-9 bg-muted border-0 focus-visible:ring-1"
          />
          
          {/* Search Results Dropdown */}
          {showSearchResults && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowSearchResults(false)}
              />
              <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-xl z-50 max-h-80 overflow-auto">
                {filteredSecurities.length > 0 ? (
                  <div className="py-2">
                    {filteredSecurities.map((security) => (
                      <button
                        key={security.id}
                        onClick={() => handleSecuritySelect(security)}
                        className="w-full px-4 py-2 flex items-center justify-between hover:bg-muted transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn('px-2 py-0.5 rounded text-xs font-medium', getCategoryColor(security.category))}>
                            {security.symbol}
                          </div>
                          <div className="text-left">
                            <p className="text-sm font-medium">{security.name}</p>
                            <p className="text-xs text-muted-foreground">{security.exchange}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{security.priceStats.close.toFixed(2)}</p>
                          <p className={cn(
                            'text-xs',
                            security.priceStats.change >= 0 ? 'text-bullish' : 'text-bearish'
                          )}>
                            {security.priceStats.change >= 0 ? '+' : ''}
                            {security.priceStats.changePercent.toFixed(2)}%
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="px-4 py-3 text-sm text-muted-foreground">
                    No instruments found
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Center Section - Market Ticker */}
      <div className="hidden lg:flex items-center gap-6 px-6">
        {state.securities.slice(0, 4).map((security) => (
          <div key={security.id} className="flex items-center gap-2 text-sm">
            <span className="font-medium text-muted-foreground">{security.symbol}</span>
            <span className="font-semibold">{security.priceStats.close.toFixed(2)}</span>
            <span className={cn(
              'flex items-center gap-0.5 text-xs',
              security.priceStats.change >= 0 ? 'text-bullish' : 'text-bearish'
            )}>
              {security.priceStats.change >= 0 ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              {Math.abs(security.priceStats.changePercent).toFixed(2)}%
            </span>
          </div>
        ))}
      </div>

      {/* Right Section - Actions */}
      <div className="flex items-center gap-2">
        {/* Connection Status */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted">
          <span className="w-2 h-2 rounded-full bg-bullish animate-pulse" />
          <span className="text-xs text-muted-foreground">Connected</span>
          <Clock className="w-3 h-3 text-muted-foreground" />
        </div>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="py-2 px-3 text-sm text-muted-foreground">
              <p>Order filled: AAPL 100 shares @ $178.35</p>
              <p className="text-xs mt-1">2 minutes ago</p>
            </div>
            <DropdownMenuSeparator />
            <div className="py-2 px-3 text-sm text-muted-foreground">
              <p>Price alert: BTC/USD above $68,000</p>
              <p className="text-xs mt-1">15 minutes ago</p>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <User className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Preferences</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
