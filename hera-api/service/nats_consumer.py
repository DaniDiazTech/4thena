import asyncio
import nats
from nats.errors import NoServersError
from colorama import Fore

from milvus.milvus import Milvus

class NATSConsumer:
    def __init__(self, servers: list[str], subjects: list[str], milvus_client: Milvus):
        self.servers = servers
        self.subjects = subjects
        self.nc = None
        self.milvus_client = milvus_client

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
