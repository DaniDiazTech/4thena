
from bson import ObjectId
from src.core.base_repository import BaseRepository
from src.message.message_dto import CreateMessageDto
from src.message.message_model import Message


class MessageRepository(BaseRepository[Message, CreateMessageDto]):
    def __init__(self, database):
        collection = database["messages"]
        super().__init__(collection)

    async def set_merchant_id(
        self,
        message_id: str,
        merchant_id: str,
    ) -> dict | None:
        """
        Attach merchant_id to a message.
        """
        await self.collection.update_one(
            {"_id": ObjectId(message_id)},
            {"$set": {"merchant_id": merchant_id}},
        )

        return await self.get_by_id(message_id)

