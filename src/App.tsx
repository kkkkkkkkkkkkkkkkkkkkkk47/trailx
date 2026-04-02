// TrailX Trading Platform - Main Application

import { TradingProvider, useTrading } from '@/store/TradingContext';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { MarketsModule } from '@/components/modules/MarketsModule';
import { QuotesModule } from '@/components/modules/QuotesModule';
import { InstrumentView } from '@/components/instrument/InstrumentView';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/sonner';

function MainContent() {
  const { state } = useTrading();
  const { currentView, sidebarCollapsed } = state;

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className={cn(
        'flex-1 flex flex-col min-w-0 transition-all duration-300',
        sidebarCollapsed ? 'ml-16' : 'ml-64'
      )}>
        {/* Header */}
        <Header />

        {/* Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {currentView === 'markets' && <MarketsModule />}
          {currentView === 'quotes' && <QuotesModule />}
          {currentView === 'instrument' && <InstrumentView />}
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <TradingProvider>
      <MainContent />
      <Toaster />
    </TradingProvider>
  );
}

export default App;
