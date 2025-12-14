"use client"

import { User, Bot } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user"

  return (
    <div className={cn("flex items-start gap-3 animate-fade-in", isUser && "flex-row-reverse")}>
      {/* Avatar */}
      <div
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
          isUser ? "bg-primary" : "bg-primary/10",
        )}
      >
        {isUser ? <User className="h-4 w-4 text-primary-foreground" /> : <Bot className="h-4 w-4 text-primary" />}
      </div>

      {/* Message Content */}
      <div className={cn("flex-1 space-y-1", isUser && "items-end flex flex-col")}>
        <div
          className={cn(
            "rounded-2xl px-4 py-3 max-w-[85%] break-words",
            isUser ? "bg-primary text-primary-foreground" : "bg-muted text-foreground",
          )}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        </div>

        <time className="text-xs text-muted-foreground">
          {message.timestamp.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
          })}
        </time>
      </div>
    </div>
  )
}
