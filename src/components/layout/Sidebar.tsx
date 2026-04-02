import { 
  TrendingUp, 
  BarChart3, 
  Star, 
  Briefcase, 
  History, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Layers,
  LineChart
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTrading } from '@/store/TradingContext';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { ViewMode } from '@/types';

interface NavItem {
  id: ViewMode;
  label: string;
  icon: React.ElementType;
  badge?: number;
}

const navItems: NavItem[] = [
  { id: 'markets', label: 'Markets', icon: TrendingUp },
  { id: 'quotes', label: 'Quotes', icon: BarChart3 },
];

const toolItems = [
  { id: 'portfolio', label: 'Portfolio', icon: Briefcase, badge: 3 },
  { id: 'orders', label: 'Orders', icon: Layers, badge: 5 },
  { id: 'history', label: 'History', icon: History },
  { id: 'watchlist', label: 'Watchlist', icon: Star },
];

export function Sidebar() {
  const { state, dispatch, setView } = useTrading();
  const { sidebarCollapsed, currentView, favorites } = state;

  const toggleSidebar = () => {
    dispatch({ type: 'TOGGLE_SIDEBAR' });
  };

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 flex flex-col h-screen bg-card border-r border-border transition-all duration-300 z-30',
        sidebarCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between h-14 px-4 border-b border-border">
        {!sidebarCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <LineChart className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg tracking-tight">TrailX</span>
          </div>
        )}
        {sidebarCollapsed && (
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center mx-auto">
            <LineChart className="w-5 h-5 text-primary-foreground" />
          </div>
        )}
        {!sidebarCollapsed && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-8 w-8"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
        )}
      </div>

      {sidebarCollapsed && (
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="h-8 w-8 mx-auto mt-2"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      )}

      <ScrollArea className="flex-1 py-4">
        {/* Main Navigation */}
        <div className={cn('space-y-1', sidebarCollapsed ? 'px-2' : 'px-3')}>
          {!sidebarCollapsed && (
            <p className="text-xs font-medium text-muted-foreground px-2 mb-2 uppercase tracking-wider">
              Trading
            </p>
          )}
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={cn(
                'flex items-center gap-3 w-full rounded-lg transition-colors',
                sidebarCollapsed ? 'justify-center p-2' : 'px-3 py-2',
                currentView === item.id
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!sidebarCollapsed && <span className="text-sm font-medium">{item.label}</span>}
            </button>
          ))}
        </div>

        {/* Tools Section */}
        <div className={cn('mt-6 space-y-1', sidebarCollapsed ? 'px-2' : 'px-3')}>
          {!sidebarCollapsed && (
            <p className="text-xs font-medium text-muted-foreground px-2 mb-2 uppercase tracking-wider">
              Tools
            </p>
          )}
          {toolItems.map((item) => (
            <button
              key={item.id}
              className={cn(
                'flex items-center gap-3 w-full rounded-lg transition-colors text-muted-foreground hover:bg-muted hover:text-foreground',
                sidebarCollapsed ? 'justify-center p-2' : 'px-3 py-2'
              )}
            >
              <div className="relative">
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {item.badge && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-[10px] text-primary-foreground rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              {!sidebarCollapsed && (
                <div className="flex items-center justify-between flex-1">
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Favorites Section */}
        {!sidebarCollapsed && favorites.length > 0 && (
          <div className="mt-6 px-3">
            <p className="text-xs font-medium text-muted-foreground px-2 mb-2 uppercase tracking-wider">
              Favorites
            </p>
            <div className="space-y-1">
              {favorites.slice(0, 5).map((favId) => {
                const security = state.securities.find(s => s.id === favId);
                if (!security) return null;
                return (
                  <button
                    key={favId}
                    onClick={() => setView('instrument')}
                    className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  >
                    <span className="font-medium">{security.symbol}</span>
                    <span className={cn(
                      'text-xs',
                      security.priceStats.change >= 0 ? 'text-bullish' : 'text-bearish'
                    )}>
                      {security.priceStats.change >= 0 ? '+' : ''}
                      {security.priceStats.changePercent.toFixed(2)}%
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </ScrollArea>

      {/* Bottom Actions */}
      <div className={cn('p-3 border-t border-border', sidebarCollapsed && 'px-2')}>
        <button
          className={cn(
            'flex items-center gap-3 w-full rounded-lg transition-colors text-muted-foreground hover:bg-muted hover:text-foreground',
            sidebarCollapsed ? 'justify-center p-2' : 'px-3 py-2'
          )}
        >
          <Settings className="w-5 h-5 flex-shrink-0" />
          {!sidebarCollapsed && <span className="text-sm font-medium">Settings</span>}
        </button>
      </div>
    </aside>
  );
}
