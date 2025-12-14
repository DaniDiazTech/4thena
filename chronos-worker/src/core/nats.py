from nats.aio.client import Client as NATS
from typing import Callable
from src.core.config import settings
from src.core.core_deps import logger


class NatsConnection:
    def __init__(self):
        self._client: NATS | None = None
        self._subscriptions = []

    async def connect(self):
        if self._client and self._client.is_connected:
            return

        self._client = NATS()
        await self._client.connect(
            servers=[settings.NATS_URI],
            name=getattr(settings, "NATS_CLIENT_NAME", "chronos-client"),
        )

        logger.info("✅ Connected to NATS")

    async def subscribe(self, subject: str, cb: Callable):
        if not self._client or not self._client.is_connected:
            await self.connect()

        sid = await self._client.subscribe(subject, cb=cb)
        self._subscriptions.append(sid)

        logger.info(f"📡 Subscribed to {subject}")
        return sid

    async def publish(self, subject: str, data: bytes):
        if not self._client or not self._client.is_connected:
            await self.connect()

        await self._client.publish(subject, data)
        logger.info(f"📤 Published to {subject}")

    async def close(self):
        if self._client and self._client.is_connected:
            for sid in self._subscriptions:
                await self._client.unsubscribe(sid)

            await self._client.close()
            logger.info("🔌 NATS connection closed")
