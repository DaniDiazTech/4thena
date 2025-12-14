
from abc import ABC, abstractmethod
from typing import Dict, Any
from src.message.message_model import Message


class MessageProvider(ABC):
    """Abstract base class for message providers"""
    
    @abstractmethod
    async def get(self) -> Dict[str, Any]:
        """
        Send a message through the provider
        """
        pass
