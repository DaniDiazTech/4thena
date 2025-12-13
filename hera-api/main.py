import asyncio
import colorama
from colorama import Fore

from manager.load_config import CONFIG
from service.nats_consumer import NATSConsumer
from milvus.milvus import Milvus

colorama.init(autoreset=True)

async def main():
    print(f"{Fore.BLUE}Starting Hera API NATS Consumer...")
    
    if CONFIG is None:
        print(f"{Fore.RED}Error: 'config.yaml' is empty or invalid.")
        return

    if 'nats' not in CONFIG:
        print(f"{Fore.RED}Error: 'nats' section missing in config.yaml")
        return

    if "milvus" not in CONFIG:
        print(f"{Fore.RED}Error: 'milvus' section missing in config.yaml")
        return 

    milvus_config = CONFIG["milvus"]
    milvus_client = Milvus(milvus_config["uri"], milvus_config["collection"])

    nats_config = CONFIG['nats']
    servers = nats_config.get('servers', ["nats://localhost:4222"])
    subject = nats_config.get('subject', ["hera.new.msgs"])

    consumer = NATSConsumer(servers, subject, milvus_client)
    await consumer.run()

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print(f"\n{Fore.YELLOW}Shutting down...")
