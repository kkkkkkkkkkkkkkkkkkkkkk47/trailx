import { useState } from 'react';
import { 
  ShoppingCart, 
  TrendingUp, 
  TrendingDown, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTrading } from '@/store/TradingContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Security } from '@/types';
import { OrderType, OrderSide, OrderStatus } from '@/types';

interface OrderSectionProps {
  security: Security;
}

export function OrderSection({ security }: OrderSectionProps) {
  const { addOrder } = useTrading();
  const [orderSide, setOrderSide] = useState<OrderSide>(OrderSide.BUY);
  const [orderType, setOrderType] = useState<OrderType>(OrderType.MARKET);
  const [quantity, setQuantity] = useState<string>('100');
  const [price, setPrice] = useState<string>(security.priceStats.ask.toFixed(2));
  const [stopLoss, setStopLoss] = useState<string>('');
  const [takeProfit, setTakeProfit] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const currentPrice = orderSide === OrderSide.BUY 
    ? security.priceStats.ask 
    : security.priceStats.bid;

  const estimatedTotal = parseFloat(quantity || '0') * parseFloat(price || currentPrice.toString());

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate order submission
    await new Promise(resolve => setTimeout(resolve, 500));
    
    addOrder({
      securityId: security.id,
      symbol: security.symbol,
      side: orderSide,
      type: orderType,
      quantity: parseFloat(quantity),
      price: orderType !== OrderType.MARKET ? parseFloat(price) : undefined,
      stopPrice: undefined,
      status: OrderStatus.OPEN,
      filledQuantity: 0,
    });
    
    setIsSubmitting(false);
    setShowConfirmation(true);
    
    setTimeout(() => setShowConfirmation(false), 3000);
  };

  const isValidOrder = () => {
    if (!quantity || parseFloat(quantity) <= 0) return false;
    if (orderType !== OrderType.MARKET && (!price || parseFloat(price) <= 0)) return false;
    return true;
  };

  return (
    <div className="h-full flex">
      {/* Order Form */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">New Order</h2>
              <p className="text-sm text-muted-foreground">
                {security.symbol} - {security.name}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{security.exchange}</Badge>
              <Badge variant="secondary">{security.currency}</Badge>
            </div>
          </div>

          {/* Buy/Sell Toggle */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setOrderSide(OrderSide.BUY)}
              className={cn(
                'flex items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all',
                orderSide === OrderSide.BUY
                  ? 'border-bullish bg-bullish/10 text-bullish'
                  : 'border-muted bg-muted/30 text-muted-foreground hover:border-bullish/50'
              )}
            >
              <TrendingUp className="w-5 h-5" />
              <span className="font-semibold">Buy</span>
            </button>
            <button
              onClick={() => setOrderSide(OrderSide.SELL)}
              className={cn(
                'flex items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all',
                orderSide === OrderSide.SELL
                  ? 'border-bearish bg-bearish/10 text-bearish'
                  : 'border-muted bg-muted/30 text-muted-foreground hover:border-bearish/50'
              )}
            >
              <TrendingDown className="w-5 h-5" />
              <span className="font-semibold">Sell</span>
            </button>
          </div>

          {/* Order Type */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Order Type</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={orderType} onValueChange={(v) => setOrderType(v as OrderType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={OrderType.MARKET}>Market Order</SelectItem>
                  <SelectItem value={OrderType.LIMIT}>Limit Order</SelectItem>
                  <SelectItem value={OrderType.STOP}>Stop Order</SelectItem>
                  <SelectItem value={OrderType.STOP_LIMIT}>Stop Limit Order</SelectItem>
                </SelectContent>
              </Select>
              
              <p className="text-xs text-muted-foreground mt-2">
                {orderType === OrderType.MARKET && 'Execute immediately at the best available price.'}
                {orderType === OrderType.LIMIT && 'Execute at the specified price or better.'}
                {orderType === OrderType.STOP && 'Trigger a market order when the stop price is reached.'}
                {orderType === OrderType.STOP_LIMIT && 'Trigger a limit order when the stop price is reached.'}
              </p>
            </CardContent>
          </Card>

          {/* Order Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Order Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Quantity */}
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <div className="flex gap-2">
                  <Input
                    id="quantity"
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="flex-1"
                    min="0"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity('100')}
                  >
                    100
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity('500')}
                  >
                    500
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity('1000')}
                  >
                    1000
                  </Button>
                </div>
              </div>

              {/* Price (for non-market orders) */}
              {orderType !== OrderType.MARKET && (
                <div className="space-y-2">
                  <Label htmlFor="price">
                    {orderType === OrderType.LIMIT ? 'Limit Price' : 'Trigger Price'}
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    step="0.01"
                  />
                </div>
              )}

              {/* Stop Loss & Take Profit */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stopLoss">Stop Loss (Optional)</Label>
                  <Input
                    id="stopLoss"
                    type="number"
                    value={stopLoss}
                    onChange={(e) => setStopLoss(e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="takeProfit">Take Profit (Optional)</Label>
                  <Input
                    id="takeProfit"
                    type="number"
                    value={takeProfit}
                    onChange={(e) => setTakeProfit(e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Side</span>
                <span className={cn(
                  'font-medium',
                  orderSide === OrderSide.BUY ? 'text-bullish' : 'text-bearish'
                )}>
                  {orderSide.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Type</span>
                <span className="font-medium uppercase">{orderType.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Quantity</span>
                <span className="font-mono">{quantity}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Price</span>
                <span className="font-mono">
                  {orderType === OrderType.MARKET ? 'Market' : `$${parseFloat(price).toFixed(2)}`}
                </span>
              </div>
              <div className="border-t border-border my-2" />
              <div className="flex justify-between">
                <span className="font-medium">Estimated Total</span>
                <span className="font-mono font-bold">${estimatedTotal.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={!isValidOrder() || isSubmitting}
            className={cn(
              'w-full py-6 text-lg font-semibold',
              orderSide === OrderSide.BUY 
                ? 'bg-bullish hover:bg-bullish/90' 
                : 'bg-bearish hover:bg-bearish/90'
            )}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                Submitting...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                {orderSide === OrderSide.BUY ? 'Buy' : 'Sell'} {security.symbol}
              </span>
            )}
          </Button>

          {/* Confirmation Message */}
          {showConfirmation && (
            <div className="flex items-center gap-2 p-4 bg-bullish/10 border border-bullish/30 rounded-lg text-bullish animate-fade-in">
              <CheckCircle2 className="w-5 h-5" />
              <span>Order submitted successfully!</span>
            </div>
          )}
        </div>
      </div>

      {/* Side Panel - Market Info */}
      <div className="w-80 border-l border-border bg-muted/30 p-6 hidden lg:block">
        <h3 className="font-semibold mb-4">Market Info</h3>
        
        <div className="space-y-4">
          <div className="p-3 bg-card rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Current Price</p>
            <p className="text-2xl font-mono font-bold">{currentPrice.toFixed(2)}</p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 bg-card rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Bid</p>
              <p className="font-mono text-bullish">{security.priceStats.bid.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-card rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Ask</p>
              <p className="font-mono text-bearish">{security.priceStats.ask.toFixed(2)}</p>
            </div>
          </div>

          <div className="p-3 bg-card rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Spread</p>
            <p className="font-mono">{(security.priceStats.ask - security.priceStats.bid).toFixed(4)}</p>
          </div>

          <div className="p-3 bg-card rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Day Range</p>
            <div className="flex justify-between">
              <span className="font-mono">{security.priceStats.low.toFixed(2)}</span>
              <span className="text-muted-foreground">-</span>
              <span className="font-mono">{security.priceStats.high.toFixed(2)}</span>
            </div>
          </div>

          <div className="p-3 bg-card rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Volume</p>
            <p className="font-mono">{(security.priceStats.volume / 1000000).toFixed(2)}M</p>
          </div>
        </div>

        <div className="border-t border-border my-4" />

        {/* Risk Warning */}
        <div className="flex items-start gap-2 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-yellow-500">
            Trading involves risk. Please ensure you understand the risks before placing an order.
          </p>
        </div>
      </div>
    </div>
  );
}
