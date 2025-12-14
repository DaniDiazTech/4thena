"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { ArrowLeft, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChatMessage } from "@/components/chat-message"
import { MerchantSidebar } from "@/components/merchant-sidebar"
import { EmptyChat } from "@/components/empty-chat"
import { Logo } from "@/components/logo"

interface Merchant {
  id: string
  name: string
  category: string
  description: string
}

interface Message {
  id: string


  role: "user" | "model"
  content: string
  timestamp: Date
}

interface ChatPageProps {
  merchant: Merchant
  onBack: () => void
}

export function ChatPage({ merchant, onBack }: ChatPageProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const modelMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "model",
        content: `I understand you're asking about ${merchant.name}. Based on the available data, ${merchant.name} is a ${merchant.category.toLowerCase()} with 2929 transactions and a volume of 2020. How else can I help you analyze this merchant?`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, modelMessage])
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="h-screen flex flex-col">
      <header className="border-b bg-card/50 backdrop-blur-sm z-20 shrink-0 sticky top-0">
        <div className="container mx-auto px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack} className="shrink-0" aria-label="Back to search">
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <Logo />

          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-semibold text-foreground truncate">{merchant.name}</h1>
            <p className="text-xs text-muted-foreground truncate">{merchant.category}</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto">
            <div className="container mx-auto px-4 py-6 max-w-3xl">
              {messages.length === 0 ? (
                <EmptyChat merchantName={merchant.name} />
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <ChatMessage key={message.id} message={message} />
                  ))}
                  {isLoading && (
                    <div className="flex items-start gap-3 animate-fade-in">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                        <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>
          </div>

          {/* Input Area */}
          <div className="border-t bg-card/50 backdrop-blur-sm shrink-0">
            <div className="container mx-auto px-4 py-4 max-w-3xl">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={`Ask anything about ${merchant.name}...`}
                  disabled={isLoading}
                  className="flex-1 bg-background"
                  aria-label="Message input"
                />
                <Button type="submit" disabled={!input.trim() || isLoading} size="icon" aria-label="Send message">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        </div>

        <MerchantSidebar merchant={merchant} />
      </div>
    </div>
  )
}
