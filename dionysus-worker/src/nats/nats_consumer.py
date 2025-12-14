import json

from src.core.nats import NatsConnection
from src.message.message_repository import MessageRepository


class NatsConsumer:
    def __init__(self, nats: NatsConnection, db):
        self.nats = nats
        self.repo = MessageRepository(db)

    async def start(self):
        await self.nats.subscribe(
            "hera.predict.id",
            self.handle_message,
        )

    async def handle_message(self, msg):
        print(msg)
        payload = json.loads(msg.data.decode())
        print(f'Received payload: {payload}')
        await self.repo.create(payload)
