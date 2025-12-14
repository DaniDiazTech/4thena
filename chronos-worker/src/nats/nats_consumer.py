import json

from src.core.nats import NatsConnection
from src.message.message_repository import MessageRepository


class NatsConsumer:
    def __init__(self, nats: NatsConnection, db):
        self.nats = nats
        self.repo = MessageRepository(db)

    async def start(self):
        await self.nats.subscribe(
            "hera.update.msg",
            self.handle_message,
        )

    async def handle_message(self, msg):
        payload = json.loads(msg.data.decode())

        await self.repo.set_merchant_id(
            message_id=payload["msg_id"],
            merchant_id=payload["merchant_id"],
        )
