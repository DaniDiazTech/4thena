"use client"

import { useState, useEffect } from "react"
import { Check, X, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { CorrectMerchantDialog } from "@/components/correct-merchant-dialog"
import { getUnverifiedMessages, ratifyMessage, UnverifiedMessage as ApiMessage } from "@/lib/api"

interface UIMessage {
    id: string
    content: string
    inferredMerchant: string
    timestamp: string
    merchant_id?: string
}

export function UnverifiedMessageList() {
    const [messages, setMessages] = useState<UIMessage[]>([])
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
    const [removingId, setRemovingId] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    // Dialog State
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [selectedMessage, setSelectedMessage] = useState<UIMessage | null>(null)

    useEffect(() => {
        const fetchMessages = async () => {
            setIsLoading(true)
            const apiMessages = await getUnverifiedMessages()
            const uiMessages: UIMessage[] = apiMessages.map((msg) => ({
                id: msg.id,
                content: msg.txt,
                // Use merchant_id as inferredMerchant, fallback to Unknown if missing
                inferredMerchant: msg.merchant_id || "Unknown",
                merchant_id: msg.merchant_id,
                // API doesn't provide timestamp, so we mock it or leave it generic
                timestamp: "Just now",
            }))
            setMessages(uiMessages)
            setIsLoading(false)
        }

        fetchMessages()
    }, [])

    const toggleExpand = (id: string) => {
        const newExpanded = new Set(expandedIds)
        if (newExpanded.has(id)) {
            newExpanded.delete(id)
        } else {
            newExpanded.add(id)
        }
        setExpandedIds(newExpanded)
    }

    const removeMessage = (id: string) => {
        setRemovingId(id)
        // Wait for animation to finish before removing from state
        setTimeout(() => {
            setMessages((prev) => prev.filter((m) => m.id !== id))
            setRemovingId(null)
        }, 300) // Match CSS transition duration
    }

    const handleRatify = async (message: UIMessage) => {
        try {
            await ratifyMessage(message.id, message.merchant_id || "")
            console.log(`Ratified message ${message.id} with merchant ${message.merchant_id}`)
            removeMessage(message.id)
        } catch (error) {
            console.error("Failed to ratify message", error)
            // Optionally handle error in UI (toast etc)
        }
    }

    const handleCorrect = (message: UIMessage) => {
        setSelectedMessage(message)
        setIsDialogOpen(true)
    }

    const handleConfirmCorrection = async (validMerchant: string) => {
        if (selectedMessage) {
            try {
                console.log(`Correcting message ${selectedMessage.id} to ${validMerchant}`)
                await ratifyMessage(selectedMessage.id, validMerchant)
                setIsDialogOpen(false)
                setSelectedMessage(null)
                removeMessage(selectedMessage.id)
            } catch (error) {
                console.error("Failed to correct message", error)
            }
        }
    }

    if (isLoading) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground">Loading messages...</p>
            </div>
        )
    }

    if (messages.length === 0) {
        return (
            <div className="text-center py-12 animate-fade-in">
                <p className="text-muted-foreground">No unverified messages at the moment.</p>
                <p className="text-sm text-muted-foreground mt-1">Great job clearing the queue!</p>
            </div>
        )
    }

    return (
        <>
            <div className="space-y-4">
                {messages.map((message) => {
                    const isExpanded = expandedIds.has(message.id)
                    const isRemoving = removingId === message.id

                    return (
                        <div
                            key={message.id}
                            className={cn(
                                "transition-all duration-300 ease-in-out",
                                isRemoving ? "opacity-0 -translate-x-full h-0 mb-0 overflow-hidden" : "opacity-100 translate-x-0"
                            )}
                        >
                            <Card className="overflow-hidden">
                                <CardContent className="p-4">
                                    <div className="flex items-start gap-4">
                                        {/* Content Section */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-xs text-muted-foreground font-mono">{message.timestamp}</span>
                                                <Badge variant="outline" className="text-xs font-normal">
                                                    Inferred: <span className="font-semibold ml-1">{message.inferredMerchant}</span>
                                                </Badge>
                                            </div>

                                            <div className="relative">
                                                <p
                                                    className={cn(
                                                        "text-sm text-foreground leading-relaxed transition-all",
                                                        !isExpanded && "line-clamp-2"
                                                    )}
                                                >
                                                    {message.content}
                                                </p>
                                                {message.content.length > 100 && (
                                                    <button
                                                        onClick={() => toggleExpand(message.id)}
                                                        className="text-xs text-primary font-medium flex items-center gap-1 mt-1 hover:underline"
                                                    >
                                                        {isExpanded ? (
                                                            <>Show less <ChevronUp className="h-3 w-3" /></>
                                                        ) : (
                                                            <>Show more <ChevronDown className="h-3 w-3" /></>
                                                        )}
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Actions Section */}
                                        <div className="flex flex-col gap-2 shrink-0">
                                            <Button
                                                variant="default"
                                                size="icon"
                                                className="h-8 w-8 bg-green-600 hover:bg-green-700 text-white shadow-sm"
                                                onClick={() => handleRatify(message)}
                                                title="Ratify (Correct)"
                                            >
                                                <Check className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                className="h-8 w-8 shadow-sm"
                                                onClick={() => handleCorrect(message)}
                                                title="Reject (Incorrect)"
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )
                })}
            </div>

            <CorrectMerchantDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onConfirm={handleConfirmCorrection}
                currentInference={selectedMessage?.inferredMerchant || ""}
            />
        </>
    )
}
