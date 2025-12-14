import json
import requests

from typing import Any
from src.message.message_dto import CreateMessageDto
from src.message.provider import MessageProvider


class WhatsAppProvider(MessageProvider):
    """
    WhatsApp message provider implementation
    """
    async def get(self) -> CreateMessageDto:
        r = requests.get(
            'http://localhost:4000/whatsapp/messages?count=1',
            timeout=10
        )
        r.raise_for_status()

        data = r.json()[0]

        text = data['text']

        content = {
            k: v for k, v in data.items()
            if k not in ['text', 'source']
        }

        return CreateMessageDto(
            source="whatsapp",
            txt=text,
            content=content
        )
