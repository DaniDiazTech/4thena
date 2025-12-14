import asyncio
import nats
from nats.errors import NoServersError
from colorama import Fore

import traceback

from ai.llm import LLMinteractor
from milvus.milvus import Milvus
from service.merchant_id_identifier import MerchantIDIdentifier

import numpy as np


class NATSConsumer:
    def __init__(
        self,
        servers: list[str],
        subjects: list[str],
        milvus_client: Milvus,
        merchant_id_identifier: MerchantIDIdentifier,
    ):
        self.servers = servers
        self.subjects = subjects
        self.nc = None
        self.milvus_client = milvus_client
        self.merchant_id_identifier = merchant_id_identifier

        self.queue: asyncio.Queue = asyncio.Queue()

    async def connect(self):
        print(f"{Fore.GREEN}Attempting NATS connection")
        try:
            self.nc = await nats.connect(self.servers)
            print(f"{Fore.GREEN}Connected to NATS servers: {self.servers}")
        except NoServersError:
            print(f"{Fore.RED}Could not connect to any NATS server.")
            return

    async def message_handler(self, msg):
        print(f"{Fore.GREEN} incoming message {msg}")
        await self.queue.put(msg)

    async def process_message(self, msg):
        subject = msg.subject
        data = msg.data.decode()
        print(f"{Fore.CYAN}[{subject}] {data}")

        embedding = self.merchant_id_identifier.identifyMerchantIdEmbedding(data)

        res = await self.milvus_client.search(embedding)

        if res is None or len(res) == 0 or len(res[0]) == 0:
            print(f"{Fore.RED}Error: milvus empty or couldn't query")
            return

        merchant_id_list = [m.merchant_id for m in res[0]]  # type: ignore

        if not merchant_id_list:
            print(f"{Fore.GREEN}Vector DB is empty")
            return

        merchant_id_list = np.array(merchant_id_list)
        values, counts = np.unique(merchant_id_list, return_counts=True)
        mode = values[counts.argmax()]

        print(f"{Fore.GREEN}The predicted merchant id is: {mode}")

    async def worker(self):
        while True:
            msg = await self.queue.get()
            try:
                await self.process_message(msg)
            except Exception as e:
                print(f"{Fore.RED}Error processing message: {e}")
                print(e.__traceback__)
                traceback.print_stack()
            finally:
                self.queue.task_done()

    async def subscribe(self):
        if not self.nc:
            print(f"{Fore.YELLOW}Not connected to NATS. Cannot subscribe.")
            return

        for subject in self.subjects:
            await self.nc.subscribe(subject, cb=self.message_handler)
            print(f"{Fore.GREEN}Subscribed to: {subject}")

    async def run(self):
        await self.milvus_client.connect()
        await self.connect()
        await self.subscribe()

        asyncio.create_task(self.worker())

        while True:
            await asyncio.sleep(1)
