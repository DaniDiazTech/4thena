import requests

from typing import Any
from src.message.message_dto import CreateMessageDto
from src.message.provider import MessageProvider


class LinkedInProvider(MessageProvider):
    """
    LinkedIn message provider implementation
    """
    async def get(self) -> CreateMessageDto:
        r = requests.get(
            'http://apollo-api:8000/linkedin/messages?count=1',
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
            source='linkedin',
            txt=text,
            content=content
        )
