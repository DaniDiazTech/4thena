import os
import sys
from contextlib import asynccontextmanager

from fastapi import FastAPI
from src.core.database.session import connect_to_mongo, close_mongo_connection
from src.core.nats import NatsConnection
from src.message.message_worker import MessageWorker
from src.nats.nats_consumer import NatsConsumer
from src.core.database.session import get_database

sys.path.append(os.path.join(os.getcwd(), "./src"))

nats = NatsConnection()

@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_to_mongo()
    app.state.db = get_database()

    await nats.connect()
    app.state.nats = nats

    consumer = NatsConsumer(nats, app.state.db)
    await consumer.start()

    yield

    await worker.stop()
    await nats.close()
    await close_mongo_connection()


app = FastAPI(title="Chronos API", version="0.0.1", lifespan=lifespan)
