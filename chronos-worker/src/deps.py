from fastapi import Request
from src.core.database.session import get_database
from motor.motor_asyncio import AsyncIOMotorDatabase
from src.core.nats import NatsConnection

async def get_db() -> AsyncIOMotorDatabase:
    """
    Get MongoDB database instance
    """
    return get_database()

async def get_nats(request: Request) -> NatsConnection:
    """
    Get NATS connection from app state
    """
    return request.app.state.nats
