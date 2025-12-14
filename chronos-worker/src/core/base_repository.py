from typing import TypeVar, Generic, Optional, Type, List, Dict, Any
from pydantic import BaseModel
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorCollection

ModelType = TypeVar("ModelType", bound=BaseModel)
CreateSchemaType = TypeVar("CreateSchemaType", bound=BaseModel)


class BaseRepository(Generic[ModelType, CreateSchemaType]):
    collection: AsyncIOMotorCollection

    @staticmethod
    def _document_to_standard_dict(
        doc: Optional[Dict[str, Any]],
    ) -> Optional[Dict[str, Any]]:
        """
        Converts a MongoDB document to a standardized dictionary suitable for Pydantic/JSON.
        Converts _id (ObjectId) to id (str).
        """
        if doc is None:
            return None

        doc_copy = dict(doc)

        if "_id" in doc_copy:
            doc_copy["id"] = str(doc_copy.pop("_id"))
        return doc_copy

    def __init__(self, collection: AsyncIOMotorCollection) -> None:
        self.collection = collection

    async def get_all(self) -> List[dict]:
        """Get all documents from collection"""
        cursor = self.collection.find()
        documents = await cursor.to_list(length=None)

        return [self._document_to_standard_dict(doc) for doc in documents]

    async def get_by_id(self, id: str) -> Optional[dict]:
        """Get document by ID"""
        return await self.collection.find_one({"_id": ObjectId(id)})

    async def create(self, new_object: CreateSchemaType) -> dict:
        """Create new document and return the standardized result."""
        obj_data = new_object.model_dump(exclude_none=True)

        result = await self.collection.insert_one(obj_data)

        created_doc = await self.collection.find_one({"_id": result.inserted_id})
        
        # Apply conversion before returning
        return self._document_to_standard_dict(created_doc)

    async def update(self, id: str, update_data: dict) -> Optional[dict]:
        """Update document by ID"""
        await self.collection.update_one({"_id": ObjectId(id)}, {"$set": update_data})

        return await self.get_by_id(id)

    async def delete(self, id: str) -> bool:
        """Delete document by ID"""
        result = await self.collection.delete_one({"_id": ObjectId(id)})
        return result.deleted_count > 0
