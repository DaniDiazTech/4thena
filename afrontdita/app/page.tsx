"use client"

import { useState } from "react"
import { SearchPage } from "@/components/search-page"
import { ChatPage } from "@/components/chat-page"

// Mock merchant data for demonstration
const MOCK_MERCHANTS = [
  {
    id: "1",
    name: "Amazon",
    category: "E-commerce",
    description: "Global online marketplace and technology company",
  },
  {
    id: "2",
    name: "Stripe",
    category: "Payment Processing",
    description: "Online payment processing platform for internet businesses",
  },
  {
    id: "3",
    name: "Shopify",
    category: "E-commerce Platform",
    description: "Commerce platform for online stores and retail point-of-sale systems",
  },
  {
    id: "4",
    name: "PayPal",
    category: "Digital Payments",
    description: "Digital payments and money transfer service",
  },
  {
    id: "5",
    name: "Square",
    category: "Payment Solutions",
    description: "Financial services and mobile payment company",
  },
]

export default function Home() {
  const [selectedMerchant, setSelectedMerchant] = useState<(typeof MOCK_MERCHANTS)[0] | null>(null)

  const handleMerchantSelect = (merchant: (typeof MOCK_MERCHANTS)[0]) => {
    setSelectedMerchant(merchant)
  }

  const handleBackToSearch = () => {
    setSelectedMerchant(null)
  }

  return (
    <main className="min-h-screen bg-background">
      {!selectedMerchant ? (
        <SearchPage merchants={MOCK_MERCHANTS} onMerchantSelect={handleMerchantSelect} />
      ) : (
        <ChatPage merchant={selectedMerchant} onBack={handleBackToSearch} />
      )}
    </main>
  )
}
