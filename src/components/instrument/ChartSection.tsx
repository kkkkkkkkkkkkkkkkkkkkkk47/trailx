import { useEffect, useRef, useState, useCallback } from 'react';
import { 
  CandlestickChart, 
  LineChart, 
  BarChart3, 
  Settings,
  Grid3X3,
  Layers,
  TrendingUp,
  Crosshair,
  Pencil,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useTrading } from '@/store/TradingContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Security, Indicator, ChartLayout } from '@/types';
import { ChartType, Timeframe } from '@/types';
import { generateOHLCData, availableIndicators } from '@/data/mockData';

interface ChartSectionProps {
  security: Security;
}

const timeframes = [
  { value: Timeframe.M1, label: '1m' },
  { value: Timeframe.M5, label: '5m' },
  { value: Timeframe.M15, label: '15m' },
  { value: Timeframe.M30, label: '30m' },
  { value: Timeframe.H1, label: '1H' },
  { value: Timeframe.H4, label: '4H' },
  { value: Timeframe.D1, label: '1D' },
  { value: Timeframe.W1, label: '1W' },
  { value: Timeframe.MN1, label: '1M' },
];

const chartTypes = [
  { value: ChartType.LINE, label: 'Line', icon: LineChart },
  { value: ChartType.CANDLESTICK, label: 'Candles', icon: CandlestickChart },
  { value: ChartType.HEIKEN_ASHI, label: 'Heiken-Ashi', icon: CandlestickChart },
  { value: ChartType.RENKO, label: 'Renko', icon: BarChart3 },
  { value: ChartType.KAGI, label: 'Kagi', icon: TrendingUp },
];

const layoutOptions: { value: ChartLayout; label: string }[] = [
  { value: '1x1', label: '1x1' },
  { value: '1x2', label: '1x2' },
  { value: '2x1', label: '2x1' },
  { value: '2x2', label: '2x2' },
  { value: '2x3', label: '2x3' },
  { value: '3x2', label: '3x2' },
  { value: '3x3', label: '3x3' },
  { value: '4x4', label: '4x4' },
];

export function ChartSection({ security }: ChartSectionProps) {
  const { state, dispatch, updateChartTimeframe, updateChartType, addIndicator } = useTrading();
  const { chartTabs, activeChartTabId, chartSettings } = state;
  
  const activeTab = chartTabs.find(tab => tab.id === activeChartTabId) || chartTabs[0];
  const activeChart = activeTab?.charts[0];
  
  const [chartData, setChartData] = useState<Array<{time: number; open: number; high: number; low: number; close: number; volume: number}>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredPrice, setHoveredPrice] = useState<number | null>(null);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [showReplay, setShowReplay] = useState(false);

  // Generate chart data
  useEffect(() => {
    setIsLoading(true);
    const data = generateOHLCData(
      security.priceStats.close,
      200,
      activeChart?.timeframe || Timeframe.H1
    );
    setChartData(data);
    setIsLoading(false);
  }, [security.id, activeChart?.timeframe]);

  // Draw chart
  useEffect(() => {
    if (!canvasRef.current || chartData.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const width = rect.width;
    const height = rect.height;
    const padding = { top: 20, right: 60, bottom: 40, left: 10 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    // Clear canvas
    ctx.fillStyle = chartSettings.backgroundColor;
    ctx.fillRect(0, 0, width, height);

    // Calculate price range
    const prices = chartData.flatMap(d => [d.high, d.low]);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice;
    const pricePadding = priceRange * 0.1;

    // Draw grid
    ctx.strokeStyle = chartSettings.gridColor;
    ctx.lineWidth = 0.5;

    // Horizontal grid lines
    const gridLines = 8;
    for (let i = 0; i <= gridLines; i++) {
      const y = padding.top + (chartHeight / gridLines) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();

      // Price labels
      const price = maxPrice + pricePadding - ((priceRange + pricePadding * 2) / gridLines) * i;
      ctx.fillStyle = chartSettings.textColor;
      ctx.font = '11px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(price.toFixed(2), width - padding.right + 5, y + 3);
    }

    // Vertical grid lines (time)
    const timeLines = 10;
    for (let i = 0; i <= timeLines; i++) {
      const x = padding.left + (chartWidth / timeLines) * i;
      ctx.beginPath();
      ctx.moveTo(x, padding.top);
      ctx.lineTo(x, height - padding.bottom);
      ctx.stroke();
    }

    // Draw candles/bars
    const candleWidth = (chartWidth / chartData.length) * 0.8;
    const candleSpacing = chartWidth / chartData.length;

    chartData.forEach((candle, i) => {
      const x = padding.left + i * candleSpacing + candleSpacing / 2;
      const openY = padding.top + ((maxPrice + pricePadding - candle.open) / (priceRange + pricePadding * 2)) * chartHeight;
      const closeY = padding.top + ((maxPrice + pricePadding - candle.close) / (priceRange + pricePadding * 2)) * chartHeight;
      const highY = padding.top + ((maxPrice + pricePadding - candle.high) / (priceRange + pricePadding * 2)) * chartHeight;
      const lowY = padding.top + ((maxPrice + pricePadding - candle.low) / (priceRange + pricePadding * 2)) * chartHeight;

      const isBullish = candle.close >= candle.open;
      const color = isBullish ? chartSettings.bullishColor : chartSettings.bearishColor;

      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = 1;

      // Draw wick
      if (chartSettings.wickVisible) {
        ctx.beginPath();
        ctx.moveTo(x, highY);
        ctx.lineTo(x, lowY);
        ctx.stroke();
      }

      // Draw body
      const bodyTop = Math.min(openY, closeY);
      const bodyHeight = Math.max(Math.abs(closeY - openY), 1);

      if (activeChart?.type === ChartType.CANDLESTICK || activeChart?.type === ChartType.HEIKEN_ASHI) {
        ctx.fillRect(x - candleWidth / 2, bodyTop, candleWidth, bodyHeight);
      } else if (activeChart?.type === ChartType.LINE) {
        // Line chart - draw line connecting closes
        if (i > 0) {
          const prevCandle = chartData[i - 1];
          const prevX = padding.left + (i - 1) * candleSpacing + candleSpacing / 2;
          const prevCloseY = padding.top + ((maxPrice + pricePadding - prevCandle.close) / (priceRange + pricePadding * 2)) * chartHeight;
          
          ctx.strokeStyle = chartSettings.bullishColor;
          ctx.lineWidth = chartSettings.lineWidth;
          ctx.beginPath();
          ctx.moveTo(prevX, prevCloseY);
          ctx.lineTo(x, closeY);
          ctx.stroke();
        }
      }
    });

    // Draw volume bars at bottom
    const volumeHeight = chartHeight * 0.2;
    const maxVolume = Math.max(...chartData.map(d => d.volume));

    chartData.forEach((candle, i) => {
      const x = padding.left + i * candleSpacing + candleSpacing / 2;
      const volumeBarHeight = (candle.volume / maxVolume) * volumeHeight;
      const isBullish = candle.close >= candle.open;
      
      ctx.fillStyle = isBullish 
        ? `${chartSettings.bullishColor}40` 
        : `${chartSettings.bearishColor}40`;
      
      ctx.fillRect(
        x - candleWidth / 2,
        height - padding.bottom - volumeBarHeight,
        candleWidth,
        volumeBarHeight
      );
    });

    // Draw crosshair if hovering
    if (hoveredPrice !== null && chartSettings.showCrosshair) {
      ctx.strokeStyle = chartSettings.textColor;
      ctx.lineWidth = 0.5;
      ctx.setLineDash([5, 5]);
      
      // Horizontal line
      const y = padding.top + ((maxPrice + pricePadding - hoveredPrice) / (priceRange + pricePadding * 2)) * chartHeight;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();
      
      ctx.setLineDash([]);
    }

  }, [chartData, chartSettings, activeChart?.type, hoveredPrice]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || chartData.length === 0) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const padding = { top: 20, right: 60, bottom: 40, left: 10 };
    const chartHeight = rect.height - padding.top - padding.bottom;
    
    const prices = chartData.flatMap(d => [d.high, d.low]);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice;
    const pricePadding = priceRange * 0.1;
    
    const y = e.clientY - rect.top;
    const price = maxPrice + pricePadding - ((y - padding.top) / chartHeight) * (priceRange + pricePadding * 2);
    
    setHoveredPrice(price);
  }, [chartData]);

  const handleMouseLeave = useCallback(() => {
    setHoveredPrice(null);
  }, []);

  const changeLayout = (layout: ChartLayout) => {
    dispatch({ type: 'UPDATE_CHART_LAYOUT', payload: { tabId: activeTab.id, layout } });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Chart Toolbar */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-muted/30 overflow-x-auto flex-shrink-0">
        {/* Left - Chart Controls */}
        <div className="flex items-center gap-2">
          {/* Chart Type */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1">
                <CandlestickChart className="w-4 h-4" />
                <span className="hidden sm:inline">{activeChart?.type || 'Candles'}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Chart Type</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {chartTypes.map((type) => (
                <DropdownMenuItem
                  key={type.value}
                  onClick={() => activeChart && updateChartType(activeChart.id, type.value)}
                >
                  <type.icon className="w-4 h-4 mr-2" />
                  {type.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Timeframe */}
          <div className="overflow-x-auto">
            <Tabs
              value={activeChart?.timeframe}
              onValueChange={(value) => activeChart && updateChartTimeframe(activeChart.id, value as Timeframe)}
            >
              <TabsList className="h-8">
                {timeframes.map((tf) => (
                  <TabsTrigger key={tf.value} value={tf.value} className="text-xs px-2">
                    {tf.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Center - Drawing Tools */}
        <div className="hidden md:flex items-center gap-1">
          <Button
            variant={selectedTool === 'crosshair' ? 'secondary' : 'ghost'}
            size="icon"
            className="h-8 w-8"
            onClick={() => setSelectedTool(selectedTool === 'crosshair' ? null : 'crosshair')}
          >
            <Crosshair className="w-4 h-4" />
          </Button>
          <Button
            variant={selectedTool === 'line' ? 'secondary' : 'ghost'}
            size="icon"
            className="h-8 w-8"
            onClick={() => setSelectedTool(selectedTool === 'line' ? null : 'line')}
          >
            <TrendingUp className="w-4 h-4" />
          </Button>
          <Button
            variant={selectedTool === 'pencil' ? 'secondary' : 'ghost'}
            size="icon"
            className="h-8 w-8"
            onClick={() => setSelectedTool(selectedTool === 'pencil' ? null : 'pencil')}
          >
            <Pencil className="w-4 h-4" />
          </Button>
        </div>

        {/* Right - Layout & Tools */}
        <div className="flex items-center gap-2 ml-auto flex-shrink-0">
          {/* Indicators */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1">
                <Layers className="w-4 h-4" />
                <span className="hidden sm:inline">Indicators</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Add Indicator</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {availableIndicators.map((indicator) => (
                <DropdownMenuItem
                  key={indicator.type}
                  onClick={() => {
                    if (activeChart) {
                      const newIndicator: Indicator = {
                        id: `ind-${Date.now()}`,
                        type: indicator.type,
                        name: indicator.name,
                        parameters: [{ name: 'period', value: 14 }],
                        color: '#22c55e',
                        lineStyle: 'solid',
                        lineWidth: 1,
                        visible: true,
                        overlay: false,
                      };
                      addIndicator(activeChart.id, newIndicator);
                    }
                  }}
                >
                  {indicator.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Layout */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1">
                <Grid3X3 className="w-4 h-4" />
                <span className="hidden sm:inline">Layout</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Chart Layout</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {layoutOptions.map((layout) => (
                <DropdownMenuItem
                  key={layout.value}
                  onClick={() => changeLayout(layout.value)}
                >
                  {layout.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Replay */}
          <Button
            variant={showReplay ? 'secondary' : 'ghost'}
            size="sm"
            className="gap-1"
            onClick={() => setShowReplay(!showReplay)}
          >
            <Play className="w-4 h-4" />
            <span className="hidden sm:inline">Replay</span>
          </Button>

          {/* Settings */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Settings className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Chart Settings</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => dispatch({ type: 'UPDATE_CHART_SETTINGS', payload: { showGrid: !chartSettings.showGrid } })}>
                {chartSettings.showGrid ? 'Hide' : 'Show'} Grid
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => dispatch({ type: 'UPDATE_CHART_SETTINGS', payload: { showVolume: !chartSettings.showVolume } })}>
                {chartSettings.showVolume ? 'Hide' : 'Show'} Volume
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => dispatch({ type: 'UPDATE_CHART_SETTINGS', payload: { wickVisible: !chartSettings.wickVisible } })}>
                {chartSettings.wickVisible ? 'Hide' : 'Show'} Wicks
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Replay Controls */}
      {showReplay && (
        <div className="flex items-center gap-4 px-4 py-2 bg-muted/50 border-b border-border">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="secondary" size="sm" className="gap-1">
            <Play className="w-4 h-4" />
            Play
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Pause className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ChevronRight className="w-4 h-4" />
          </Button>
          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full w-1/3 bg-primary" />
          </div>
          <span className="text-xs text-muted-foreground">1x</span>
        </div>
      )}

      {/* Chart Area */}
      <div className="flex-1 relative bg-[#0a0a0a]">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : (
          <canvas
            ref={canvasRef}
            className="w-full h-full cursor-crosshair"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          />
        )}

        {/* OHLC Tooltip */}
        {hoveredPrice !== null && chartSettings.showOHLC && (
          <div className="absolute top-4 left-4 bg-card/90 backdrop-blur border border-border rounded-lg p-2 text-xs">
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              <span className="text-muted-foreground">O:</span>
              <span className="font-mono">{hoveredPrice.toFixed(2)}</span>
              <span className="text-muted-foreground">H:</span>
              <span className="font-mono">{(hoveredPrice * 1.002).toFixed(2)}</span>
              <span className="text-muted-foreground">L:</span>
              <span className="font-mono">{(hoveredPrice * 0.998).toFixed(2)}</span>
              <span className="text-muted-foreground">C:</span>
              <span className="font-mono">{hoveredPrice.toFixed(2)}</span>
            </div>
          </div>
        )}

        {/* Price Scale */}
        <div className="absolute top-0 right-0 bottom-0 w-16 bg-card/50 border-l border-border">
          {/* Price labels drawn on canvas */}
        </div>

        {/* Time Scale */}
        <div className="absolute left-0 right-0 bottom-0 h-8 bg-card/50 border-t border-border flex items-center justify-between px-4">
          <span className="text-xs text-muted-foreground">{security.symbol}</span>
          <span className="text-xs text-muted-foreground">
            {activeChart?.timeframe.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Bottom Panel - Indicators */}
      {activeChart && activeChart.indicators.length > 0 && (
        <div className="h-32 border-t border-border bg-muted/30 p-2">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-muted-foreground">Indicators:</span>
            {activeChart.indicators.map((ind) => (
              <span key={ind.id} className="text-xs px-2 py-0.5 bg-muted rounded">
                {ind.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
