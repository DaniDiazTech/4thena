"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import * as React from "react"


import { openContract } from "@/lib/api"

interface MerchantSidebarProps {
  merchantName: string
  isOpen: boolean
  onClose: () => void
}

type DownloadContractButtonProps = {
    merchantId: string
}

export function DownloadContractButton({
    merchantId,
}: DownloadContractButtonProps) {
    const [loading, setLoading] = React.useState(false)

    const handleClick = async () => {
        try {
            setLoading(true)
            await openContract(merchantId)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Button
            type="button"
            onClick={handleClick}
            disabled={loading}
            variant="default"
        >
            {loading ? "Generating…" : "Download"}
        </Button>
    )
}

export function MerchantSidebar({ merchantName, isOpen, onClose }: MerchantSidebarProps) {
  const getInitial = (name: string) => name.charAt(0).toUpperCase()

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 lg:hidden" onClick={onClose} />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:relative top-0 right-0 h-full bg-sidebar border-l border-sidebar-border shadow-xl lg:shadow-none z-40 transition-all duration-300 ease-in-out
          ${isOpen ? "translate-x-0 w-80 opacity-100" : "translate-x-full lg:translate-x-0 w-0 lg:w-0 opacity-0 lg:opacity-0 overflow-hidden"}
        `}
      >
        <div className="h-full flex flex-col p-6 w-80">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-semibold text-sidebar-foreground">Merchant Details</h2>
            <Button variant="ghost" size="icon" onClick={onClose} className="lg:hidden text-sidebar-foreground/70">
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Merchant Profile */}
          <div className="mb-8 text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-sidebar-primary/20 flex items-center justify-center text-sidebar-primary text-3xl font-bold mb-4">
              {getInitial(merchantName)}
            </div>
            <h3 className="font-bold text-xl text-sidebar-foreground">{merchantName}</h3>

            <DownloadContractButton merchantId={merchantName}></DownloadContractButton>

          </div>
        </div>
      </div>
    </>
  )
}
