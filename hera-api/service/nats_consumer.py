import asyncio
import nats
from nats.errors import NoServersError
from colorama import Fore

from ai.llm import LLMinteractor
from milvus.milvus import Milvus
from service.merchant_id_identifier import MerchantIDIdentifier

import numpy as np

class NATSConsumer:
    def __init__(self, servers: list[str], subjects: list[str], milvus_client: Milvus, llm: LLMinteractor, merchant_id_identifier: MerchantIDIdentifier):
        self.servers = servers
        self.subjects = subjects
        self.nc = None
        self.milvus_client = milvus_client
        self.llm = llm
        self.merchant_id_identifier = merchant_id_identifier

    async def connect(self):
        print(f"{Fore.GREEN}Attempting NATS connection")
        try:
            self.nc = await nats.connect(self.servers)
            print(f"{Fore.GREEN}Connected to NATS servers: {self.servers}")
        except NoServersError:
            print(f"{Fore.RED}Could not connect to any NATS server.")
            return

    async def message_handler(self, msg):
        subject = msg.subject
        data = msg.data.decode()
        print(f"{Fore.CYAN}[{subject}] {data}")

        embedding = self.merchant_id_identifier.identifyMerchantIdEmbedding(data)
        res = self.milvus_client.search(embedding)

        if res is None:
            print(f"{Fore.RED}Error: couldn't query milvus")
            return

        merchant_id_list = []
        for msg in res: #type: ignore
            merchant_id_list.append(msg.merchant_id)

        if len(merchant_id_list) == 0:
            print(f"{Fore.GREEN}Vector DB is empty")
            return
        
        merchant_id_list = np.array(merchant_id_list)
        values, counts = np.unique(merchant_id_list, return_counts=True)
        max_count = counts.max()
        mode = values[counts == max_count][0]

        print(f"{Fore.GREEN}The predicted merchant id is: {mode}")

        return

            

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

        # Keep process alive so messages can be received
        while True:
            await asyncio.sleep(1)
