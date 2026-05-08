import { Info } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { formatPriceDecimals } from '@/lib/formatters'

interface CostBreakdownProps {
  dailyRate: number
  days: number
  depositEur: number
  compact?: boolean
}

export function CostBreakdown({ dailyRate, days, depositEur, compact }: CostBreakdownProps) {
  const total = dailyRate * days

  if (compact) {
    return (
      <div className="flex items-baseline justify-between">
        <span className="font-sans text-sm text-muted">{days} day{days !== 1 ? 's' : ''}</span>
        <span className="font-sans text-lg font-medium text-gold tabular-nums">
          {formatPriceDecimals(total)}
        </span>
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className="space-y-3 rounded-md border border-border bg-black/40 p-4">
        <div className="flex items-center justify-between">
          <span className="font-sans text-sm text-muted">
            {formatPriceDecimals(dailyRate)} × {days} day{days !== 1 ? 's' : ''}
          </span>
          <span className="font-sans text-sm font-medium text-white tabular-nums">
            {formatPriceDecimals(total)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-sans text-sm text-muted">
            Refundable deposit
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="cursor-help">
                  <Info className="h-3.5 w-3.5 text-muted/60" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                A refundable deposit is taken at pickup, held until return, and refunded the same day
                if the vehicle is returned in good condition.
              </TooltipContent>
            </Tooltip>
          </span>
          <span className="font-sans text-sm font-medium text-white tabular-nums">
            {formatPriceDecimals(depositEur)}
          </span>
        </div>

        <div className="border-t border-border pt-3 flex items-center justify-between">
          <span className="font-sans text-sm font-medium text-white">Payment at pickup</span>
          <span className="font-sans text-base font-medium text-gold tabular-nums">
            {formatPriceDecimals(total)}
          </span>
        </div>
      </div>
    </TooltipProvider>
  )
}
