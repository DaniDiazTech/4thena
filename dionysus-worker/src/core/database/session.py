from motor.motor_asyncio import AsyncIOMotorClient
from src.core.config import settings

# MongoDB client
mongodb_client: AsyncIOMotorClient = None

async def connect_to_mongo():
    global mongodb_client
    mongodb_client = AsyncIOMotorClient(settings.MONGO_URI)
    print("✅ Connected to MongoDB Atlas")

async def close_mongo_connection():
    global mongodb_client
    if mongodb_client:
        mongodb_client.close()
        print("👋 MongoDB connection closed")

def get_database():
    return mongodb_client[settings.MONGO_NAME]
