import asyncio
import colorama
from colorama import Fore
from dotenv import load_dotenv
import os

from manager.load_config import CONFIG

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

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print(f"\n{Fore.YELLOW}Shutting down...")
