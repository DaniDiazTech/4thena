"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronRight, TrendingUp, DollarSign, Receipt } from "lucide-react"

interface Merchant {
  id: string
  name: string
  category: string
  description: string
  stats?: {
    transactions: string
    volume: string
    avgTicket: string
  }
}

interface MerchantCardProps {
  merchant: Merchant
  onClick: () => void
}

export function MerchantCard({ merchant, onClick }: MerchantCardProps) {
  return (
    <Card
      className="p-5 cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.01] hover:border-primary/50 bg-card group"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onClick()
        }
      }}
      aria-label={`View details for ${merchant.name}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
              {merchant.name}
            </h3>
            <Badge variant="secondary" className="text-xs">
              {merchant.category}
            </Badge>
          </div>

          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{merchant.description}</p>

          {/* <div className="grid grid-cols-3 gap-4"> */}
          {/*   <div className="flex items-center gap-2"> */}
          {/*     <Receipt className="h-4 w-4 text-primary shrink-0" /> */}
          {/*     <div className="min-w-0"> */}
          {/*       <div className="text-xs text-muted-foreground">Transactions</div> */}
          {/*       <div className="text-sm font-semibold text-foreground truncate">{merchant.stats.transactions}</div> */}
          {/*     </div> */}
          {/*   </div> */}

          {/*   <div className="flex items-center gap-2"> */}
          {/*     <DollarSign className="h-4 w-4 text-primary shrink-0" /> */}
          {/*     <div className="min-w-0"> */}
          {/*       <div className="text-xs text-muted-foreground">Volume</div> */}
          {/*       <div className="text-sm font-semibold text-foreground truncate">{merchant.stats.volume}</div> */}
          {/*     </div> */}
          {/*   </div> */}
          {/**/}
          {/*   <div className="flex items-center gap-2"> */}
          {/*     <TrendingUp className="h-4 w-4 text-primary shrink-0" /> */}
          {/*     <div className="min-w-0"> */}
          {/*       <div className="text-xs text-muted-foreground">Avg Ticket</div> */}
          {/*       <div className="text-sm font-semibold text-foreground truncate">{merchant.stats.avgTicket}</div> */}
          {/*     </div> */}
          {/*   </div> */}
          {/* </div> */}
        </div>

        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0 mt-1" />
      </div>
    </Card>
  )
}
