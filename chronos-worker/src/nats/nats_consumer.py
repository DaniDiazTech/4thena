from src.core.nats import NatsConnection


class NatsConsumer:
    def __init__(self, nats: NatsConnection, db):
        self.nats = nats
        self.db = db

    async def start(self):
        await self.nats.subscribe(
            "hera.update.msg",
            self.handle_message,
        )

    async def handle_message(self, msg):
        payload = json.loads(msg.data.decode())

        await self.db.messages.update_one(
            {"_id": payload["msg_id"]},
            {"$set": payload},
        )
