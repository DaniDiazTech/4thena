from typing import List
from colorama import Fore
from pymilvus import MilvusClient

from .schema import IDENTIFYING_MSG_SCHEMA 

class Milvus:
    def __init__(self, uri: str, collection: str):
        self.client: MilvusClient | None = None
        self.uri = uri
        self.collection = collection

    async def connect(self) -> None:
        print(f"{Fore.GREEN}Attempting Milvus connection on uri {self.uri}")
        try:
            self.client = MilvusClient(
                uri=self.uri
            )
            _ = self.client.list_collections()
        except Exception as e:
            print(f"{Fore.RED}Couldn't establish milvus connection")
            raise e

        if not self.client.has_collection(self.collection):
            print(f"{Fore.BLUE}Milvus collection {self.collection} doesn't exist, creatuing now")
            self.client.create_collection(
                collection_name=self.collection,
                schema=IDENTIFYING_MSG_SCHEMA,
                metric_type="COSINE"
            )
            print(f"{Fore.GREEN}Milvus collection {self.collection} created successfully")
            index_params = self.client.prepare_index_params()
            index_params.add_index(
                field_name="vector",
                index_type="IVF_SQ8",
                metric_type="COSINE",
                params={"nlist":1024}
            )
            self.client.create_index(
                collection_name=self.collection,
                index_params=index_params
            )
        else:
            print(f"{Fore.GREEN}Milvus collection {self.collection} already exists")

        self.client.load_collection(
            collection_name=self.collection
        )

    async def insert(self, vector: List[float], merchant_id: str, msg_id: str) -> None:
        if self.client is None:
            print(f"{Fore.RED}Please run connect() first")
            return

        try:
            print(f"{Fore.BLUE}Inserting into Milvus collection {self.collection}")
            self.client.insert(
                collection_name=self.collection,
                data=[
                    {
                        "merchant_id": merchant_id,
                        "msg_id": msg_id,
                        "vector": vector
                    }
                ]
            )
        except Exception as e:
            print(f"{Fore.RED}Inserting into Milvus collection {self.collection} FAILED")
            print(e)
            return

    async def search(self, vector: List[float]) -> List | None:
        if self.client is None:
            print(f"{Fore.RED}Please run connect() first")
            return 

        res = self.client.search(
            collection_name=self.collection,
            anns_field="vector",
            data=[vector],
            limit=5,
            output_fields=["id", "merchant_id", "msg_id"],
            search_params={"metric_type": "COSINE"}
        )

        return res
