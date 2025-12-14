"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface CorrectMerchantDialogProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: (validMerchant: string) => void
    currentInference: string
}

export function CorrectMerchantDialog({
    isOpen,
    onClose,
    onConfirm,
    currentInference,
}: CorrectMerchantDialogProps) {
    const [merchantName, setMerchantName] = useState("")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (merchantName.trim()) {
            onConfirm(merchantName.trim())
            setMerchantName("")
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Correct Merchant</DialogTitle>
                    <DialogDescription>
                        Enter the valid merchant name for this message. The current inference was "{currentInference}".
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="merchant-name">Valid Merchant Name</Label>
                            <Input
                                id="merchant-name"
                                value={merchantName}
                                onChange={(e) => setMerchantName(e.target.value)}
                                placeholder="E.g., Amazon, Walmart"
                                autoFocus
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={!merchantName.trim()}>
                            Confirm & Verify
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
