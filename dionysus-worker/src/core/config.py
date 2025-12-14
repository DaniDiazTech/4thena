import os

from pydantic_settings import BaseSettings
from dotenv import load_dotenv


load_dotenv()


class Settings(BaseSettings):
    MONGO_URI: str
    MONGO_NAME: str
    NATS_URI: str


settings = Settings(
    MONGO_URI=os.getenv('MONGO_URI'),
    MONGO_NAME=os.getenv('MONGO_NAME'),
    NATS_URI=os.getenv('NATS_URI'),
)
