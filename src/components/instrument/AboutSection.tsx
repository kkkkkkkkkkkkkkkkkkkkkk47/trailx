import { 
  Building2, 
  Users, 
  MapPin, 
  Globe, 
  UserCircle,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Percent,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Security } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AboutSectionProps {
  security: Security;
}

export function AboutSection({ security }: AboutSectionProps) {
  const { companyProfile, financials, highlights, priceStats } = security;

  const formatNumber = (num: number, prefix: string = '') => {
    if (num >= 1e12) return `${prefix}${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `${prefix}${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `${prefix}${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `${prefix}${(num / 1e3).toFixed(2)}K`;
    return `${prefix}${num.toFixed(2)}`;
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        {/* Company Profile */}
        {companyProfile && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Company Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {companyProfile.description}
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Headquarters</p>
                    <p className="text-sm font-medium">{companyProfile.headquarters}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Users className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Employees</p>
                    <p className="text-sm font-medium">{companyProfile.employees.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <UserCircle className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">CEO</p>
                    <p className="text-sm font-medium">{companyProfile.ceo}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Globe className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Website</p>
                    <a 
                      href={companyProfile.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      Visit
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Sector: {companyProfile.sector}</Badge>
                <Badge variant="secondary">Industry: {companyProfile.industry}</Badge>
                <Badge variant="secondary">Founded: {companyProfile.founded}</Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Price Highlights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Price Highlights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Open</p>
                <p className="text-lg font-mono font-medium">{priceStats.open.toFixed(2)}</p>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">High</p>
                <p className="text-lg font-mono font-medium">{priceStats.high.toFixed(2)}</p>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Low</p>
                <p className="text-lg font-mono font-medium">{priceStats.low.toFixed(2)}</p>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Close</p>
                <p className="text-lg font-mono font-medium">{priceStats.close.toFixed(2)}</p>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Bid</p>
                <p className="text-lg font-mono font-medium text-bullish">{priceStats.bid.toFixed(2)}</p>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Ask</p>
                <p className="text-lg font-mono font-medium text-bearish">{priceStats.ask.toFixed(2)}</p>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Volume</p>
                <p className="text-lg font-mono font-medium">
                  {(priceStats.volume / 1000000).toFixed(1)}M
                </p>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Change</p>
                <p className={cn(
                  'text-lg font-mono font-medium',
                  priceStats.change >= 0 ? 'text-bullish' : 'text-bearish'
                )}>
                  {priceStats.change >= 0 ? '+' : ''}
                  {priceStats.changePercent.toFixed(2)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Statistics */}
        {highlights && highlights.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Key Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {highlights.map((highlight, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm text-muted-foreground">{highlight.label}</span>
                    <div className="flex items-center gap-1">
                      <span className="font-mono font-medium">{highlight.value}</span>
                      {highlight.trend && (
                        highlight.trend === 'up' ? (
                          <TrendingUp className="w-3 h-3 text-bullish" />
                        ) : highlight.trend === 'down' ? (
                          <TrendingDown className="w-3 h-3 text-bearish" />
                        ) : null
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Financials */}
        {financials && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                Financial Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Revenue</span>
                  </div>
                  <p className="text-lg font-mono font-medium">{formatNumber(financials.revenue, '$')}</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Net Income</span>
                  </div>
                  <p className="text-lg font-mono font-medium">{formatNumber(financials.netIncome, '$')}</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Percent className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Gross Margin</span>
                  </div>
                  <p className="text-lg font-mono font-medium">{financials.grossMargin.toFixed(1)}%</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Percent className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Profit Margin</span>
                  </div>
                  <p className="text-lg font-mono font-medium">{financials.profitMargin.toFixed(1)}%</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Percent className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">ROE</span>
                  </div>
                  <p className="text-lg font-mono font-medium">{financials.roe.toFixed(1)}%</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Percent className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">ROA</span>
                  </div>
                  <p className="text-lg font-mono font-medium">{financials.roa.toFixed(1)}%</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Total Assets</span>
                  </div>
                  <p className="text-lg font-mono font-medium">{formatNumber(financials.totalAssets, '$')}</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Cash Flow</span>
                  </div>
                  <p className="text-lg font-mono font-medium">{formatNumber(financials.cashFlow, '$')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Valuation Metrics */}
        {companyProfile && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Valuation Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Market Cap</p>
                  <p className="text-lg font-mono font-medium">{formatNumber(companyProfile.marketCap, '$')}</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">P/E Ratio</p>
                  <p className="text-lg font-mono font-medium">{companyProfile.peRatio.toFixed(2)}</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Dividend Yield</p>
                  <p className="text-lg font-mono font-medium">{(companyProfile.dividendYield * 100).toFixed(2)}%</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">EPS</p>
                  <p className="text-lg font-mono font-medium">
                    ${(companyProfile.marketCap / priceStats.close / 1e9).toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ScrollArea>
  );
}
