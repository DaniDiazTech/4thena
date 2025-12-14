import asyncio
import colorama
from colorama import Fore
from dotenv import load_dotenv
import os

from manager.load_config import CONFIG
from service import merchant_id_identifier
from service.nats_consumer import NATSConsumer
from milvus.milvus import Milvus
from service.merchant_id_identifier import MerchantIDIdentifier
from service.summarizer import Summarizer
from ai.embeddings import EmbeddingsService
from ai.llm import LLMinteractor

load_dotenv()

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

    if os.getenv("GEMINI_API_KEY") is None:
        print(f"{Fore.RED}Error: 'GEMINI_API_KEY' api key not in enviroment variables")
        return

    gemini_api_key = os.getenv("GEMINI_API_KEY")
    llm = LLMinteractor(gemini_api_key)
    embeddings_service = EmbeddingsService(gemini_api_key)

    merchant_id_identifier = MerchantIDIdentifier(llm, embeddings_service)

    milvus_config = CONFIG["milvus"]
    milvus_client = Milvus(milvus_config["uri"], milvus_config["collection"])

    nats_config = CONFIG['nats']
    servers = nats_config.get('servers', ["nats://localhost:4222"])
    subject = nats_config.get('subject', ["hera.new.msgs"])

    consumer = NATSConsumer(servers, subject, milvus_client, merchant_id_identifier)
    await consumer.run()

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print(f"\n{Fore.YELLOW}Shutting down...")
