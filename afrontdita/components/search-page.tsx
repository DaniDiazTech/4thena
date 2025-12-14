"use client"

import { useState, useMemo } from "react"
import { Search, Box } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { MerchantCard } from "@/components/merchant-card"
import { Logo } from "@/components/logo"

interface Merchant {
  id: string
  name: string
  category: string
  description: string
}

interface SearchPageProps {
  merchants: Merchant[]
  onMerchantSelect: (merchant: Merchant) => void
}

export function SearchPage({ merchants, onMerchantSelect }: SearchPageProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredMerchants = useMemo(() => {
    if (!searchQuery.trim()) return merchants

    const query = searchQuery.toLowerCase()
    return merchants.filter(
      (merchant) =>
        merchant.name.toLowerCase().includes(query) ||
        merchant.category.toLowerCase().includes(query) ||
        merchant.description.toLowerCase().includes(query),
    )
  }, [merchants, searchQuery])

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Logo />
            <h1 className="text-xl font-semibold text-foreground">4tena</h1>
          </div>
          <Link href="/unverified-messages">
            <Button variant="ghost" size="icon" aria-label="Unverified Messages">
              <Box className="h-5 w-5 text-muted-foreground" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
            Financial Intelligence at Your Fingertips
          </h2>
          <p className="text-lg text-muted-foreground text-balance max-w-2xl mx-auto">
            Search for merchants and get AI-powered insights about payment processing, transaction volumes, and business
            intelligence
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
            <Input
              type="search"
              placeholder="Search merchants by name, category, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 text-base bg-card shadow-sm border-border focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="Search merchants"
            />
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            {filteredMerchants.length} {filteredMerchants.length === 1 ? "merchant" : "merchants"} found
          </p>
        </div>

        {/* Merchant List */}
        <div className="space-y-3">
          {filteredMerchants.length > 0 ? (
            filteredMerchants.map((merchant, index) => (
              <div key={merchant.id} className="animate-fade-in" style={{ animationDelay: `${0.1 + index * 0.05}s` }}>
                <MerchantCard merchant={merchant} onClick={() => onMerchantSelect(merchant)} />
              </div>
            ))
          ) : (
            <div className="text-center py-12 animate-fade-in">
              <div className="text-muted-foreground text-lg mb-2">No merchants found</div>
              <p className="text-sm text-muted-foreground">Try adjusting your search query</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
