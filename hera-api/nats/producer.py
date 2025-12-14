import nats
from colorama import Fore

class NatsProducer:
    def __init__(self, server: str, subject: str):
        self.server = server
        self.subject = subject
        self.nc = None

    async def connect(self):
        self.nc = await nats.connect(self.server) #type: ignore
    
    async def publish(self, msg: str):
        if self.nc is None:
            raise Exception("NATS publisher hasn't been connected")

        print(f"{Fore.BLUE}Attempting to publish to NATS subject {self.subject}")

        await self.nc.publish(self.subject, msg.encode())

        print(f"{Fore.BLUE}Flushing NATS subject {self.subject}")

        await self.nc.flush()

        print(f"{Fore.GREEN}Published message {msg} to NATS subject {self.subject}")

    async def closeConnection(self):
        if self.nc is None:
            raise Exception("NATS publisher hasn't been connected")

        print(f"{Fore.BLUE}Closing NATS publisher connection")
        await self.nc.close()
        print(f"{Fore.GREEN}Closed NATS publisher connection")
