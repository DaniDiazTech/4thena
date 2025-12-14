from enum import Enum
from pydantic import BaseModel
from typing import Dict, Any


class MessageSource(str, Enum):
    WHATSAPP = "whatsapp"
    LINKEDIN = "linkedin"
    CALL = "call"
    EMAIL = "email"


class Message(BaseModel):
    source: MessageSource
    txt: Dict[str, Any]
