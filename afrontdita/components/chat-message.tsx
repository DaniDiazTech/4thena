"use client"

import { User, Bot } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
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
            // Markdown styling
            "text-sm leading-relaxed",
            "[&>ul]:list-disc [&>ul]:pl-4 [&>ol]:list-decimal [&>ol]:pl-4",
            "[&>h1]:font-bold [&>h1]:text-lg [&>h2]:font-bold [&>h2]:text-base",
            "[&>h3]:font-bold",
            "[&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:opacity-80",
            "[&_code]:bg-black/10 [&_code]:dark:bg-white/10 [&_code]:rounded [&_code]:px-1 [&_code]:font-mono",
            "[&_pre]:bg-black/10 [&_pre]:dark:bg-white/10 [&_pre]:p-2 [&_pre]:rounded-lg [&_pre]:my-2 [&_pre]:overflow-x-auto",
            "[&_pre>code]:bg-transparent [&_pre>code]:p-0",
            // For spacing between paragraphs/lists
            "[&>*:not(:last-child)]:mb-2"
          )}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              a: ({ node, ...props }) => <a target="_blank" rel="noopener noreferrer" {...props} />,
            }}
          >
            {message.content}
          </ReactMarkdown>
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
