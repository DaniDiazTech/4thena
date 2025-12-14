from typing import List
from pymongo import MongoClient
import os
from colorama import Fore
from bson import ObjectId
from manager.load_config import CONFIG

client = None

def get_db():
    db_name = os.getenv("MONGO_DB_NAME", "athena_db")
    global client
    if client is not None:
        return client[db_name]

    print(f"{Fore.BLUE}Attempting connection to mongo")
    mongo_uri = os.getenv("MONGO_URI")
    client = MongoClient(mongo_uri)
    print(f"{Fore.GREEN}Mongo connection established")
    return client[db_name]

def updateMessageMerchantId(merchant_id: str, msg_id: str):
    db = get_db()

    messages_col = db["messages"]


    doc = messages_col.find_one({"_id": ObjectId(msg_id)})
    print("iSOISNOINSONOSNOI")
    print(doc)
    print("iSOISNOINSONOSNOI")
    result = messages_col.update_one(
        {"_id": ObjectId(msg_id)},
        {"$set": {"merchant_id": merchant_id}},
    )

    print(result)

def getQueryMsgs(msg_ids: List[str]):
    db = get_db()

    print(f"{Fore.BLUE}Querying messages table")
    messages_col = db["messages"]
    messages_cursor = messages_col.find({"_id": {"$in": msg_ids}})

    full_msgs_txt = []
    for doc in messages_cursor:
        full_msgs_txt.append(doc["txt"])

    print(f"{Fore.BLUE}Found a total of {len(full_msgs_txt)}")
    
    return full_msgs_txt
