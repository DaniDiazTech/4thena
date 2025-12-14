import asyncio
import json
import logging

from src.message.message_repository import MessageRepository
from src.message.provider.linkedin_provider import LinkedInProvider
from src.message.provider.whatsapp_provider import WhatsAppProvider

logger = logging.getLogger(__name__)


class MessageWorker:
    def __init__(self, database, nats):
        self.database = database
        self.nats = nats
        self._task: asyncio.Task | None = None
        self._running = True

    async def create_message(self, provider):
        repository = MessageRepository(self.database)

        msg = await provider.get()
        saved = await repository.create(msg)

        await self.nats.publish("hera.new.msgs", json.dumps(saved).encode())

    async def run(self):
        providers = [
            WhatsAppProvider(),
            LinkedInProvider(),
        ]

        while self._running:
            for provider in providers:
                try:
                    await self.create_message(provider)
                except Exception:
                    logger.exception("Provider %s failed", provider.__class__.__name__)

            await asyncio.sleep(60)  # 1 minute

    async def start(self):
        self._task = asyncio.create_task(self.run())

    async def stop(self):
        self._running = False
        if self._task:
            self._task.cancel()
            with contextlib.suppress(asyncio.CancelledError):
                await self._task
