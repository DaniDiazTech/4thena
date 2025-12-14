"use client"

import { useState } from "react"
import { ChevronRight, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface Merchant {
  id: string
  name: string
  category: string
  description: string
}

interface MerchantSidebarProps {
  merchant: Merchant
}

export function MerchantSidebar({ merchant }: MerchantSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div
      className={cn(
        "relative flex flex-col border-l bg-card transition-all duration-300 ease-in-out",
        isCollapsed ? "w-12" : "w-80"
      )}
    >
      {/* Toggle Button */}
      <div className="flex h-12 items-center justify-start px-2 border-b">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
      </div>

      {/* Content Container */}
      <div className={cn("flex-1 overflow-y-auto overflow-x-hidden", isCollapsed && "invisible")}>
        <div className="p-6 space-y-6 min-w-[20rem]">
          {/* Header */}
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-1 break-words">{merchant.name}</h2>
            <Badge variant="secondary" className="text-xs">
              {merchant.category}
            </Badge>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-medium text-foreground mb-2">About</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{merchant.description}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
