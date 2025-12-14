"use client"

import { useState } from "react"
import { Check, X, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { CorrectMerchantDialog } from "@/components/correct-merchant-dialog"

interface UnverifiedMessage {
    id: string
    content: string
    inferredMerchant: string
    timestamp: string
}

const MOCK_MESSAGES: UnverifiedMessage[] = [
    {
        id: "1",
        content: "Payment of $45.00 to AMZN MKTPLACE WA received on 12/12/2023. Reference #928392.",
        inferredMerchant: "Amazon",
        timestamp: "2 mins ago",
    },
    {
        id: "2",
        content: "Uber Trip help.uber.com CA Dec 11. Your trip receipt.",
        inferredMerchant: "Uber Eats",
        timestamp: "15 mins ago",
    },
    {
        id: "3",
        content:
            "TST* SBUX - 800 - 1234. Coffee purchase. This is a very long message content designed to test the collapsible functionality of the card component. It should show a show less or show more button depending on the state of the card. Let's add even more text to ensure it wraps multiple lines.",
        inferredMerchant: "Starbucks",
        timestamp: "1 hour ago",
    },
]

export function UnverifiedMessageList() {
    const [messages, setMessages] = useState<UnverifiedMessage[]>(MOCK_MESSAGES)
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
    const [removingId, setRemovingId] = useState<string | null>(null)

    // Dialog State
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [selectedMessage, setSelectedMessage] = useState<UnverifiedMessage | null>(null)

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

    const handleRatify = async (id: string) => {
        // Call mock API
        console.log(`Ratifying message ${id}`)
        removeMessage(id)
    }

    const handleCorrect = (message: UnverifiedMessage) => {
        setSelectedMessage(message)
        setIsDialogOpen(true)
    }

    const handleConfirmCorrection = (validMerchant: string) => {
        if (selectedMessage) {
            console.log(`Correcting message ${selectedMessage.id} to ${validMerchant}`)
            setIsDialogOpen(false)
            setSelectedMessage(null)
            removeMessage(selectedMessage.id)
        }
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
                                                onClick={() => handleRatify(message.id)}
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
