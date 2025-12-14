export async function openContract(merchantId: string, message: string, context: string): Promise<string> {
    try {
        const response = await fetch('http://127.0.0.1:8000/contract', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                merchant_id: merchantId,
            }),
        })
      
        console.log(response)

        if (!response.ok) {
            throw new Error('Failed to fetch query response')
        }

        const blob = await response.blob()
        const url = URL.createObjectURL(blob)

        window.open(url, '_blank')

    } catch (error) {
        console.error('Error sending query:', error)
        return "I'm sorry, I couldn't process your request at the moment."
    }
}

export async function sendQuery(merchantId: string, message: string, context: string): Promise<string> {
    try {
        const response = await fetch('http://127.0.0.1:8000/query', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt_msg: message,
                context: context,
                merchant_id: merchantId,
            }),
        })

        if (!response.ok) {
            throw new Error('Failed to fetch query response')
        }

        const data = await response.json()
        return data.response
    } catch (error) {
        console.error('Error sending query:', error)
        return "I'm sorry, I couldn't process your request at the moment."
    }
}



export interface MessageContent {
    from: string;
    from_name: string;
    to: string;
    to_name: string;
    is_yuno_response: boolean;
}

export interface UnverifiedMessage {
    source: string;
    txt: string; // This maps to content in UI
    ratified: boolean;
    content: MessageContent;
    id: string;
    merchant_id?: string; // Assumed field based on requirements
}

export async function getMerchants(): Promise<string[]> {
    try {
        const response = await fetch('http://localhost:8000/merchants', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // If the API expects a body, we can add it here.
            // Based on "retrieves a list of merchants", it might not need one,
            // but usually POST implies some payload or action.
            // Since no payload was specified, we'll send an empty object or nothing.
            // We'll trust the user's instruction that it's a simple retrieval via POST.
        })

        if (!response.ok) {
            throw new Error('Failed to fetch merchants')
        }

        const data = await response.json()
        return data
    } catch (error) {
        console.error('Error fetching merchants:', error)
        return []
    }
}

export async function getUnverifiedMessages(): Promise<UnverifiedMessage[]> {
    try {
        const response = await fetch('http://localhost:9000/message/list', {
            method: 'GET',
            headers: {
                'accept': 'application/json',
            },
        })

        if (!response.ok) {
            throw new Error('Failed to fetch unverified messages')
        }

        const data = await response.json()
        return data
    } catch (error) {
        console.error('Error fetching unverified messages:', error)
        return []
    }
}

export async function ratifyMessage(messageId: string, merchantId: string): Promise<void> {
    try {
        const response = await fetch('http://localhost:9000/messages/ratify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message_id: messageId,
                merchant_id: merchantId,
            }),
        })

        if (!response.ok) {
            throw new Error('Failed to ratify message')
        }
    } catch (error) {
        console.error('Error ratifying message:', error)
        throw error
    }
}
