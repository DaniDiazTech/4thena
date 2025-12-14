"use client"

import { MessageSquare, TrendingUp, FileSearch, DollarSign } from "lucide-react"
import { Card } from "@/components/ui/card"

interface EmptyChatProps {
  merchantName: string
}

export function EmptyChat({ merchantName }: EmptyChatProps) {
  const suggestions = [
    {
      icon: TrendingUp,
      title: "Transaction Analysis",
      description: "Analyze transaction patterns and trends",
    },
    {
      icon: DollarSign,
      title: "Revenue Insights",
      description: "Get insights on revenue and volume",
    },
    {
      icon: FileSearch,
      title: "Risk Assessment",
      description: "Evaluate merchant risk factors",
    },
    {
      icon: MessageSquare,
      title: "General Questions",
      description: "Ask anything about the merchant",
    },
  ]

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <MessageSquare className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          Ask about <span className="text-primary">{merchantName}</span>
        </h2>
        <p className="text-muted-foreground text-balance max-w-md">
          Get AI-powered insights about transactions, revenue, risk factors, and more
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
        {suggestions.map((suggestion, index) => (
          <Card
            key={index}
            className="p-4 hover:shadow-md hover:border-primary/50 transition-all duration-200 cursor-pointer group"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                <suggestion.icon className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-foreground mb-1 text-sm">{suggestion.title}</h3>
                <p className="text-xs text-muted-foreground">{suggestion.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
