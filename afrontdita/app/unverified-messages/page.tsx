"use client"

import { UnverifiedMessageList } from "@/components/unverified-message-list"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function UnverifiedMessagesPage() {
    return (
        <div className="min-h-screen flex flex-col">
            {/* Header */}
            <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10 transition-all duration-200">
                <div className="container mx-auto px-4 py-4 flex items-center gap-3">
                    <Button variant="ghost" size="icon" asChild className="shrink-0" aria-label="Back to search">
                        <Link href="/">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <Logo />
                    <h1 className="text-xl font-semibold text-foreground">Unverified Messages</h1>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 container mx-auto px-4 py-8 max-w-3xl">
                <div className="mb-6 space-y-1">
                    <h2 className="text-2xl font-bold tracking-tight">Pending Verification</h2>
                    <p className="text-muted-foreground">
                        Review and verify inferred merchants from messages.
                    </p>
                </div>
                <UnverifiedMessageList />
            </main>
        </div>
    )
}
